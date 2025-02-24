import { FilterQuery, UpdateQuery } from 'mongoose';
import { TechnicalModel } from '../models';
import { ITechnical } from '../models/technical.model';
import ApiError from '../utils/ApiError';

/**
 * Create a new technical document
 */
export const createTechnical = async (
  technicalData: Partial<ITechnical>
): Promise<ITechnical> => {
  return TechnicalModel.create(technicalData);
};

/**
 * Get technical document by ID
 */
export const getTechnicalById = async (
  id: string
): Promise<ITechnical | null> => {
  const technical = await TechnicalModel.findById(id);
  if (!technical) {
    throw new ApiError(404, 'Technical document not found');
  }
  return technical;
};

/**
 * Update technical document by ID
 */
export const updateTechnicalById = async (
  id: string,
  updateData: UpdateQuery<ITechnical>
): Promise<ITechnical | null> => {
  const technical = await TechnicalModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!technical) {
    throw new ApiError(404, 'Technical document not found');
  }
  return technical;
};

/**
 * Delete technical document by ID
 */
export const deleteTechnicalById = async (
  id: string
): Promise<ITechnical | null> => {
  const technical = await TechnicalModel.findByIdAndDelete(id);
  if (!technical) {
    throw new ApiError(404, 'Technical document not found');
  }
  return technical;
};

/**
 * Get technical documents with optional filtering
 */
export const getTechnical = async (
  filter: FilterQuery<ITechnical> = {},
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  technical: ITechnical[];
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

  const [technical, totalResults] = await Promise.all([
    TechnicalModel.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    TechnicalModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    technical,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get technical documents by technology
 */
export const getTechnicalByTechnology = async (
  technology: string,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  technical: ITechnical[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  return getTechnical({ technology }, options);
};

/**
 * Get technical documents by complexity level
 */
export const getTechnicalByComplexity = async (
  complexity_level: 'beginner' | 'intermediate' | 'advanced',
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  technical: ITechnical[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  return getTechnical({ complexity_level }, options);
};
