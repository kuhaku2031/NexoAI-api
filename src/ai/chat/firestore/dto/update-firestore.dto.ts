import { PartialType } from '@nestjs/mapped-types';
import { CreateFirestoreDto } from './create-firestore.dto';

export class UpdateFirestoreDto extends PartialType(CreateFirestoreDto) {}
