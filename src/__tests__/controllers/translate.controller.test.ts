import { Request, Response } from 'express';
import { featuresController } from '../../controllers';
import { featuresService } from '../../services';
import axios from 'axios';

jest.mock('../../services');
jest.mock('axios');

describe('Features Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('summarize', () => {
    it('should generate summary successfully', async () => {
      const mockSummary = '<div>Test summary</div>';
      const mockHtmlData = '<html>Test data</html>';
      (axios.get as jest.Mock).mockResolvedValue({ data: mockHtmlData });
      (featuresService.getSummary as jest.Mock).mockResolvedValue(mockSummary);

      mockRequest = {
        body: {
          url: 'https://example.com',
        },
      };

      await featuresController.summarize(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSummary);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Failed to generate summary');
      (axios.get as jest.Mock).mockRejectedValue(mockError);

      mockRequest = {
        body: {
          url: 'https://example.com',
        },
      };

      await featuresController.summarize(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError });
    });
  });

  describe('extractText', () => {
    it('should extract text successfully', async () => {
      const mockText = 'Extracted meaningful text';
      (featuresService.extractMeaningfullText as jest.Mock).mockResolvedValue(
        mockText
      );

      mockRequest = {
        body: {
          content: {
            text: '<div>Some HTML</div>',
          },
        },
      };

      await featuresController.extractText(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockText);
    });
  });

  describe('overview', () => {
    it('should generate detailed overview successfully', async () => {
      const mockOverview = '<div>Detailed overview</div>';
      const mockHtmlData = '<html>Test data</html>';
      (axios.get as jest.Mock).mockResolvedValue({ data: mockHtmlData });
      (featuresService.detailOverview as jest.Mock).mockResolvedValue(
        mockOverview
      );

      mockRequest = {
        body: {
          url: 'https://example.com',
        },
      };

      await featuresController.overview(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOverview);
    });
  });

  describe('analyzeMeaning', () => {
    const mockAnalyzeResult = {
      category: 'technical',
      type: 'documentation',
      tags: ['typescript', 'api'],
      metadata: {
        title: 'API Documentation',
        author: 'John Doe',
      },
      details: {
        technology: 'TypeScript',
        complexity_level: 'intermediate',
      },
    };

    it('should analyze content successfully', async () => {
      (featuresService.extractMeaning as jest.Mock).mockResolvedValue(
        mockAnalyzeResult
      );

      mockRequest = {
        body: {
          content: {
            text: 'Sample documentation content',
          },
        },
      };

      await featuresController.analyzeMeaning(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnalyzeResult);
      expect(featuresService.extractMeaning).toHaveBeenCalledWith(
        'Sample documentation content'
      );
    });

    it('should handle missing content', async () => {
      mockRequest = {
        body: {},
      };

      await featuresController.analyzeMeaning(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
        })
      );
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Analysis failed');
      (featuresService.extractMeaning as jest.Mock).mockRejectedValue(
        mockError
      );

      mockRequest = {
        body: {
          content: {
            text: 'Sample content',
          },
        },
      };

      await featuresController.analyzeMeaning(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: mockError,
      });
    });
  });
});
