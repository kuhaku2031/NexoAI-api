import { Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { FirestoreController } from './firestore.controller';

@Module({
  controllers: [FirestoreController],
  providers: [FirestoreService],
  exports: [FirestoreService],
})
export class FirestoreModule {}
