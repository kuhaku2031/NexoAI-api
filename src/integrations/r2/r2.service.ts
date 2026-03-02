import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
} from '@aws-sdk/client-s3';
import { r2Client } from 'src/config/r2.config';

export interface R2File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class R2Service {
  private bucketName = process.env.R2_BUCKET_NAME;
  private publicUrl = process.env.R2_PUBLIC_URL;

  async testConnection(): Promise<boolean> {
    try {
      await r2Client.send(new ListBucketsCommand({}));
      return true;
    } catch (error) {
      console.error('R2 Connection Error:', error);
      return false;
    }
  }

  async uploadFile(file: R2File, folder: string = 'uploads'): Promise<string> {
    const key = `${folder}/${Date.now()}-${file.originalname}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `${this.publicUrl}/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }

  async getFileBuffer(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await r2Client.send(command);

    if (!response.Body) {
      throw new Error('File not found');
    }

    const bytes = await response.Body.transformToByteArray();
    return Buffer.from(bytes);
  }

  async getFileMetadata(key: string): Promise<{
    contentType: string;
    contentLength: number;
  }> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await r2Client.send(command);

    return {
      contentType: response.ContentType || 'application/octet-stream',
      contentLength: Number(response.ContentLength) || 0,
    };
  }
}
