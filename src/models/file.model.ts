import { Schema, model, Document } from 'mongoose';

export interface IFile extends Document {
  filename: string;
  originalname?: string;
  path: string;
  mimetype: string;
  size: number;
  userId: string;
  uploadDate: Date;
  parsed: boolean;
  parsedContent?: {
    sections: any[];
    metadata: Record<string, any>;
  };
}

const FileSchema = new Schema<IFile>({
  filename: { type: String, required: true },
  originalname: { type: String },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  userId: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  parsed: { type: Boolean, default: false },
  parsedContent: {
    sections: [Schema.Types.Mixed],
    metadata: Schema.Types.Mixed,
  },
});

// Add indexes for better query performance
FileSchema.index({ userId: 1 });
FileSchema.index({ filename: -1 });
FileSchema.index({ uploadDate: -1 });

export const fileModel = model<IFile>('File', FileSchema);
