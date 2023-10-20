import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  constructor(config: ConfigService) {
    v2.config({
      cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      return new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          {
            folder: `ISAGE-KB/${folder}`,
          },
          (err, res) => {
            if (err) return reject(err);
            resolve(res);
          },
        );
        toStream(file.buffer).pipe(upload);
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async uploadFiles(files: Array<Express.Multer.File>, folder: string) {
    try {
      const urls = await Promise.all(
        files.map(async (file): Promise<string> => {
          const { secure_url } = await this.upload(file, folder);
          return secure_url;
        }),
      );
      return urls;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async delete(publicId: string): Promise<any> {
    try {
      return await new Promise((resolve, reject) => {
        v2.uploader.destroy(publicId, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }
}
