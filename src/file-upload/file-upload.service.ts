import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlinkSync } from 'fs';

@Injectable()
export class FileUploadService {
  static getStorageOptions() {
    return {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    };
  }

  handleUploadedFiles(files: Express.Multer.File[]) {
    if (!files) {
      throw new Error('No files uploaded');
    }
    return files.map((file) => ({
      url: `http://localhost:3000/uploads/${file.filename}`,
      mimetype: file.mimetype,
    }));
  }

  deleteFiles(strings: string[]) {
    strings.forEach((file) => {
      try {
        console.log(`Deleting file: ${file}`);
        unlinkSync(`./uploads/${getFileNameInUrl(file)}`);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

function getFileNameInUrl(fileName: string) {
  const arr = fileName.split('/');
  return arr[arr.length - 1];
}
