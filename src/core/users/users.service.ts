import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      console.log(user);
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async findAllByCompany(company_id: string) {
    return await this.userRepository.find({
      where: { company_id: company_id },
    });
  }

  async updateRefreshToken(
    email: string,
    refreshToken: string,
    expiresAt: Date,
  ) {
    await this.userRepository.update(
      { email: email },
      { refresh_token: refreshToken, refresh_token_expires: expiresAt },
    );
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
