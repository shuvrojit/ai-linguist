// services/storageFactory.ts
import { LocalFileStorage } from './localFileStorage';
// import { S3FileStorage } from './s3FileStorage';

export interface FileStorage {
  saveFile(
    filename: string,
    buffer: Buffer,
    contentType?: string
  ): Promise<string>;
  getFile(filename: string): Promise<Buffer>;
  deleteFile(filename: string): Promise<void>;
  getFilePath?(filename: string): string;
  getSignedUrl?(filename: string, expiresIn?: number): Promise<string>;
}

export class StorageFactory {
  static createStorage(): FileStorage {
    // const env = process.env.NODE_ENV || 'development';

    // if (env === 'production') {
    //   const bucketName = process.env.S3_BUCKET_NAME;
    //   const region = process.env.AWS_REGION || 'us-east-1';

    //   if (!bucketName) {
    //     throw new Error('S3_BUCKET_NAME environment variable is required in production mode');
    //   }

    // return new S3StorageAdapter(bucketName, region);
    // } else {
    return new LocalStorageAdapter();
    // }
  }
}

// Adapter classes to ensure consistent interface
class LocalStorageAdapter implements FileStorage {
  private storage: LocalFileStorage;

  constructor() {
    this.storage = new LocalFileStorage();
  }

  async saveFile(filename: string, buffer: Buffer): Promise<string> {
    return this.storage.saveFile(filename, buffer);
  }

  async getFile(filename: string): Promise<Buffer> {
    return this.storage.getFile(filename);
  }

  async deleteFile(filename: string): Promise<void> {
    return this.storage.deleteFile(filename);
  }

  getFilePath(filename: string): string {
    return this.storage.getFilePath(filename);
  }
}

// class S3StorageAdapter implements FileStorage {
//   private storage: S3FileStorage;

//   constructor(bucketName: string, region: string) {
//     this.storage = new S3FileStorage(bucketName, region);
//   }

//   async saveFile(filename: string, buffer: Buffer, contentType: string = 'application/octet-stream'): Promise<string> {
//     return this.storage.uploadFile(filename, buffer, contentType);
//   }

//   async getFile(filename: string): Promise<Buffer> {
//     return this.storage.getFileBuffer(filename);
//   }

//   async deleteFile(filename: string): Promise<void> {
//     return this.storage.deleteFile(filename);
//   }

//   async getSignedUrl(filename: string, expiresIn: number = 3600): Promise<string> {
//     return this.storage.getSignedUrl(filename, expiresIn);
//   }
// }

// Example usage
// const fileStorage = StorageFactory.createStorage();
// const filePath = await fileStorage.saveFile('resume.pdf', pdfBuffer, 'application/pdf');
