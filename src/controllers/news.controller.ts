import { Request, Response } from 'express';
import * as newsService from '../services/news.service';
import { asyncHandler } from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

/**
 * Create a new news article
 *
 * @route POST /api/v1/news
 * @access Public
 */
export const createNews = asyncHandler(async (req: Request, res: Response) => {
  const news = await newsService.createNews(req.body);
  res.status(201).json(news);
});

/**
 * Get news article by ID
 *
 * @route GET /api/v1/news/:id
 * @access Public
 */
export const getNewsById = asyncHandler(async (req: Request, res: Response) => {
  const news = await newsService.getNewsById(req.params.id);
  res.status(200).json(news);
});

/**
 * Update news article by ID
 *
 * @route PATCH /api/v1/news/:id
 * @access Public
 */
export const updateNews = asyncHandler(async (req: Request, res: Response) => {
  const news = await newsService.updateNewsById(req.params.id, req.body);
  res.status(200).json(news);
});

/**
 * Delete news article by ID
 *
 * @route DELETE /api/v1/news/:id
 * @access Public
 */
export const deleteNews = asyncHandler(async (req: Request, res: Response) => {
  await newsService.deleteNewsById(req.params.id);
  res.status(204).send();
});

/**
 * Get all news articles with filtering, sorting, and pagination
 *
 * @route GET /api/v1/news
 * @access Public
 */
export const getNews = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, any> = {};
  const options = {
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  // Add filters based on query parameters
  if (req.query.sentiment) {
    filter['sentiment'] = req.query.sentiment;
  }
  if (req.query.complexity) {
    filter['complexity'] = req.query.complexity;
  }
  if (req.query.tag) {
    filter['tags'] = { $in: [req.query.tag] };
  }
  if (req.query.category) {
    filter['category'] = req.query.category;
  }
  if (req.query.region) {
    filter['region'] = req.query.region;
  }

  const result = await newsService.getNews(filter, options);
  res.status(200).json(result);
});

/**
 * Get breaking news
 *
 * @route GET /api/v1/news/breaking
 * @access Public
 */
export const getBreakingNews = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const news = await newsService.getBreakingNews(limit);
    res.status(200).json({ news });
  }
);

/**
 * Get news by category
 *
 * @route GET /api/v1/news/category/:category
 * @access Public
 */
export const getNewsByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await newsService.getNewsByCategory(
      req.params.category,
      options
    );
    res.status(200).json(result);
  }
);
