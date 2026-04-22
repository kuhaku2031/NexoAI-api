import { PartialType } from '@nestjs/mapped-types';
import { SendMessageDto } from './create-chat.dto';

export class UpdateChatDto extends PartialType(SendMessageDto) {}
