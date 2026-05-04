import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmbeddingsService } from '../embeddings.service';

@Injectable()
export class ArchiveConversationsJob {
  private readonly logger = new Logger(ArchiveConversationsJob.name);

  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleArchiveJob() {
    this.logger.log('Iniciando job de archivado de conversaciones...');
    
    try {
      const archived = await this.embeddingsService.archiveOldConversations(30);
      this.logger.log(`Job completado. Se archivaron ${archived} conversaciones.`);
    } catch (error) {
      this.logger.error(`Error en job de archivado: ${error}`);
    }
  }
}