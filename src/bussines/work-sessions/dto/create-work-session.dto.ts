import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  total_time: number;
}
