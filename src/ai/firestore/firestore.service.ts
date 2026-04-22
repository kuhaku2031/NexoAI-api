import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirestoreService implements OnModuleInit {
  private db: admin.firestore.Firestore;
  private readonly logger = new Logger(FirestoreService.name);

  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    this.db = admin.firestore();
    this.logger.log('Firestore conectado');
  }

  // ── Conversaciones ──────────────────────────────────────────

  async createConversation(companyId: string): Promise<string> {
    const ref = await this.db
      .collection('companies')
      .doc(companyId)
      .collection('conversations')
      .add({
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        status: 'active',
      });
    return ref.id;
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
