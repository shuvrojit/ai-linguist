import { Request, Response } from 'express';
import { featuresService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

interface ContentRequest {
  content: {
    text: string;
  };
}

export const analyzeMeaning = asyncHandler(
  async (req: Request<unknown, unknown, ContentRequest>, res: Response) => {
    const text = req.body?.content?.text;

    if (!text) {
      throw new ApiError(400, 'Text content is required');
    }

    const result = await featuresService.extractMeaning(text);
    res.status(200).json(result);
  }
);
