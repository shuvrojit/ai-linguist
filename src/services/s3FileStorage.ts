// // services/s3FileStorage.ts
// import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { Readable } from 'stream';

// export class S3FileStorage {
//   private s3Client: S3Client;
//   private bucketName: string;
//   private region: string;

//   constructor(bucketName: string, region: string = 'us-east-1') {
//     this.bucketName = bucketName;
//     this.region = region;

//     this.s3Client = new S3Client({
//       region: this.region,
//       // Credentials will be loaded from environment variables or IAM role
//     });
//   }

//   async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<string> {
//     const command = new PutObjectCommand({
//       Bucket: this.bucketName,
//       Key: key,
//       Body: buffer,
//       ContentType: contentType
//     });

//     await this.s3Client.send(command);
//     return key;
//   }

//   async getFileBuffer(key: string): Promise<Buffer> {
//     const command = new GetObjectCommand({
//       Bucket: this.bucketName,
//       Key: key
//     });

//     const response = await this.s3Client.send(command);
//     return await this.streamToBuffer(response.Body as Readable);
//   }

//   async deleteFile(key: string): Promise<void> {
//     const command = new DeleteObjectCommand({
//       Bucket: this.bucketName,
//       Key: key
//     });

//     await this.s3Client.send(command);
//   }

//   async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
//     const command = new GetObjectCommand({
//       Bucket: this.bucketName,
//       Key: key
//     });

//     return await getSignedUrl(this.s3Client, command, { expiresIn });
//   }

//   private async streamToBuffer(stream: Readable): Promise<Buffer> {
//     return new Promise<Buffer>((resolve, reject) => {
//       const chunks: Buffer[] = [];
//       stream.on('data', (chunk) => chunks.push(chunk));
//       stream.on('error', reject);
//       stream.on('end', () => resolve(Buffer.concat(chunks)));
//     });
//   }
// }

// Example usage
// const s3Storage = new S3FileStorage('my-cv-writer-bucket');
// await s3Storage.uploadFile('user123/resume.pdf', pdfBuffer, 'application/pdf');
// const signedUrl = await s3Storage.getSignedUrl('user123/resume.pdf', 3600);
