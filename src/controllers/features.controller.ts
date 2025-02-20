import { Request, Response } from 'express';
import axios from 'axios';
import { featuresService, pageContentService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

interface ContentRequest {
  content: {
    text: string;
  };
}

interface ExtractRequest {
  url: string;
}

export const analyzeMeaning = asyncHandler(
  async (req: Request<unknown, unknown, ContentRequest>, res: Response) => {
    const text = req.body?.content?.text;

    if (!text) {
      throw new ApiError(400, 'Text content is required');
    }

    const result = await featuresService.analyzeContent(text);
    res.status(200).json(result);
  }
);

export const extract = asyncHandler(
  async (req: Request<unknown, unknown, ExtractRequest>, res: Response) => {
    const url = req.body?.url;
    if (!url) {
      throw new ApiError(400, 'URL is required');
    }

    const { data }: { data: string } = await axios.get(
      `https://r.jina.ai/${url}`
    );

    res.status(200).json({ content: data });
  }
);

export const analyzeById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    const pageContent = await pageContentService.findById(id);
    if (!pageContent) {
      throw new ApiError(404, 'Page content not found');
    }

    const result = await featuresService.analyzeContent(pageContent.text);
    res.status(200).json(result);
  }
);
