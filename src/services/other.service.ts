import { FilterQuery, UpdateQuery } from 'mongoose';
import { OtherModel } from '../models';
import { IOther } from '../models/other.model';
import ApiError from '../utils/ApiError';

/**
 * Create a new other content entry
 */
export const createOther = async (
  otherData: Partial<IOther>
): Promise<IOther> => {
  return OtherModel.create(otherData);
};

/**
 * Get other content by ID
 */
export const getOtherById = async (id: string): Promise<IOther | null> => {
  const other = await OtherModel.findById(id);
  if (!other) {
    throw new ApiError(404, 'Content not found');
  }
  return other;
};

/**
 * Update other content by ID
 */
export const updateOtherById = async (
  id: string,
  updateData: UpdateQuery<IOther>
): Promise<IOther | null> => {
  const other = await OtherModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!other) {
    throw new ApiError(404, 'Content not found');
  }
  return other;
};

/**
 * Delete other content by ID
 */
export const deleteOtherById = async (id: string): Promise<IOther | null> => {
  const other = await OtherModel.findByIdAndDelete(id);
  if (!other) {
    throw new ApiError(404, 'Content not found');
  }
  return other;
};

/**
 * Get other content with optional filtering
 */
export const getOthers = async (
  filter: FilterQuery<IOther> = {},
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  others: IOther[];
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

  const [others, totalResults] = await Promise.all([
    OtherModel.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    OtherModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    others,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get other content by type
 */
export const getOthersByType = async (
  content_type: string,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  others: IOther[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  return getOthers({ content_type }, options);
};

/**
 * Get other content by complexity
 */
export const getOthersByComplexity = async (
  complexity: 'basic' | 'intermediate' | 'advanced',
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  others: IOther[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  return getOthers({ complexity }, options);
};
