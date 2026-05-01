import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FirestoreService } from './firestore.service';

@Controller('firestore-test')
export class FirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Post('conversation')
  async createConversation(@Body() body: { companyId: string }) {
    const conversationId = await this.firestoreService.createConversation(
      body.companyId,
    );
    return {
      ok: true,
      conversationId,
      message: `Conversación creada en companies/${body.companyId}/conversations/${conversationId}`,
    };
  }

  @Post('message')
  async saveMessage(
    @Body()
    body: {
      companyId: string;
      conversationId: string;
      role: 'user' | 'assistant';
      content: string;
    },
  ) {
    await this.firestoreService.saveMessage(
      body.companyId,
      body.conversationId,
      { role: body.role, content: body.content },
    );
    return {
      ok: true,
      message: `Mensaje [${body.role}] guardado en conversación ${body.conversationId}`,
      data: { role: body.role, content: body.content },
    };
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