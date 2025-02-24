import { Schema, model, Document } from 'mongoose';

export interface IJobDescription extends Document {
  /** Company name */
  company_title?: string;
  /** Job position/title */
  job_position?: string;
  /** Job location */
  job_location?: string;
  /** Type of employment */
  job_type: 'contract' | 'full time' | 'part time';
  /** Work environment type */
  workplace?: 'remote' | 'on-site' | 'hybrid';
  /** Application deadline */
  due_date?: Date;
  /** Required technical skills */
  tech_stack: string[];
  /** Job responsibilities */
  responsibilities?: string[];
  /** Years of professional experience required */
  professional_experience?: number;
  // add a contact email field
  contact_email?: string;
  /** Job requirements */
  requirements?: string[];
  /** Additional desired skills */
  additional_skills?: string[];
  /** Company culture description */
  company_culture?: string;
  /** Job posting status */
  status: 'active' | 'filled' | 'expired' | 'draft';
  /** Salary range/information */
  salary?: string;
  /** Additional metadata */
  additional_info?: Record<string, any>;
  /** Extra dynamic data */
  extra_data?: Record<string, any>;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Mongoose Schema for Job Description
 *
 * Features:
 * - Automatic timestamps
 * - Required field validation
 * - String trimming
 * - Status tracking
 * - Flexible additional information
 */
const jobDescriptionSchema = new Schema<IJobDescription>(
  {
    company_title: { type: String },
    job_position: { type: String },
    job_location: { type: String },
    job_type: {
      type: String,
      required: true,
      enum: ['contract', 'full-time', 'part-time', 'full time', 'part time'],
    },
    workplace: {
      type: String,
      enum: ['remote', 'on-site', 'hybrid'],
    },
    due_date: { type: Date },
    tech_stack: [{ type: String, required: true }],
    responsibilities: [{ type: String }],
    professional_experience: { type: Number },
    contact_email: { type: String },
    requirements: [{ type: String }],
    additional_skills: [{ type: String }],
    company_culture: { type: String },
    status: {
      type: String,
      enum: ['active', 'filled', 'expired', 'draft'],
      default: 'active',
      required: true,
    },
    salary: {
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
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose model for Job Description
 *
 * @example
 * ```typescript
 * import JobDescriptionModel from './models/jobDescription.model';
 *
 * // Create new job posting
 * const job = new JobDescriptionModel({
 *   job_type: 'full time',
 *   tech_stack: ['JavaScript', 'React', 'Node.js'],
 *   status: 'active',
 *   // Optional fields
 *   company_title: 'Tech Corp',
 *   job_position: 'Senior Developer',
 *   job_location: 'San Francisco',
 *   workplace: 'hybrid',
 *   due_date: new Date('2024-12-31'),
 *   responsibilities: ['Lead development team', 'Architect solutions'],
 *   professional_experience: 5,
 *   requirements: ['Bachelor\'s in CS', '5+ years experience'],
 *   company_culture: 'Innovative and collaborative environment',
 *   salary: '$120,000 - $150,000'
 * });
 *
 * // Save to database
 * await job.save();
 *
 * // Find active job postings
 * const activeJobs = await JobDescriptionModel.find({ status: 'active' });
 * ```
 */
const JobDescriptionModel = model<IJobDescription>(
  'JobDescription',
  jobDescriptionSchema
);

export default JobDescriptionModel;
