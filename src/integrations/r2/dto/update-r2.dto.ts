import { PartialType } from '@nestjs/mapped-types';
import { CreateR2Dto } from './create-r2.dto';

export class UpdateR2Dto extends PartialType(CreateR2Dto) {}
