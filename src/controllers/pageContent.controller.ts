import { Request, Response } from 'express';
import {
  pageContentService,
  extractPageInformation,
} from '../services/pageContent.service';
import logger from '../config/logger';

export const pageContentController = {
  async create(req: Request, res: Response) {
    try {
      const rawContent = req.body;

      const existingContent = await pageContentService.findByUrl(
        rawContent.url
      );
      if (existingContent) {
        return res.status(409).json({
          success: false,
          message: 'Content for this URL already exists',
          data: existingContent,
        });
      }

      try {
        const extractedInfo = await extractPageInformation(rawContent.text);
        rawContent.extractedInfo = extractedInfo;
      } catch (extractError) {
        logger.error('Error extracting page information:', extractError);
      }

      const content = await pageContentService.create(rawContent);
      res.status(201).json({
        success: true,
        data: content,
      });
    } catch (error) {
      logger.error('Error creating page content:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating page content',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async getByUrl(req: Request, res: Response) {
    try {
      const { url } = req.params;
      const content = await pageContentService.findByUrl(url);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found',
        });
      }
      res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error) {
      logger.error('Error retrieving page content:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving page content',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async getAll(_: Request, res: Response) {
    try {
      const contents = await pageContentService.findAll();
      res.status(200).json({
        success: true,
        data: contents,
      });
    } catch (error) {
      logger.error('Error retrieving all page contents:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving all page contents',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { url } = req.params;
      const updateData = req.body;

      const updatedContent = await pageContentService.update(url, updateData);
      if (!updatedContent) {
        return res.status(404).json({
          success: false,
          message: 'Content not found',
        });
      }
      res.status(200).json({
        success: true,
        data: updatedContent,
      });
    } catch (error) {
      logger.error('Error updating page content:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating page content',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { url } = req.params;
      const deleted = await pageContentService.delete(url);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Content not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Content deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting page content:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting page content',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};
