import { Schema, model } from 'mongoose';

export interface IJobDescription {
  company_title: string;
  job_position: string;
  job_location: string;
  job_type: 'contract' | 'full time' | 'part time';
  workplace: 'remote' | 'on-site' | 'hybrid';
  due_date: Date;
  tech_stack: string[];
  responsibilities: string[];
  professional_experience: number;
  requirements: string[];
  additional_skills?: string[];
  company_culture: string;
}

const jobDescriptionSchema = new Schema<IJobDescription>(
  {
    company_title: { type: String, required: true },
    job_position: { type: String, required: true },
    job_location: { type: String, required: true },
    job_type: {
      type: String,
      required: true,
      enum: ['contract', 'full time', 'part time'],
    },
    workplace: {
      type: String,
      required: true,
      enum: ['remote', 'on-site', 'hybrid'],
    },
    due_date: { type: Date, required: true },
    tech_stack: [{ type: String, required: true }],
    responsibilities: [{ type: String, required: true }],
    professional_experience: { type: Number, required: true },
    requirements: [{ type: String, required: true }],
    additional_skills: [{ type: String }],
    company_culture: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const JobDescriptionModel = model<IJobDescription>(
  'JobDescription',
  jobDescriptionSchema
);

export default JobDescriptionModel;
