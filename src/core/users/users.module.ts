import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { jwtConstants } from 'src/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: jwtConstants.accessToken.secret,
      signOptions: { expiresIn: jwtConstants.accessToken.signOptions },
    }),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard],
})
export class UsersModule {}
