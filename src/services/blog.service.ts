import { FilterQuery, UpdateQuery } from 'mongoose';
import { BlogModel } from '../models';
import { IBlog } from '../models/blog.model';
import ApiError from '../utils/ApiError';

/**
 * Create a new blog entry
 */
export const createBlog = async (blogData: Partial<IBlog>): Promise<IBlog> => {
  return BlogModel.create(blogData);
};

/**
 * Get blog by ID
 */
export const getBlogById = async (id: string): Promise<IBlog | null> => {
  const blog = await BlogModel.findById(id);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }
  return blog;
};

/**
 * Update blog by ID
 */
export const updateBlogById = async (
  id: string,
  updateData: UpdateQuery<IBlog>
): Promise<IBlog | null> => {
  const blog = await BlogModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }
  return blog;
};

/**
 * Delete blog by ID
 */
export const deleteBlogById = async (id: string): Promise<IBlog | null> => {
  const blog = await BlogModel.findByIdAndDelete(id);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }
  return blog;
};

/**
 * Get blogs with optional filtering
 */
export const getBlogs = async (
  filter: FilterQuery<IBlog> = {},
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  blogs: IBlog[];
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

  const [blogs, totalResults] = await Promise.all([
    BlogModel.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    BlogModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    blogs,
    page,
    limit,
    totalPages,
    totalResults,
  };
};
