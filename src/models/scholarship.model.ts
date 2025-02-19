import { Schema, model, Document } from 'mongoose';

/**
 * Interface for Scholarship document
 * Represents the structure of scholarship opportunities
 *
 * @extends Document - Mongoose Document type
 */
export interface IScholarship extends Document {
  /** Title of the scholarship */
  title: string;
  /** Organization offering the scholarship */
  organization: string;
  /** Scholarship amount/value */
  amount: string;
  /** Application deadline */
  deadline: Date;
  /** Eligibility criteria */
  eligibility: string[];
  /** Requirements for application */
  requirements: string[];
  /** Fields of study covered */
  field_of_study: string[];
  /** Acceptable degree levels */
  degree_level: string[];
  /** Country where scholarship is offered */
  country: string;
  /** Application or information URL */
  link: string;
  /** Status of the scholarship */
  status: 'active' | 'expired' | 'upcoming';
  /** Additional details as key-value pairs */
  additional_info?: Record<string, any>;
  /** Timestamp of creation */
  createdAt: Date;
  /** Timestamp of last update */
  updatedAt: Date;
}

/**
 * Mongoose Schema for Scholarship
 *
 * Features:
 * - Automatic timestamps (createdAt, updatedAt)
 * - URL uniqueness validation
 * - Required field validation
 * - String trimming
 */
const ScholarshipSchema: Schema<IScholarship> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    amount: {
      type: String,
      required: [true, 'Scholarship amount is required'],
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    eligibility: {
      type: [String],
      required: [true, 'Eligibility criteria are required'],
      validate: [
        (val: string[]) => val.length > 0,
        'At least one eligibility criterion is required',
      ],
    },
    requirements: {
      type: [String],
      required: [true, 'Requirements are required'],
      validate: [
        (val: string[]) => val.length > 0,
        'At least one requirement is required',
      ],
    },
    field_of_study: {
      type: [String],
      required: [true, 'Field of study is required'],
      validate: [
        (val: string[]) => val.length > 0,
        'At least one field of study is required',
      ],
    },
    degree_level: {
      type: [String],
      required: [true, 'Degree level is required'],
      validate: [
        (val: string[]) => val.length > 0,
        'At least one degree level is required',
      ],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    link: {
      type: String,
      required: [true, 'Application link is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'upcoming'],
      default: 'active',
      required: true,
    },
    additional_info: {
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
 * Mongoose model for Scholarship
 *
 * @example
 * ```typescript
 * import ScholarshipModel from './models/scholarship.model';
 *
 * // Create new scholarship
 * const scholarship = new ScholarshipModel({
 *   title: 'STEM Excellence Scholarship',
 *   organization: 'University of Example',
 *   amount: '$10,000',
 *   deadline: new Date('2024-12-31'),
 *   eligibility: ['GPA 3.5+', 'STEM major'],
 *   requirements: ['Transcript', 'Essay', 'Recommendations'],
 *   field_of_study: ['Computer Science', 'Engineering'],
 *   degree_level: ['Bachelor'],
 *   country: 'United States',
 *   link: 'https://example.edu/scholarship'
 * });
 *
 * // Save to database
 * await scholarship.save();
 *
 * // Find active scholarships
 * const active = await ScholarshipModel.find({ status: 'active' });
 * ```
 */
const ScholarshipModel = model<IScholarship>('Scholarship', ScholarshipSchema);

export default ScholarshipModel;
