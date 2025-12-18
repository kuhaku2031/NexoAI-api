import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SearchProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  searchTerm: string;
}
