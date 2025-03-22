// services/fileDatabase.ts
import { fileModel, IFile } from '../models/file.model';

export class FileDatabase {
  async saveFileMetadata(fileData: Partial<IFile>): Promise<IFile> {
    console.log('fileData', fileData);
    const newFile = new fileModel(fileData);
    console.log('newFile', newFile);
    return await newFile.save();
  }

  async getFileById(id: string): Promise<IFile | null> {
    return await fileModel.findById(id);
  }

  async getFilesByUserId(userId: string): Promise<IFile[]> {
    return await fileModel.find({ userId }).sort({ uploadDate: -1 });
  }

  async updateFileMetadata(
    id: string,
    updateData: Partial<IFile>
  ): Promise<IFile | null> {
    return await fileModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteFile(id: string): Promise<boolean> {
    const result = await fileModel.findByIdAndDelete(id);
    return result !== null;
  }

  async markFileAsParsed(
    id: string,
    parsedContent: any
  ): Promise<IFile | null> {
    return await fileModel.findByIdAndUpdate(
      id,
      {
        parsed: true,
        parsedContent,
      },
      { new: true }
    );
  }
}

// Example usage
// const fileDb = new FileDatabase();
// const savedFile = await fileDb.saveFileMetadata({
//   filename: 'resume.pdf',
//   path: 's3://my-bucket/user123/resume.pdf',
//   mimetype: 'application/pdf',
//   size: 1024567,
//   userId: 'user123'
// });
