import { Schema, model, Document } from 'mongoose';

export interface IOther extends Document {
  /** Content title */
  title: string;
  /** Content type/category */
  content_type: string;
  /** Author if available */
  author?: string;
  /** Publication/creation date */
  publication_date?: Date;
  /** Source/origin */
  source?: string;
  /** Content summary */
  summary: string;
  /** Key information points */
  key_points: string[];
  /** Topics covered */
  topics_covered: string[];
  /** Target audience if applicable */
  target_audience?: string;
  /** Content tags */
  tags: string[];
  /** Content sentiment */
  sentiment: 'positive' | 'negative' | 'neutral';
  /** Content complexity */
  complexity: 'basic' | 'intermediate' | 'advanced';
  /** Readability score */
  readability_score: number;
  /** Raw content details */
  content_details: Record<string, any>;
  /** Additional metadata */
  additional_info?: Record<string, any>;
  /** Extra data from analysis that doesn't fit model structure */
  extra_data?: Record<string, any>;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

const OtherSchema = new Schema<IOther>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content_type: {
      type: String,
      required: [true, 'Content type is required'],
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    publication_date: {
      type: Date,
    },
    source: {
      type: String,
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
    content_details: {
      type: Map,
      of: Schema.Types.Mixed,
      required: [true, 'Content details are required'],
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

const OtherModel = model<IOther>('Other', OtherSchema);

export default OtherModel;
