import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import * as fs from 'fs/promises';
import * as mime from 'mime-types';
import { GenerateUtility } from '../utilities/generate.utility';
import { ConvertDateUtility } from '../utilities/convert-date.utility';

@Injectable()
export class MulterConfig implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  // 콘텐츠 디렉토리명 매칭
  private getContentDirectoryName(apiUrl: string) {
    let contentDirectory = '';
    switch (apiUrl) {
      case '/users/profile-image/upload':
        contentDirectory = 'users';
        break;
      default:
        contentDirectory = 'etc';
        break;
    }
    return contentDirectory;
  }

  // 이미지 저장 주소 생성
  private buildFileStoragePath(req: any) {
    const fileRootDirectory = this.configService.get<string>('FILE_STORAGE_PATH');
    const contentDirectory = this.getContentDirectoryName(req.url);
    const userId = req.user.sub;

    const fileStoragePath = `${fileRootDirectory}/${contentDirectory}/${userId}`;
    return fileStoragePath;
  }

  // 디렉토리 생성
  public async createDirectory(path: string) {
    try {
      await fs.mkdir(path, { recursive: true });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 이미지 파일명 생성
  private generateFileName(file: Express.Multer.File) {
    const randomString = GenerateUtility.generateRandomString('img-', 10);
    const datetime = ConvertDateUtility.convertDatetimeLocalString(new Date(), { numberOnly: true });

    return `${randomString}_${datetime}.${mime.extension(file.mimetype)}`;
  }
  createMulterOptions(): MulterModuleOptions {
    const storageOptions = {
      destination: async (req, file, callback) => {
        const fileStoragePath = this.buildFileStoragePath(req);
        await this.createDirectory(fileStoragePath);
        callback(null, fileStoragePath);
      },
      filename: (req, file, callback) => {
        const fileName = this.generateFileName(file);
        callback(null, fileName);
      },
    };

    return {
      storage: diskStorage(storageOptions),
      limits: {
        fileSize: 1024 * 1024, // 1MB
      },
    };
  }
}
