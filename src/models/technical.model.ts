import { Schema, model, Document } from 'mongoose';

export interface ITechnical extends Document {
  /** Title of the technical content */
  title: string;
  /** Author of the content */
  author: string;
  /** Publication date */
  publication_date: Date;
  /** Source/platform */
  source: string;
  /** Main technology or framework */
  technology: string;
  /** Complexity level */
  complexity_level: 'beginner' | 'intermediate' | 'advanced';
  /** Code snippets */
  code_snippets: string[];
  /** Prerequisites */
  prerequisites: string[];
  /** Target audience */
  target_audience: string;
  /** Technical tags */
  tags: string[];
  /** Content sentiment */
  sentiment: 'positive' | 'negative' | 'neutral';
  /** Content type (e.g., tutorial, documentation, guide) */
  content_type: string;
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

const TechnicalSchema = new Schema<ITechnical>(
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
    technology: {
      type: String,
      required: [true, 'Technology is required'],
      trim: true,
    },
    complexity_level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    code_snippets: {
      type: [String],
      default: [],
    },
    prerequisites: {
      type: [String],
      required: [true, 'Prerequisites are required'],
      validate: [
        (val: string[]) => val.length > 0,
        'At least one prerequisite is required',
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
    content_type: {
      type: String,
      required: [true, 'Content type is required'],
      trim: true,
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

const TechnicalModel = model<ITechnical>('Technical', TechnicalSchema);

export default TechnicalModel;
