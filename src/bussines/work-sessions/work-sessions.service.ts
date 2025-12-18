import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CheckInDto } from './dto/check-in.dto';
import { CreateWorkSessionDto } from './dto/create-work-session.dto';
import { UpdateWorkSessionDto } from './dto/update-work-session.dto';
import { WorkSession } from './entities/work-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Formatdate } from 'src/common/utils/date.util';
import { Users } from 'src/core/users/entities/user.entity';
import { Status } from 'src/common/enum/status.enum';
import { CheckOutDto } from './dto/check-out.dto';

@Injectable()
export class WorkSessionsService {
  constructor(
    @InjectRepository(WorkSession)
    private workSessionsRepository: Repository<WorkSession>,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(createWorkSessionDto: CreateWorkSessionDto) {
    const workSession =
      this.workSessionsRepository.create(createWorkSessionDto);
    return this.workSessionsRepository.save(workSession);
  }

  findAll() {
    return `This action returns all workSessions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workSession`;
  }

  async checkIn(checkInDto: CheckInDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_id: checkInDto.user_id },
        relations: ['company'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Close previous work session
      await this.workSessionsRepository.update(
        { user: { user_id: checkInDto.user_id }, status: Status.ACTIVE },
        { status: Status.FORCE_CLOSED, check_out: Formatdate() },
      );

      // Update user status
      await this.usersRepository.update(user.user_id, { is_active: true });

      // Create new work session
      const workSession = await this.workSessionsRepository.create({
        user: { user_id: checkInDto.user_id },
        company: { company_id: user.company_id },
        check_in: Formatdate(),
        status: Status.ACTIVE,
        total_time: 0,
      });

      return this.workSessionsRepository.save(workSession);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async checkOut(checkOutDto: CheckOutDto) {
    try {
      // Find user by user_id and retations company
      const user = await this.usersRepository.findOne({
        where: { user_id: checkOutDto.user_id },
        relations: ['company'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update user status
      await this.usersRepository.update(user.user_id, { is_active: false });

      // Update work session
      await this.workSessionsRepository.update(
        { user: { user_id: checkOutDto.user_id }, status: Status.ACTIVE },
        { status: Status.INACTIVE, check_out: Formatdate() },
      );

      return 'This action checks out a workSession';
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateWorkSessionDto: UpdateWorkSessionDto) {
    await this.workSessionsRepository.update(id, updateWorkSessionDto);
    return this.workSessionsRepository.findOneBy({ id });
  }

  remove(id: number) {
    return `This action removes a #${id} workSession`;
  }
}
