import { FilterQuery, UpdateQuery } from 'mongoose';
import { AdmissionModel } from '../models';
import { IAdmission } from '../models/admission.model';
import ApiError from '../utils/ApiError';

/**
 * Create a new admission entry
 */
export const createAdmission = async (
  admissionData: Partial<IAdmission>
): Promise<IAdmission> => {
  return AdmissionModel.create(admissionData);
};

/**
 * Get admission by ID
 */
export const getAdmissionById = async (
  id: string
): Promise<IAdmission | null> => {
  const admission = await AdmissionModel.findById(id);
  if (!admission) {
    throw new ApiError(404, 'Admission not found');
  }
  return admission;
};

/**
 * Update admission by ID
 */
export const updateAdmissionById = async (
  id: string,
  updateData: UpdateQuery<IAdmission>
): Promise<IAdmission | null> => {
  const admission = await AdmissionModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!admission) {
    throw new ApiError(404, 'Admission not found');
  }
  return admission;
};

/**
 * Delete admission by ID
 */
export const deleteAdmissionById = async (
  id: string
): Promise<IAdmission | null> => {
  const admission = await AdmissionModel.findByIdAndDelete(id);
  if (!admission) {
    throw new ApiError(404, 'Admission not found');
  }
  return admission;
};

/**
 * Get admissions with optional filtering
 */
export const getAdmissions = async (
  filter: FilterQuery<IAdmission> = {},
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  admissions: IAdmission[];
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

  const [admissions, totalResults] = await Promise.all([
    AdmissionModel.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    AdmissionModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    admissions,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get admissions by university
 */
export const getAdmissionsByUniversity = async (
  university: string,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  admissions: IAdmission[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  return getAdmissions({ university }, options);
};

/**
 * Get admissions by degree type
 */
export const getAdmissionsByDegree = async (
  degree: string,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  admissions: IAdmission[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  return getAdmissions({ degree }, options);
};

/**
 * Get admissions with upcoming deadlines (within next 30 days)
 */
export const getUpcomingDeadlineAdmissions = async (
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  admissions: IAdmission[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  return getAdmissions(
    {
      applicationDeadline: {
        $gte: today,
        $lte: thirtyDaysFromNow,
      },
    },
    options
  );
};
