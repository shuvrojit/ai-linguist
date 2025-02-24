import { FilterQuery, UpdateQuery } from 'mongoose';
import { JobDescriptionModel } from '../models';
import { IJobDescription } from '../models/jobDescription.model';
import ApiError from '../utils/ApiError';

/**
 * Create a new job description
 */
export const createJobDescription = async (
  jobData: Partial<IJobDescription>
): Promise<IJobDescription> => {
  // Data validation and transformation
  const processedData = {
    ...jobData,
    // Handle job type format
    job_type: (jobData.job_type as string)?.toLowerCase().replace(' ', '-'),

    // Convert professional experience to number
    professional_experience: jobData.professional_experience
      ? parseExperienceToNumber(jobData.professional_experience as any)
      : jobData.professional_experience,

    // Parse due date
    due_date: jobData.due_date ? new Date(jobData.due_date) : jobData.due_date,
  };

  // Validate date
  if (processedData.due_date && isNaN(processedData.due_date.getTime())) {
    throw new ApiError(
      400,
      'Invalid due date format. Please provide a valid date string (e.g., "2024-12-31")'
    );
  }

  return JobDescriptionModel.create(processedData);
};

/**
 * Convert experience string to number
 * Handles formats like "X years", "X+" etc
 */
const parseExperienceToNumber = (experience: string | number): number => {
  if (typeof experience === 'number') return experience;

  // Extract first number from string
  const numberMatch = experience.toLowerCase().match(/\d+/);
  if (!numberMatch) {
    throw new ApiError(
      400,
      'Invalid professional experience format. Please provide a number or a string containing a number (e.g., "5 years", "3+")'
    );
  }

  return parseInt(numberMatch[0], 10);
};

/**
 * Get job description by ID
 */
export const getJobDescriptionById = async (
  id: string
): Promise<IJobDescription | null> => {
  const jobDescription = await JobDescriptionModel.findById(id);
  if (!jobDescription) {
    throw new ApiError(404, 'Job description not found');
  }
  return jobDescription;
};

/**
 * Update job description by ID
 */
export const updateJobDescriptionById = async (
  id: string,
  updateData: UpdateQuery<IJobDescription>
): Promise<IJobDescription | null> => {
  // Process update data
  const processedData = { ...updateData };

  if (updateData.job_type) {
    processedData.job_type = (updateData.job_type as string)
      .toLowerCase()
      .replace(' ', '-');
  }

  if (updateData.professional_experience) {
    processedData.professional_experience = parseExperienceToNumber(
      updateData.professional_experience as any
    );
  }

  if (updateData.due_date) {
    const date = new Date(updateData.due_date as any);
    if (isNaN(date.getTime())) {
      throw new ApiError(
        400,
        'Invalid due date format. Please provide a valid date string (e.g., "2024-12-31")'
      );
    }
    processedData.due_date = date;
  }

  const jobDescription = await JobDescriptionModel.findByIdAndUpdate(
    id,
    processedData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!jobDescription) {
    throw new ApiError(404, 'Job description not found');
  }
  return jobDescription;
};

/**
 * Delete job description by ID
 */
export const deleteJobDescriptionById = async (
  id: string
): Promise<IJobDescription | null> => {
  const jobDescription = await JobDescriptionModel.findByIdAndDelete(id);
  if (!jobDescription) {
    throw new ApiError(404, 'Job description not found');
  }
  return jobDescription;
};

/**
 * Get job descriptions with optional filtering
 */
export const getJobDescriptions = async (
  filter: FilterQuery<IJobDescription> = {},
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  jobDescriptions: IJobDescription[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  const {
    limit = 10,
    page = 1,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;
  const skip = (page - 1) * limit;

  const [jobDescriptions, totalResults] = await Promise.all([
    JobDescriptionModel.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    JobDescriptionModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    jobDescriptions,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get active job descriptions
 */
export const getActiveJobs = async (
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  jobDescriptions: IJobDescription[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  return getJobDescriptions({ status: 'active' }, options);
};
