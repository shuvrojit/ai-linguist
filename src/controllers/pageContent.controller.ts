import { Request, Response } from 'express';
import { pageContentService } from '../services';
import { PageContent } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

export const pageContentController = {
  create: asyncHandler(
    async (req: Request<{}, {}, PageContent>, res: Response) => {
      const rawContent = req.body;

      const existingContent = await pageContentService.findByUrl(
        rawContent.url
      );
      if (existingContent) {
        throw new ApiError(409, 'Content for this URL already exists');
      }

      const content = await pageContentService.create(rawContent);
      res.status(201).json({
        success: true,
        data: content,
      });
    }
  ),

  getByUrl: asyncHandler(
    async (req: Request<{ url: string }>, res: Response) => {
      const { url } = req.params;
      const content = await pageContentService.findByUrl(url);

      if (!content) {
        throw new ApiError(404, 'Content not found');
      }

      res.status(200).json({
        success: true,
        data: content,
      });
    }
  ),

  getById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const content = await pageContentService.findById(id);

    if (!content) {
      throw new ApiError(404, 'Content not found');
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  }),

  getAll: asyncHandler(async (_: Request, res: Response) => {
    const contents = await pageContentService.findAll();
    res.status(200).json({
      success: true,
      data: contents,
    });
  }),

  update: asyncHandler(
    async (
      req: Request<{ url: string }, {}, Partial<PageContent>>,
      res: Response
    ) => {
      const { url } = req.params;
      const updateData = req.body;

      const updatedContent = await pageContentService.update(url, updateData);
      if (!updatedContent) {
        throw new ApiError(404, 'Content not found');
      }

      res.status(200).json({
        success: true,
        data: updatedContent,
      });
    }
  ),

  delete: asyncHandler(async (req: Request<{ url: string }>, res: Response) => {
    const { url } = req.params;
    const deleted = await pageContentService.delete(url);

    if (!deleted) {
      throw new ApiError(404, 'Content not found');
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    });
  }),
};
