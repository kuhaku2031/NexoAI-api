import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbeddingsService } from './embeddings.service';
import { ConversationEmbedding } from './entities/conversation-embedding.entity';
import { FirestoreModule } from '../firestore/firestore.module';
import { ArchiveConversationsJob } from './jobs/archive-conversations.job';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEmbedding]),
    FirestoreModule,
  ],
  providers: [EmbeddingsService, ArchiveConversationsJob],
  exports: [EmbeddingsService],
})
export class EmbeddingsModule {}