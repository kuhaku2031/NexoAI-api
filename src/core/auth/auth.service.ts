import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { IdGenerator } from 'src/common/utils/id-generator.util';
import { Formatdate } from 'src/common/utils/date.util';
import { HashUtil } from 'src/common/utils/hash.util';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/common/enum/role.enum';
import { jwtConstants } from 'src/config/jwt.config';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
    private readonly JwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    try {
      // Create company
      // Check if email is already in use
      const existingCompany = await this.companiesService.findByEmail(
        createAuthDto.email,
      );

      if (existingCompany) {
        throw new BadRequestException('Company already exists with this email');
      }

      // Create a unique company ID
      const company_id = IdGenerator.generateCompanyId();

      //Create the company
      this.companiesService.create(createAuthDto, company_id);

      // Create user
      const hasedPassword = await new HashUtil().hashing(
        createAuthDto.password,
      );

      const ownerUser = this.usersService.create({
        user_id: IdGenerator.generateUserId(createAuthDto.owner_name),
        company_id: company_id,
        email: createAuthDto.email,
        password: hasedPassword,
        first_name: createAuthDto.owner_name,
        last_name: createAuthDto.owner_lastname,
        phone_number: createAuthDto.phone_number,
        role: UserRole.OWNER,
        is_active: true,
        created_at: Formatdate(),
        updated_at: Formatdate(),
      });

      return ownerUser;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async login(LoginAuthDto: LoginAuthDto) {
    try {
      // Find user by email
      const user = await this.usersService.findOneByEmail(LoginAuthDto.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Compare password
      const isPasswordValid = await new HashUtil().compare(
        LoginAuthDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate payload
      const payload = {
        company_id: user.company_id,
        email: user.email,
        role: user.role,
      };
      
      // Generate Refresh Token
      const refreshToken = await this.JwtService.signAsync(payload, {
        secret: jwtConstants.refreshToken.secret,
        expiresIn: jwtConstants.refreshToken.signOptions,
      });
      
      // Generate Access Token
      const accessToken = await this.JwtService.signAsync(payload, {
        secret: jwtConstants.accessToken.secret,
        expiresIn: jwtConstants.accessToken.signOptions,
      });


      const hasedRefreshToken = await new HashUtil().hashing(refreshToken);

      const refreshExpires = new Date();
      refreshExpires.setHours(refreshExpires.getHours() + 1);

      const refreshExpiresFormatted = Formatdate(refreshExpires);

      await this.usersService.updateRefreshToken(
        user.email,
        refreshToken,
        refreshExpiresFormatted,
      );

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          email: user.email,
          role: user.role,
          company_id: user.company_id,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error.message);
    }
  }

  async refreshToken(UpdateAuthDto: UpdateAuthDto) {
    try {
      const payload = await this.JwtService.verifyAsync(UpdateAuthDto.refresh_tocken, {
        secret: jwtConstants.refreshToken.secret,
      });

      const user = await this.usersService.findOneByEmail(payload.email);

      if (!user || !user.refresh_token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await new HashUtil().compare(
        UpdateAuthDto.refresh_tocken,
        user.refresh_token,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.JwtService.signAsync(
        {
          company_id: user.company_id,
          email: user.email,
          role: user.role,
        },
        {
          secret: jwtConstants.accessToken.secret,
          expiresIn: jwtConstants.accessToken.signOptions,
        },
      );

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
