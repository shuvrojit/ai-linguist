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
  return JobDescriptionModel.create(jobData);
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
  const jobDescription = await JobDescriptionModel.findByIdAndUpdate(
    id,
    updateData,
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
