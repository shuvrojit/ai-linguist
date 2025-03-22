// controllers/fileController.ts
import { Request, Response } from 'express';
import { FileDatabase } from '../services/fileDatabase';
import { StorageFactory } from '../services/storageFactory';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class FileController {
  private fileDb: FileDatabase;
  private fileStorage: ReturnType<typeof StorageFactory.createStorage>;

  constructor() {
    this.fileDb = new FileDatabase();
    this.fileStorage = StorageFactory.createStorage();
  }

  uploadFile = async (req: Request, res: Response): Promise<void> => {
    console.log('req.file', req.file);
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const { originalname, mimetype, size, buffer } = req.file;
      const userId = req.body.userId || 'anonymous'; // In a real app, get from auth

      // Generate a unique filename
      const fileExt = path.extname(originalname);
      const uniqueFilename = `${userId}/${uuidv4()}${fileExt}`;

      console.log(
        'Uploading file:',
        originalname,
        mimetype,
        size,
        uniqueFilename
      );
      // Save file to storage
      const storedPath = await this.fileStorage.saveFile(
        uniqueFilename,
        buffer,
        mimetype
      );

      console.log('File saved to:', storedPath);

      // Save metadata to MongoDB
      const fileData = await this.fileDb.saveFileMetadata({
        filename: uniqueFilename,
        originalname,
        path: storedPath,
        mimetype,
        size,
        userId,
      });

      console.log('File metadata saved:', fileData);

      // Return response
      res.status(201).json({
        message: 'File uploaded successfully',
        fileId: fileData._id,
        filename: fileData.originalname,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  };

  getFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const fileId = req.params.id;
      const fileData = await this.fileDb.getFileById(fileId);

      if (!fileData) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      // Check if user has permission (in a real app)
      // if (fileData.userId !== req.user.id) {
      //   res.status(403).json({ error: 'Unauthorized' });
      //   return;
      // }

      // Different handling based on storage type
      if (
        'getSignedUrl' in this.fileStorage &&
        typeof this.fileStorage.getSignedUrl === 'function'
      ) {
        // S3 or similar - redirect to signed URL
        const signedUrl = await this.fileStorage.getSignedUrl(
          fileData.filename,
          3600
        );
        res.json({ signedUrl });
      } else {
        // Local storage - stream the file
        const fileBuffer = await this.fileStorage.getFile(fileData.filename);
        res.setHeader('Content-Type', fileData.mimetype);
        res.setHeader(
          'Content-Disposition',
          `inline; filename="${fileData.originalname}"`
        );
        res.send(fileBuffer);
      }
    } catch (error) {
      console.error('Error retrieving file:', error);
      res.status(500).json({ error: 'Failed to retrieve file' });
    }
  };

  deleteFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const fileId = req.params.id;
      const fileData = await this.fileDb.getFileById(fileId);

      if (!fileData) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      // Check if user has permission (in a real app)
      // if (fileData.userId !== req.user.id) {
      //   res.status(403).json({ error: 'Unauthorized' });
      //   return;
      // }

      // Delete from storage
      await this.fileStorage.deleteFile(fileData.filename);

      // Delete from database
      await this.fileDb.deleteFile(fileId);

      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  };

  getUserFiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;

      // Check if user has permission (in a real app)
      // if (userId !== req.user.id) {
      //   res.status(403).json({ error: 'Unauthorized' });
      //   return;
      // }

      const files = await this.fileDb.getFilesByUserId(userId);

      res.json({
        files: files.map((file) => ({
          id: file._id,
          filename: file.originalname,
          uploadDate: file.uploadDate,
          size: file.size,
          mimetype: file.mimetype,
          parsed: file.parsed,
        })),
      });
    } catch (error) {
      console.error('Error retrieving user files:', error);
      res.status(500).json({ error: 'Failed to retrieve files' });
    }
  };
}
