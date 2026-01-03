import { IsNotEmpty, IsString} from 'class-validator';
export class UpdateAuthDto{
    @IsNotEmpty()
    @IsString()
    refresh_tocken: string
}
