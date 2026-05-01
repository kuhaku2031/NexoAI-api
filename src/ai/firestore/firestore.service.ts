import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

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
      this.logger.log(`Firebase Admin inicializado con projectId: ${projectId}, db: ${dbName || '(default)'}`);
    }

    this.db = admin.firestore();
    this.logger.log('Firestore instance creada');
  }

  // ── Conversaciones ──────────────────────────────────────────

  async createConversation(companyId: string): Promise<string> {
    try {
      const ref = await this.db
        .collection('companies')
        .doc(companyId)
        .collection('conversations')
        .add({
          created_at: admin.firestore.FieldValue.serverTimestamp(),
          status: 'active',
        });
      return ref.id;
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

  async saveMessage(
    companyId: string,
    conversationId: string,
    message: { role: 'user' | 'assistant'; content: string },
  ): Promise<void> {
    await this.db
      .collection('companies')
      .doc(companyId)
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .add({
        ...message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
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
