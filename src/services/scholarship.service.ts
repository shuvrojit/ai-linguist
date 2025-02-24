import { FilterQuery, UpdateQuery } from 'mongoose';
import { ScholarshipModel } from '../models';
import { IScholarship } from '../models/scholarship.model';
import ApiError from '../utils/ApiError';

/**
 * Create a new scholarship entry
 */
export const createScholarship = async (
  scholarshipData: Partial<IScholarship>
): Promise<IScholarship> => {
  return ScholarshipModel.create(scholarshipData);
};

/**
 * Get scholarship by ID
 */
export const getScholarshipById = async (
  id: string
): Promise<IScholarship | null> => {
  const scholarship = await ScholarshipModel.findById(id);
  if (!scholarship) {
    throw new ApiError(404, 'Scholarship not found');
  }
  return scholarship;
};

/**
 * Update scholarship by ID
 */
export const updateScholarshipById = async (
  id: string,
  updateData: UpdateQuery<IScholarship>
): Promise<IScholarship | null> => {
  const scholarship = await ScholarshipModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!scholarship) {
    throw new ApiError(404, 'Scholarship not found');
  }
  return scholarship;
};

/**
 * Delete scholarship by ID
 */
export const deleteScholarshipById = async (
  id: string
): Promise<IScholarship | null> => {
  const scholarship = await ScholarshipModel.findByIdAndDelete(id);
  if (!scholarship) {
    throw new ApiError(404, 'Scholarship not found');
  }
  return scholarship;
};

/**
 * Get scholarships with optional filtering
 */
export const getScholarships = async (
  filter: FilterQuery<IScholarship> = {},
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  scholarships: IScholarship[];
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

  const [scholarships, totalResults] = await Promise.all([
    ScholarshipModel.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    ScholarshipModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    scholarships,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get active scholarships
 */
export const getActiveScholarships = async (
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  scholarships: IScholarship[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  return getScholarships({ status: 'active' }, options);
};

/**
 * Get scholarships by country
 */
export const getScholarshipsByCountry = async (
  country: string,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  scholarships: IScholarship[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  return getScholarships({ country }, options);
};
