import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SaveMessageFirestoreDto } from './dto/save-message-firestore.dto';

@Injectable()
export class FirestoreService implements OnModuleInit {
  private db: admin.firestore.Firestore;
  private readonly logger = new Logger(FirestoreService.name);

  onModuleInit() {
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const dbName = process.env.FIRESTORE_DB_NAME;

      const config: Record<string, unknown> = {
        credential: admin.credential.cert({
          projectId,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      };

      if (dbName && dbName !== '(default)') {
        config.databaseURL = `https://${projectId}-${dbName}.firebasedatabase.app`;
      }

      admin.initializeApp(config as admin.AppOptions);
      this.logger.log(
        `Firebase Admin inicializado con projectId: ${projectId}, db: ${dbName || '(default)'}`,
      );
    }

    this.db = admin.firestore();
    this.logger.log('Firestore instance creada');
  }

  // ── Conversaciones ──────────────────────────────────────────

  async createConversation(companyId: string) {
    try {
      const ref = await this.db
        .collection('companies')
        .doc(companyId)
        .collection('conversations')
        .add({
          created_at: admin.firestore.FieldValue.serverTimestamp(),
          status: 'active',
        });

      const message = {
        ok: true,
        conversationId: ref.id,
        message: `Conversación creada en companies/${companyId}/conversations/${ref.id}`,
      };
      return message;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getConversations(companyId: string) {
    const snapshot = await this.db
      .collection('companies')
      .doc(companyId)
      .collection('conversations')
      .orderBy('created_at', 'desc')
      .limit(10)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // ── Mensajes ────────────────────────────────────────────────

  async saveMessage(saveMessageFirestoreDto: SaveMessageFirestoreDto) {
    try {
      await this.db
        .collection('companies')
        .doc(saveMessageFirestoreDto.companyId)
        .collection('conversations')
        .doc(saveMessageFirestoreDto.conversationId)
        .collection('messages')
        .add({
          ...saveMessageFirestoreDto,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

      const message = {
        ok: true,
        message: `Mensaje [${saveMessageFirestoreDto.role}] guardado en conversación ${saveMessageFirestoreDto.conversationId}`,
        data: {
          role: saveMessageFirestoreDto.role,
          content: saveMessageFirestoreDto.content,
        },
      };

      return message;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getMessages(
    companyId: string,
    conversationId: string,
  ): Promise<{ role: string; content: string }[]> {
    const snapshot = await this.db
      .collection('companies')
      .doc(companyId)
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .limit(20)
      .get();

    return snapshot.docs.map((doc) => ({
      role: doc.data().role,
      content: doc.data().content,
    }));
  }
}
