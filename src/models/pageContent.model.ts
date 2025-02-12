import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPageContent extends Document {
  title: string;
  text: string;
  url: string;
  baseurl: string;
  html: string;
  media: string[]; // Assuming media is an array of strings (e.g., URLs or filenames)
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema: Schema<IPageContent> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    text: {
      type: String,
      required: [true, 'Text content is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      unique: true, // Ensures that each URL is unique in the collection
      trim: true,
    },
    baseurl: {
      type: String,
      // required: [true, 'Base URL is required'],
      trim: true,
    },
    html: {
      type: String,
      // required: [true, 'HTML content is required'],
    },
    media: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const PageContentModel: Model<IPageContent> = mongoose.model<IPageContent>(
  'PageContent',
  PageContentSchema
);

export default PageContentModel;
