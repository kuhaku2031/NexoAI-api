import {
  Injectable,
  OnModuleInit,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SaveMessageFirestoreDto } from './dto/save-message-firestore.dto';

export interface FirestoreMessage {
  role: string;
  content: string;
  timestamp?: admin.firestore.Timestamp;
}

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

  // ── Validación de Seguridad ─────────────────────────────────

  async validateConversationOwner(
    companyId: string,
    conversationId: string,
  ): Promise<boolean> {
    try {
      const doc = await this.db
        .collection('companies')
        .doc(companyId)
        .collection('conversations')
        .doc(conversationId)
        .get();

      if (!doc.exists) {
        throw new NotFoundException(
          `Conversación ${conversationId} no encontrada`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error validando conversación: ${error}`);
      throw new ForbiddenException('Error validando acceso a la conversación');
    }
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

  async getMessagesWithLimit(
    companyId: string,
    conversationId: string,
    limit: number = 10,
  ): Promise<FirestoreMessage[]> {
    await this.validateConversationOwner(companyId, conversationId);

    const snapshot = await this.db
      .collection('companies')
      .doc(companyId)
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const messages = snapshot.docs.map((doc) => ({
      role: doc.data().role,
      content: doc.data().content,
      timestamp: doc.data().timestamp,
    }));

    return messages.reverse();
  }

  async getMessagesWithValidation(
    companyId: string,
    conversationId: string,
  ): Promise<FirestoreMessage[]> {
    await this.validateConversationOwner(companyId, conversationId);

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
      timestamp: doc.data().timestamp,
    }));
  }

  async saveMessageWithValidation(saveMessageFirestoreDto: SaveMessageFirestoreDto) {
    await this.validateConversationOwner(
      saveMessageFirestoreDto.companyId,
      saveMessageFirestoreDto.conversationId,
    );

    return this.saveMessage(saveMessageFirestoreDto);
  }

  async closeConversation(companyId: string, conversationId: string) {
    await this.validateConversationOwner(companyId, conversationId);

    await this.db
      .collection('companies')
      .doc(companyId)
      .collection('conversations')
      .doc(conversationId)
      .update({
        status: 'closed',
        closed_at: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { ok: true, conversationId, status: 'closed' };
  }

  async getOldConversations(daysOld: number = 30): Promise<{companyId: string; conversationId: string; createdAt: Date}[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const companiesSnapshot = await this.db.collection('companies').get();
    const oldConversations: {companyId: string; conversationId: string; createdAt: Date}[] = [];

    for (const companyDoc of companiesSnapshot.docs) {
      const companyId = companyDoc.id;

      const conversationsSnapshot = await this.db
        .collection('companies')
        .doc(companyId)
        .collection('conversations')
        .where('status', '==', 'active')
        .where('created_at', '<', cutoffDate)
        .get();

      for (const convDoc of conversationsSnapshot.docs) {
        const data = convDoc.data();
        oldConversations.push({
          companyId,
          conversationId: convDoc.id,
          createdAt: data.created_at?.toDate() || new Date(),
        });
      }
    }

    return oldConversations;
  }

  async getFullConversationContent(
    companyId: string,
    conversationId: string,
  ): Promise<string> {
    await this.validateConversationOwner(companyId, conversationId);

    const snapshot = await this.db
      .collection('companies')
      .doc(companyId)
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get();

    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();
      return `[${data.role}]: ${data.content}`;
    });

    return messages.join('\n\n');
  }
}
