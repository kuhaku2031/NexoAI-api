import { IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { ConversationRole } from 'src/common/enum/conversation';

export class SaveMessageFirestoreDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  companyId: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsEnum(ConversationRole)
  role: ConversationRole;

  @IsNotEmpty()
  content: string;

  @IsString()
  content_rep: string;
}
