import { Module } from '@nestjs/common';
import { WorkSessionsService } from './work-sessions.service';
import { WorkSessionsController } from './work-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkSession } from './entities/work-session.entity';
import { Users } from 'src/core/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkSession, Users])],
  controllers: [WorkSessionsController],
  providers: [WorkSessionsService],
})
export class WorkSessionsModule {}
