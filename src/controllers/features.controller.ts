import { Request, Response } from 'express';
import axios from 'axios';
import { featuresService, pageContentService } from '../services';
import {
  JobDescriptionModel,
  ScholarshipModel,
  BlogModel,
  NewsModel,
  TechnicalModel,
  OtherModel,
} from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

interface ContentRequest {
  content: {
    text: string;
  };
}

interface SummarizeRequest extends ContentRequest {}

interface ExtractRequest {
  url: string;
}

export const summarize = asyncHandler(
  async (req: Request<unknown, unknown, SummarizeRequest>, res: Response) => {
    const text = req.body?.content?.text;

    if (!text) {
      throw new ApiError(400, 'Text content is required');
    }

    const result = await featuresService.summarizeContent(text);
    res.status(200).json(result);
  }
);

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
    const { id } = req.body;
    console.log(id);

    const pageContent = await pageContentService.findById(id);

    if (!pageContent) {
      throw new ApiError(404, 'Page content not found');
    }

    const result = await featuresService.analyzeContent(pageContent.text);
    // Save to appropriate collection based on category
    console.log(result);
    let savedContent;
    switch (result.category) {
      case 'job':
        savedContent = await JobDescriptionModel.create(result);
        break;

      case 'scholarship':
        savedContent = await ScholarshipModel.create(result);
        break;

      case 'blog':
        savedContent = await BlogModel.create({
          title: result.metadata?.title || 'Untitled Blog',
          author: result.metadata?.author || 'Unknown Author',
          publication_date: new Date(result.metadata?.date || Date.now()),
          source: result.metadata?.source || 'Unknown Source',
          summary: result.details?.summary || '',
          key_points: result.details?.key_points || [],
          topics_covered: result.details?.topics_covered || [],
          target_audience: result.details?.target_audience || 'General',
          tags: result.tags || [],
          sentiment: result.sentiment || 'neutral',
          complexity: result.complexity || 'basic',
          readability_score: result.readability_score || 50,
          additional_info: {
            original_content_id: pageContent._id,
            metadata: result.metadata,
          },
          extra_data: result.extra_data || {},
        });
        break;

      case 'news':
        savedContent = await NewsModel.create({
          title: result.metadata?.title || 'Untitled News',
          author: result.metadata?.author || 'Unknown Author',
          publication_date: new Date(result.metadata?.date || Date.now()),
          source: result.metadata?.source || 'Unknown Source',
          summary: result.details?.summary || '',
          key_points: result.details?.key_points || [],
          topics_covered: result.details?.topics_covered || [],
          target_audience: result.details?.target_audience || 'General',
          category: result.type || 'General',
          tags: result.tags || [],
          sentiment: result.sentiment || 'neutral',
          complexity: result.complexity || 'basic',
          readability_score: result.readability_score || 50,
          is_breaking: false,
          additional_info: {
            original_content_id: pageContent._id,
            metadata: result.metadata,
          },
          extra_data: result.extra_data || {},
        });
        break;

      case 'technical':
        savedContent = await TechnicalModel.create({
          title: result.metadata?.title || 'Untitled Technical Document',
          author: result.metadata?.author || 'Unknown Author',
          publication_date: new Date(result.metadata?.date || Date.now()),
          source: result.metadata?.source || 'Unknown Source',
          technology: result.details?.technology || 'Not specified',
          complexity_level: result.complexity || 'beginner',
          code_snippets: result.details?.code_snippets || [],
          prerequisites: result.details?.prerequisites || [],
          target_audience: result.details?.target_audience || 'Developers',
          tags: result.tags || [],
          sentiment: result.sentiment || 'neutral',
          content_type: result.type || 'documentation',
          readability_score: result.readability_score || 50,
          additional_info: {
            original_content_id: pageContent._id,
            metadata: result.metadata,
          },
          extra_data: result.extra_data || {},
        });
        break;

      default: // 'other' or unknown categories
        savedContent = await OtherModel.create({
          title: result.metadata?.title || 'Untitled Content',
          content_type: result.type || 'Unknown Type',
          author: result.metadata?.author,
          publication_date: result.metadata?.date
            ? new Date(result.metadata.date)
            : undefined,
          source: result.metadata?.source,
          summary: result.details?.summary || '',
          key_points: result.details?.key_points || [],
          topics_covered: result.details?.topics_covered || [],
          target_audience: result.details?.target_audience,
          tags: result.tags || [],
          sentiment: result.sentiment || 'neutral',
          complexity: result.complexity || 'basic',
          readability_score: result.readability_score || 50,
          content_details: result.details || {},
          additional_info: {
            original_content_id: pageContent._id,
            metadata: result.metadata,
          },
          extra_data: result.extra_data || {},
        });
    }

    // Include the saved content ID in the response
    result.saved_content = {
      category: result.category,
      id: savedContent?._id,
    };

    res.status(200).json(result);
  }
);
