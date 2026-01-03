import { IsNotEmpty, IsString, Min } from 'class-validator';
export class UpdateAuthDto{
    @IsNotEmpty()
    @IsString()
    @Min(2)
    refresh_tocken: string
}
