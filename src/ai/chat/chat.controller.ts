import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { AiService } from './ai.service';
import { FirestoreService } from '../firestore/firestore.service';
import { CreateChatDto, SendMessageDto, AiStreamDto } from './dto/create-chat.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/role.enum';

interface AuthenticatedRequest extends Request {
  user: {
    company_id: string;
    email: string;
    role: string;
  };
}

@Controller('chat')
@UseGuards(AuthGuard, RolesGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly aiService: AiService,
    private readonly firestoreService: FirestoreService,
  ) {}

  @Post('conversations')
  async createConversation(@Req() req: AuthenticatedRequest) {
    const { company_id } = req.user;
    return this.chatService.createConversation(company_id);
  }

  @Get('conversations')
  async getConversations(@Req() req: AuthenticatedRequest) {
    const { company_id } = req.user;
    return this.chatService.getConversations(company_id);
  }

  @Post('conversations/:conversationId/messages')
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Body() sendMessageDto: SendMessageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { company_id } = req.user;
    return this.chatService.sendMessage(
      company_id,
      conversationId,
      sendMessageDto.content,
    );
  }

  @Get('conversations/:conversationId/messages')
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const { company_id } = req.user;
    return this.chatService.getMessages(company_id, conversationId);
  }

  @Post('start')
  async startChat(@Body() createChatDto: CreateChatDto, @Req() req: AuthenticatedRequest) {
    const { company_id } = req.user;
    return this.chatService.startChat(company_id, createChatDto.content);
  }

  @Post('continue/:conversationId')
  async continueChat(
    @Param('conversationId') conversationId: string,
    @Body() createChatDto: CreateChatDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { company_id } = req.user;
    return this.chatService.continueChat(
      company_id,
      conversationId,
      createChatDto.content,
    );
  }

  @Post('close/:conversationId')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  async closeConversation(
    @Param('conversationId') conversationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const { company_id } = req.user;
    return this.chatService.closeConversation(company_id, conversationId);
  }

  // ── AI Endpoints ──────────────────────────────────────────────

  @Post('service-account')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  async generateServiceAccount(@Req() req: AuthenticatedRequest) {
    const { company_id } = req.user;
    const token = await this.aiService.generateServiceAccountToken(company_id);
    return { service_account_token: token, type: 'ai_assistant' };
  }

  @Post('stream/:conversationId')
  @HttpCode(HttpStatus.OK)
  async streamChat(
    @Param('conversationId') conversationId: string,
    @Body() streamDto: AiStreamDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const { company_id } = req.user;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Acces--Control-Allow-Origin', '*');

    const messages = await this.firestoreService.getMessages(
      company_id,
      conversationId,
    );

    const fullResponse = await this.aiService.generateStreamingResponse(
      messages as { role: string; content: string }[],
      (chunk: string) => {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      },
    );

    res.write(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`);
    res.end();
  }
}
