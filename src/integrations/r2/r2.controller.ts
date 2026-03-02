import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { R2Service } from './r2.service';

@Controller('files')
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @Get('test')
  async testConnection() {
    const isConnected = await this.r2Service.testConnection();
    return {
      connected: isConnected,
      message: isConnected
        ? 'Conexión a R2 exitosa'
        : 'Error al conectar con R2',
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const imageUrl = await this.r2Service.uploadFile(file, 'images');
    return { url: imageUrl };
  }

  @Delete('delete')
  async deleteFile(@Body() body: { key: string }) {
    await this.r2Service.deleteFile(body.key);
    return { message: 'File deleted successfully' };
  }

  @Get('metadata/:key')
  async getFileMetadata(@Param('key') key: string) {
    const metadata = await this.r2Service.getFileMetadata(key);
    return metadata;
  }

  @Get('download/:key')
  async downloadFile(@Param('key') key: string, @Res() res: Response) {
    const buffer = await this.r2Service.getFileBuffer(key);
    const metadata = await this.r2Service.getFileMetadata(key);

    res.set({
      'Content-Type': metadata.contentType,
      'Content-Length': metadata.contentLength,
      'Content-Disposition': `attachment; filename="${key}"`,
    });

    res.end(buffer);
  }

  @Get('view/:key')
  async viewFile(@Param('key') key: string, @Res() res: Response) {
    const buffer = await this.r2Service.getFileBuffer(key);
    const metadata = await this.r2Service.getFileMetadata(key);

    res.set({
      'Content-Type': metadata.contentType,
      'Content-Length': metadata.contentLength,
    });

    res.end(buffer);
  }
}
