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

      // Handle analysis in background
      process.nextTick(async () => {
        try {
          // Create a properly typed mock Response object
          const mockRes = {
            json: () => {},
            status: () => ({ json: () => {} }),
            sendStatus: () => {},
            links: () => {},
            send: () => {},
            jsonp: () => {},
            // Add other required Response methods as no-ops
            get: () => '',
            set: () => mockRes,
            header: () => mockRes,
            cookie: () => mockRes,
          } as unknown as Response;

          const mockNext = () => {};

          await featuresController.analyzeById(
            {
              body: { id: content._id.toString() },
              params: { id: content._id.toString() },
            } as Request<{ id: string }>,
            mockRes,
            mockNext
          );
          console.log('Content saved and analyzed successfully');
        } catch (error) {
          console.error('Error analyzing content:', error);
        }
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
      links: contents,
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
