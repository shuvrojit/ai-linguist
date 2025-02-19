import { Request, Response } from 'express';
import { featuresService } from '../../services';
import { analyzeMeaning } from '../../controllers/features.controller';
import ApiError from '../../utils/ApiError';

jest.mock('../../services/features.service');

describe('Features Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('analyzeMeaning', () => {
    it('should successfully analyze text content', async () => {
      const mockResult = {
        category: 'job',
        type: 'job posting',
        metadata: {
          title: 'Software Engineer',
        },
      };

      mockRequest.body = {
        content: {
          text: 'test content',
        },
      };

      (featuresService.analyzeContent as jest.Mock).mockResolvedValue(
        mockResult
      );

      await analyzeMeaning(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should throw ApiError when text content is missing', async () => {
      mockRequest.body = {};

      await analyzeMeaning(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Text content is required',
        })
      );
    });

    it('should pass service errors to error handler', async () => {
      mockRequest.body = {
        content: {
          text: 'test content',
        },
      };

      const error = new Error('Service error');
      (featuresService.analyzeContent as jest.Mock).mockRejectedValue(error);

      await analyzeMeaning(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
