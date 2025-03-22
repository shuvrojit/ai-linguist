import { Request, Response } from 'express';
import {
  pageContentService,
  CreatePageContent,
} from '../services/pageContent.service';
import { asyncHandler } from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import { IPageContent } from '../models/pageContent.model';
import { featuresController } from '.';

export const pageContentController = {
  create: asyncHandler(
    async (req: Request<{}, {}, CreatePageContent>, res: Response) => {
      const rawContent = req.body;

      const existingContent = await pageContentService.findByUrl(
        rawContent.url
      );
      if (existingContent) {
        throw new ApiError(409, 'Content for this URL already exists');
      }

      // Clean content before saving
      //const cleanedContent = await pageContentService.cleanContent(rawContent);

      const content = (await pageContentService.create(
        rawContent
      )) as IPageContent & { _id: { toString(): string } };

      res.status(201).json({
        success: true,
        data: content,
        message: 'Content saved successfully',
      });

      const partialRes = {
        json: () => {},
        status: () => ({ json: () => {} }),
        sendStatus: () => {},
        links: () => {},
        send: () => {},
        jsonp: () => {},
        get: () => '',
        set: () => partialRes,
        header: () => partialRes,
        cookie: () => partialRes,
      } as unknown as Response;

      await featuresController.analyzeById(
        {
          body: { id: content._id.toString() },
          params: { id: content._id.toString() },
        } as Request<{ id: string }>,
        partialRes,
        () => {}
      );
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

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { sortBy, sortOrder, page, limit, search, searchFields } = req.query;

    // Parse searchFields if provided
    let parsedSearchFields: ('title' | 'text' | 'url')[] | undefined;
    if (searchFields) {
      parsedSearchFields = (searchFields as string).split(',') as (
        | 'title'
        | 'text'
        | 'url'
      )[];
    }

    const options = {
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      search: search as string,
      searchFields: parsedSearchFields,
    };

    const contents = await pageContentService.findAll(options);
    res.status(200).json({
      success: true,
      data: contents.data,
      meta: {
        total: contents.total,
        page: contents.page,
        limit: contents.limit,
      },
    });
  }),

  update: asyncHandler(
    async (
      req: Request<{ url: string }, {}, Partial<CreatePageContent>>,
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
