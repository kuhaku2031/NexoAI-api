import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { AiService } from './ai.service';
import { ChatController } from './chat.controller';
import { FirestoreModule } from '../firestore/firestore.module';
import { jwtConstants } from 'src/config/jwt.config';
import { FirestoreService } from '../firestore/firestore.service';

@Module({
  imports: [
    FirestoreModule,
    JwtModule.register({
      secret: jwtConstants.accessToken.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, AiService, FirestoreService],
})
export class ChatModule {}
