import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Status } from 'src/common/enum/status.enum';

export class CreateWorkSessionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @IsNotEmpty()
  company_id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @IsNotEmpty()
  check_in: string;

  @IsString()
  @MinLength(3)
  @MaxLength(150)
  check_out: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsNumber()
  @IsNotEmpty()
  total_time: number;
}
