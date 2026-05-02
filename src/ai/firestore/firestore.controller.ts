import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { SaveMessageFirestoreDto } from './dto/save-message-firestore.dto';

@Controller('firestore-test')
export class FirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Post('conversation')
  createConversation(@Body() body: { companyId: string }) {
    return this.firestoreService.createConversation(body.companyId);
  }

  @Post('message')
  saveMessage(@Body() saveMessageFirestoreDto: SaveMessageFirestoreDto) {
    return this.firestoreService.saveMessage(saveMessageFirestoreDto);
  }

  @Get(':companyId/:conversationId/messages')
  async getMessages(
    @Param('companyId') companyId: string,
    @Param('conversationId') conversationId: string,
  ) {
    const messages = await this.firestoreService.getMessages(
      companyId,
      conversationId,
    );
    return {
      ok: true,
      total: messages.length,
      messages,
    };
  }
}
