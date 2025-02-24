import { Schema, model, Document } from 'mongoose';

export interface IBlog extends Document {
  /** Blog title */
  title: string;
  /** Blog author */
  author: string;
  /** Publication date */
  publication_date: Date;
  /** Source/website */
  source: string;
  /** Blog content summary */
  summary: string;
  /** Key points from the blog */
  key_points: string[];
  /** Topics covered */
  topics_covered: string[];
  /** Target audience */
  target_audience: string;
  /** Blog tags */
  tags: string[];
  /** Content sentiment */
  sentiment: 'positive' | 'negative' | 'neutral';
  /** Content complexity */
  complexity: 'basic' | 'intermediate' | 'advanced';
  /** Readability score */
  readability_score: number;
  /** Additional metadata */
  additional_info?: Record<string, any>;
  /** Extra data from analysis that doesn't fit model structure */
  extra_data?: Record<string, any>;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    publication_date: {
      type: Date,
      required: [true, 'Publication date is required'],
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
    },
    key_points: {
      type: [String],
      required: [true, 'Key points are required'],
      validate: [
        (val: string[]) => val.length > 0,
        'At least one key point is required',
      ],
    },
    topics_covered: {
      type: [String],
      required: [true, 'Topics are required'],
      validate: [
        (val: string[]) => val.length > 0,
        'At least one topic is required',
      ],
    },
    target_audience: {
      type: String,
      required: [true, 'Target audience is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      required: true,
    },
    complexity: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced'],
      required: true,
    },
    readability_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    additional_info: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    extra_data: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const BlogModel = model<IBlog>('Blog', BlogSchema);

export default BlogModel;
