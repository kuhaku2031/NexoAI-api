import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../src/app.module';
import { FirestoreService } from '../src/ai/firestore/firestore.service';

describe('Chat (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let firestoreService: FirestoreService;

  const mockFirestoreService = {
    createConversation: jest.fn().mockResolvedValue('conv_test123'),
    getConversations: jest.fn().mockResolvedValue([]),
    saveMessage: jest.fn().mockResolvedValue(undefined),
    getMessages: jest.fn().mockResolvedValue([]),
  };

  const testUser = {
    company_id: 'comp_test123',
    email: 'test@example.com',
    role: 'OWNER',
  };

  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirestoreService)
      .useValue(mockFirestoreService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    accessToken = await jwtService.signAsync(testUser);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/chat (Auth)', () => {
    it('should reject unauthenticated requests', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat/start')
        .send({ content: 'Hello' })
        .expect(401);
    });

    it('should create a conversation with valid auth', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat/conversations')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('conversationId');
        });
    });

    it('should get conversations list', () => {
      return request(app.getHttpServer())
        .get('/api/v1/chat/conversations')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should send a message', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat/conversations/conv_123/messages')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Hello AI' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('saved', true);
        });
    });

    it('should get messages for a conversation', () => {
      return request(app.getHttpServer())
        .get('/api/v1/chat/conversations/conv_123/messages')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should start a new chat', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat/start')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Hello AI assistant' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('conversationId');
        });
    });

    it('should reject invalid content (empty body)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat/start')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);
    });

    it('should continue a chat', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat/continue/conv_123')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'Follow up question' })
        .expect(201);
    });

    it('should close a conversation', () => {
      return request(app.getHttpServer())
        .post('/api/v1/chat/close/conv_123')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'closed');
        });
    });
  });
});