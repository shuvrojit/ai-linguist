import { Schema, model, Document } from 'mongoose';

export interface INews extends Document {
  /** News title */
  title: string;
  /** News author */
  author: string;
  /** Publication date */
  publication_date: Date;
  /** Source/publisher */
  source: string;
  /** News content summary */
  summary: string;
  /** Key points from the news */
  key_points: string[];
  /** Topics covered */
  topics_covered: string[];
  /** Target audience */
  target_audience: string;
  /** News category (e.g., politics, technology, business) */
  category: string;
  /** News tags */
  tags: string[];
  /** Content sentiment */
  sentiment: 'positive' | 'negative' | 'neutral';
  /** Content complexity */
  complexity: 'basic' | 'intermediate' | 'advanced';
  /** Readability score */
  readability_score: number;
  /** Is breaking news */
  is_breaking: boolean;
  /** Geographic region */
  region?: string;
  /** Additional metadata */
  additional_info?: Record<string, any>;
  /** Extra data from analysis that doesn't fit model structure */
  extra_data?: Record<string, any>;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
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
    category: {
      type: String,
      required: [true, 'News category is required'],
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
    is_breaking: {
      type: Boolean,
      default: false,
    },
    region: {
      type: String,
      trim: true,
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

const NewsModel = model<INews>('News', NewsSchema);

export default NewsModel;
