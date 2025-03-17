import { Schema, model, Document } from 'mongoose';

/**
 * Interface for Admission document
 * Represents the structure of university admission opportunities
 *
 * @extends Document - Mongoose Document type
 */
export interface IAdmission extends Document {
  /** Name of the university */
  university: string;
  /** Title of the program */
  programTitle: string;
  /** Type of degree */
  degree: string;
  /** Duration of the program */
  duration: string;
  /** Language of instruction */
  languageOfInstruction: string;
  /** Requirements for admission */
  admissionRequirements: string[];
  /** Required documents for application */
  documentsRequired: string[];
  /** Application deadline */
  applicationDeadline: Date;
  /** URL for program application */
  applicationURL: string;
  /** Tuition fee information */
  tuitionFee: string;
  /** Additional program information */
  additionalInfo?: string;
  /** Timestamp of creation */
  createdAt: Date;
  /** Timestamp of last update */
  updatedAt: Date;
}

/**
 * Mongoose Schema for Admission
 *
 * Features:
 * - Automatic timestamps (createdAt, updatedAt)
 * - Required field validation
 * - String trimming
 */
const AdmissionSchema: Schema<IAdmission> = new Schema(
  {
    university: {
      type: String,
      required: [true, 'University name is required'],
      trim: true,
    },
    programTitle: {
      type: String,
      required: [true, 'Program title is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree type is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Program duration is required'],
      trim: true,
    },
    languageOfInstruction: {
      type: String,
      trim: true,
    },
    admissionRequirements: {
      type: [String],
      required: [true, 'Admission requirements are required'],
      validate: [
        (val: string[]) => val.length > 0,
        'At least one admission requirement is required',
      ],
    },
    documentsRequired: {
      type: [String],
      required: [true, 'Required documents must be specified'],
      validate: [
        (val: string[]) => val.length > 0,
        'At least one required document must be specified',
      ],
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
      default: new Date('2025-07-15'),
    },
    applicationURL: {
      type: String,
      required: [true, 'Application URL is required'],
      trim: true,
      default:
        'https://www.fu-berlin.de/en/studium/studienangebot/master/data-science/index.html',
    },
    tuitionFee: {
      type: String,
      required: [true, 'Tuition fee information is required'],
      trim: true,
      default: 'No tuition fees; semester contributions required',
    },
    additionalInfo: {
      type: String,
      trim: true,
      default: 'For further details, please visit the program webpage.',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose model for Admission
 *
 * @example
 * ```typescript
 * import AdmissionModel from './models/admission.model';
 *
 * // Create new admission entry
 * const admission = new AdmissionModel({
 *   university: 'Example University',
 *   programTitle: 'Master of Science in Data Science',
 *   degree: 'Master',
 *   duration: '2 years',
 *   languageOfInstruction: 'English',
 *   admissionRequirements: ['Bachelor degree', 'English proficiency'],
 *   documentsRequired: ['Transcripts', 'CV', 'Motivation letter'],
 *   applicationDeadline: new Date('2025-07-15'),
 *   applicationURL: 'https://example.edu/apply',
 *   tuitionFee: '10,000 EUR per year'
 * });
 *
 * // Save to database
 * await admission.save();
 *
 * // Find all admissions
 * const admissions = await AdmissionModel.find();
 * ```
 */
const AdmissionModel = model<IAdmission>('Admission', AdmissionSchema);

export default AdmissionModel;
