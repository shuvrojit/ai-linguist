// services/localFileStorage.ts
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

export class LocalFileStorage {
  private basePath: string;

  constructor(basePath: string = path.join(process.cwd(), 'uploads')) {
    this.basePath = basePath;
    this.ensureDirectory();
  }

  private async ensureDirectory(): Promise<void> {
    try {
      await mkdir(this.basePath, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  }

  async saveFile(filename: string, buffer: Buffer): Promise<string> {
    console.log('Saving file:', filename);
    const filePath = path.join(this.basePath, filename);
    console.log('File path:', filePath);

    // Ensure the directory structure exists
    const dirPath = path.dirname(filePath);
    try {
      await mkdir(dirPath, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
    }

    await writeFile(filePath, buffer);
    console.log('File saved');
    return filePath;
  }

  async getFile(filename: string): Promise<Buffer> {
    const filePath = path.join(this.basePath, filename);
    return await readFile(filePath);
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.basePath, filename);
    await unlink(filePath);
  }

  getFilePath(filename: string): string {
    return path.join(this.basePath, filename);
  }
}

// Example usage
// const storage = new LocalFileStorage();
// await storage.saveFile('example.pdf', pdfBuffer);
// const retrievedFile = await storage.getFile('example.pdf');
