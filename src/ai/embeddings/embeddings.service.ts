import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEmbedding } from './entities/conversation-embedding.entity';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);

  private readonly OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
  private readonly OLLAMA_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';

  constructor(
    @InjectRepository(ConversationEmbedding)
    private readonly embeddingRepository: Repository<ConversationEmbedding>,
    private readonly firestoreService: FirestoreService,
  ) {}

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.OLLAMA_URL}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.OLLAMA_MODEL,
          prompt: text,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error(`Ollama embedding error: ${response.status} - ${error}`);
        throw new Error(`Failed to generate embedding: ${response.status}`);
      }

      const data = await response.json();
      return data.embedding;
    } catch (error) {
      this.logger.error(`Error generating embedding: ${error}`);
      throw error;
    }
  }

  async storeEmbedding(data: {
    companyId: string;
    conversationId: string;
    content: string;
    userId?: string;
    summary?: string;
  }): Promise<ConversationEmbedding> {
    try {
      const embedding = await this.generateEmbedding(data.content);

      const entity = this.embeddingRepository.create({
        company_id: data.companyId,
        conversation_id: data.conversationId,
        content: data.content,
        embedding,
        user_id: data.userId,
        summary: data.summary,
      });

      return this.embeddingRepository.save(entity);
    } catch (error) {
      this.logger.error(`Error storing embedding: ${error}`);
      throw error;
    }
  }

  async semanticSearch(
    companyId: string,
    query: string,
    limit: number = 5,
  ): Promise<ConversationEmbedding[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(query);

      const results = await this.embeddingRepository
        .createQueryBuilder('e')
        .where('e.company_id = :companyId', { companyId })
        .orderBy(
          `(e.embedding <-> :embedding::vector)`,
          'ASC',
        )
        .setParameter('embedding', JSON.stringify(queryEmbedding))
        .limit(limit)
        .getMany();

      return results;
    } catch (error) {
      this.logger.error(`Error in semantic search: ${error}`);
      return [];
    }
  }

  async archiveOldConversations(daysOld: number = 30): Promise<number> {
    try {
      const oldConversations = await this.firestoreService.getOldConversations(daysOld);
      this.logger.log(`Found ${oldConversations.length} conversations to archive`);

      let archived = 0;

      for (const conv of oldConversations) {
        try {
          const content = await this.firestoreService.getFullConversationContent(
            conv.companyId,
            conv.conversationId,
          );

          if (content.trim()) {
            const summary = content.substring(0, 200);

            await this.storeEmbedding({
              companyId: conv.companyId,
              conversationId: conv.conversationId,
              content,
              summary,
            });

            await this.firestoreService.closeConversation(conv.companyId, conv.conversationId);
            archived++;
          }
        } catch (err) {
          this.logger.error(`Error archiving conversation ${conv.conversationId}: ${err}`);
        }
      }

      this.logger.log(`Archived ${archived} conversations`);
      return archived;
    } catch (error) {
      this.logger.error(`Error in archive job: ${error}`);
      return 0;
    }
  }

  async getEmbeddingsByConversation(
    companyId: string,
    conversationId: string,
  ): Promise<ConversationEmbedding[]> {
    return this.embeddingRepository.find({
      where: {
        company_id: companyId,
        conversation_id: conversationId,
      },
      order: { created_at: 'DESC' },
    });
  }

  async deleteEmbedding(id: string): Promise<void> {
    await this.embeddingRepository.delete(id);
  }
}