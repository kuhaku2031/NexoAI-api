import { Injectable, Logger } from '@nestjs/common';
import { FirestoreService } from '../firestore/firestore.service';
import { ConversationRole } from 'src/common/enum/conversation';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly firestoreService: FirestoreService) {}

  async createConversation(companyId: string) {
    const conversationId =
      await this.firestoreService.createConversation(companyId);
    this.logger.log(
      `Conversation created: ${conversationId} for company: ${companyId}`,
    );
    return { conversationId };
  }

  async getConversations(companyId: string) {
    return this.firestoreService.getConversations(companyId);
  }

  async sendMessage(
    companyId: string,
    conversationId: string,
    userMessage: string,
  ) {
    await this.firestoreService.saveMessage({
      companyId,
      conversationId,
      role: ConversationRole.USER,
      content: userMessage,
    });

    return { conversationId, userMessage, saved: true };
  }

  async getMessages(companyId: string, conversationId: string) {
    return this.firestoreService.getMessages(companyId, conversationId);
  }

  // async startChat(companyId: string, content: string) {
  //   const conversationId =
  //     await this.firestoreService.createConversation(companyId);

  //   await this.firestoreService.saveMessage({
  //     companyId,
  //     conversationId,
  //     role: ConversationRole.USER,
  //     content,
  //   });

  //   return { conversationId };
  // }

  async continueChat(
    companyId: string,
    conversationId: string,
    content: string,
  ) {
    await this.firestoreService.saveMessage({
      companyId,
      conversationId,
      role: ConversationRole.USER,
      content: content,
    });

    const messages = await this.firestoreService.getMessages(
      companyId,
      conversationId,
    );

    return { conversationId, messages };
  }

  async closeConversation(companyId: string, conversationId: string) {
    this.logger.log(`Closing conversation: ${conversationId}`);
    return { conversationId, status: 'closed' };
  }
}
