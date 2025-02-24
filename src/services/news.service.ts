import { FilterQuery, UpdateQuery } from 'mongoose';
import { NewsModel } from '../models';
import { INews } from '../models/news.model';
import ApiError from '../utils/ApiError';

/**
 * Create a new news article
 */
export const createNews = async (newsData: Partial<INews>): Promise<INews> => {
  return NewsModel.create(newsData);
};

/**
 * Get news article by ID
 */
export const getNewsById = async (id: string): Promise<INews | null> => {
  const news = await NewsModel.findById(id);
  if (!news) {
    throw new ApiError(404, 'News article not found');
  }
  return news;
};

/**
 * Update news article by ID
 */
export const updateNewsById = async (
  id: string,
  updateData: UpdateQuery<INews>
): Promise<INews | null> => {
  const news = await NewsModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!news) {
    throw new ApiError(404, 'News article not found');
  }
  return news;
};

/**
 * Delete news article by ID
 */
export const deleteNewsById = async (id: string): Promise<INews | null> => {
  const news = await NewsModel.findByIdAndDelete(id);
  if (!news) {
    throw new ApiError(404, 'News article not found');
  }
  return news;
};

/**
 * Get news articles with optional filtering
 */
export const getNews = async (
  filter: FilterQuery<INews> = {},
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  news: INews[];
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

  const [news, totalResults] = await Promise.all([
    NewsModel.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    NewsModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    news,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get breaking news
 */
export const getBreakingNews = async (limit = 5): Promise<INews[]> => {
  return NewsModel.find({ is_breaking: true })
    .sort({ createdAt: 'desc' })
    .limit(limit);
};

/**
 * Get news by category
 */
export const getNewsByCategory = async (
  category: string,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  news: INews[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}> => {
  return getNews({ category }, options);
};
