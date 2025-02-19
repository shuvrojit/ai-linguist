import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Interface for Page Content document
 * Represents the structure of content extracted from web pages
 *
 * @extends Document - Mongoose Document type
 */
export interface IPageContent extends Document {
  /** Title of the web page */
  title: string;
  /** Main text content of the page */
  text: string;
  /** Unique URL of the page */
  url: string;
  /** Base URL of the website */
  baseurl: string;
  /** Raw HTML content of the page */
  html: string;
  /** Array of media URLs found on the page */
  media: string[];
  /** Type of content */
  contentType: 'article' | 'news' | 'blog' | 'resource' | 'other';
  /** Additional metadata for flexible content categorization */
  metadata?: Record<string, any>;
  /** Timestamp of document creation */
  createdAt: Date;
  /** Timestamp of last update */
  updatedAt: Date;
}

/**
 * Mongoose Schema for Page Content
 *
 * Features:
 * - Automatic timestamps (createdAt, updatedAt)
 * - URL uniqueness validation
 * - Required field validation
 * - Text content trimming
 */
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
      unique: true,
      trim: true,
    },
    baseurl: {
      type: String,
      trim: true,
    },
    html: {
      type: String,
    },
    media: {
      type: [String],
      default: [],
    },
    contentType: {
      type: String,
      enum: ['article', 'news', 'blog', 'resource', 'other'],
      required: [true, 'Content type is required'],
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose model for Page Content
 *
 * @example
 * ```typescript
 * import PageContentModel from './models/pageContent.model';
 *
 * // Create new content
 * const content = new PageContentModel({
 *   title: 'Example Page',
 *   text: 'Page content...',
 *   url: 'https://example.com',
 *   baseurl: 'https://example.com',
 *   html: '<html>...</html>'
 * });
 *
 * // Save to database
 * await content.save();
 *
 * // Find content by URL
 * const found = await PageContentModel.findOne({ url: 'https://example.com' });
 * ```
 */
const PageContentModel: Model<IPageContent> = mongoose.model<IPageContent>(
  'PageContent',
  PageContentSchema
);

export default PageContentModel;
