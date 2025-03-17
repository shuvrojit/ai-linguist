// filepath: /home/shuv40/Desktop/startups/ai-linguist/src/__tests__/controllers/other.controller.test.ts
import { Request, Response, NextFunction } from 'express';
import * as otherController from '../../controllers/other.controller';
import * as otherService from '../../services/other.service';

// Mock the services
jest.mock('../../services/other.service');

// Mock the asyncHandler utility
jest.mock('../../utils/asyncHandler', () => {
  return {
    asyncHandler: jest.fn((fn) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        try {
          await fn(req, res, next);
        } catch (error) {
          next(error);
        }
      };
    }),
  };
});

describe('Other Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('createOther', () => {
    it('should create other content and return 201 status', async () => {
      // Arrange
      const otherData = {
        title: 'Test Other Content',
        content: 'This is a test content',
        content_type: 'article',
      };

      mockRequest.body = otherData;

      const createdOther = {
        _id: 'mock-id-123',
        ...otherData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (otherService.createOther as jest.Mock).mockResolvedValue(createdOther);

      // Act
      await otherController.createOther(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(otherService.createOther).toHaveBeenCalledWith(otherData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdOther);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.body = {
        title: 'Test Other Content',
        content: 'This is a test content',
      };

      const error = new Error('Database error');
      (otherService.createOther as jest.Mock).mockRejectedValue(error);

      // Act
      await otherController.createOther(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getOtherById', () => {
    it('should get other content by ID and return 200 status', async () => {
      // Arrange
      const otherId = 'mock-id-123';
      mockRequest.params = { id: otherId };

      const mockOther = {
        _id: otherId,
        title: 'Test Other Content',
        content: 'This is a test content',
        content_type: 'article',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (otherService.getOtherById as jest.Mock).mockResolvedValue(mockOther);

      // Act
      await otherController.getOtherById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(otherService.getOtherById).toHaveBeenCalledWith(otherId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOther);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };

      const error = new Error('Not found');
      (otherService.getOtherById as jest.Mock).mockRejectedValue(error);

      // Act
      await otherController.getOtherById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateOther', () => {
    it('should update other content by ID and return 200 status', async () => {
      // Arrange
      const otherId = 'mock-id-123';
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      mockRequest.params = { id: otherId };
      mockRequest.body = updateData;

      const updatedOther = {
        _id: otherId,
        title: 'Updated Title',
        content: 'Updated content',
        content_type: 'article',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (otherService.updateOtherById as jest.Mock).mockResolvedValue(
        updatedOther
      );

      // Act
      await otherController.updateOther(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(otherService.updateOtherById).toHaveBeenCalledWith(
        otherId,
        updateData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedOther);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      mockRequest.body = { title: 'Updated Title' };

      const error = new Error('Not found');
      (otherService.updateOtherById as jest.Mock).mockRejectedValue(error);

      // Act
      await otherController.updateOther(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteOther', () => {
    it('should delete other content by ID and return 204 status', async () => {
      // Arrange
      const otherId = 'mock-id-123';
      mockRequest.params = { id: otherId };

      (otherService.deleteOtherById as jest.Mock).mockResolvedValue(true);

      // Act
      await otherController.deleteOther(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(otherService.deleteOtherById).toHaveBeenCalledWith(otherId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };

      const error = new Error('Not found');
      (otherService.deleteOtherById as jest.Mock).mockRejectedValue(error);

      // Act
      await otherController.deleteOther(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getOthers', () => {
    it('should get all others with default options', async () => {
      // Arrange
      mockRequest.query = {};

      const mockResult = {
        results: [
          {
            _id: 'mock-id-1',
            title: 'Other Content 1',
            content: 'Content 1',
            content_type: 'article',
          },
          {
            _id: 'mock-id-2',
            title: 'Other Content 2',
            content: 'Content 2',
            content_type: 'tutorial',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (otherService.getOthers as jest.Mock).mockResolvedValue(mockResult);

      // Act
      await otherController.getOthers(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(otherService.getOthers).toHaveBeenCalledWith(
        {},
        {
          limit: 10,
          page: 1,
          sortBy: undefined,
          sortOrder: undefined,
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should apply filters from query parameters', async () => {
      // Arrange
      mockRequest.query = {
        sentiment: 'positive',
        complexity: 'intermediate',
        tag: 'technology',
        content_type: 'article',
        limit: '5',
        page: '2',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      const mockResult = {
        results: [
          {
            _id: 'mock-id-1',
            title: 'Filtered Content',
            content: 'Filtered content text',
            content_type: 'article',
            sentiment: 'positive',
            complexity: 'intermediate',
            tags: ['technology'],
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 3,
        totalResults: 12,
      };

      (otherService.getOthers as jest.Mock).mockResolvedValue(mockResult);

      // Act
      await otherController.getOthers(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(otherService.getOthers).toHaveBeenCalledWith(
        {
          sentiment: 'positive',
          complexity: 'intermediate',
          tags: { $in: ['technology'] },
          content_type: 'article',
        },
        {
          limit: 5,
          page: 2,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (otherService.getOthers as jest.Mock).mockRejectedValue(error);

      // Act
      await otherController.getOthers(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getOthersByType', () => {
    it('should get others by type and return 200 status', async () => {
      // Arrange
      const contentType = 'article';
      mockRequest.params = { type: contentType };
      mockRequest.query = {};

      const mockResult = {
        results: [
          {
            _id: 'mock-id-1',
            title: 'Article 1',
            content: 'Article content 1',
            content_type: 'article',
          },
          {
            _id: 'mock-id-2',
            title: 'Article 2',
            content: 'Article content 2',
            content_type: 'article',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (otherService.getOthersByType as jest.Mock).mockResolvedValue(mockResult);

      // Act
      await otherController.getOthersByType(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(otherService.getOthersByType).toHaveBeenCalledWith(contentType, {
        limit: 10,
        page: 1,
        sortBy: undefined,
        sortOrder: undefined,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle pagination and sorting options', async () => {
      // Arrange
      const contentType = 'tutorial';
      mockRequest.params = { type: contentType };
      mockRequest.query = {
        limit: '5',
        page: '2',
        sortBy: 'title',
        sortOrder: 'asc',
      };

      const mockResult = {
        results: [
          {
            _id: 'mock-id-1',
            title: 'Tutorial A',
            content: 'Tutorial content A',
            content_type: 'tutorial',
          },
          {
            _id: 'mock-id-2',
            title: 'Tutorial B',
            content: 'Tutorial content B',
            content_type: 'tutorial',
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 3,
        totalResults: 12,
      };

      (otherService.getOthersByType as jest.Mock).mockResolvedValue(mockResult);

      // Act
      await otherController.getOthersByType(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(otherService.getOthersByType).toHaveBeenCalledWith(contentType, {
        limit: 5,
        page: 2,
        sortBy: 'title',
        sortOrder: 'asc',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { type: 'invalid-type' };

      const error = new Error('Not found');
      (otherService.getOthersByType as jest.Mock).mockRejectedValue(error);

      // Act
      await otherController.getOthersByType(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getOthersByComplexity', () => {
    it('should get others by complexity and return 200 status', async () => {
      // Arrange
      const complexityLevel = 'intermediate';
      mockRequest.params = { level: complexityLevel };
      mockRequest.query = {};

      const mockResult = {
        results: [
          {
            _id: 'mock-id-1',
            title: 'Intermediate Content 1',
            content: 'Intermediate content text 1',
            complexity: 'intermediate',
          },
          {
            _id: 'mock-id-2',
            title: 'Intermediate Content 2',
            content: 'Intermediate content text 2',
            complexity: 'intermediate',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (otherService.getOthersByComplexity as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await otherController.getOthersByComplexity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(otherService.getOthersByComplexity).toHaveBeenCalledWith(
        complexityLevel,
        {
          limit: 10,
          page: 1,
          sortBy: undefined,
          sortOrder: undefined,
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should throw error for invalid complexity level', async () => {
      // Arrange
      mockRequest.params = { level: 'invalid-level' };

      // Act
      await otherController.getOthersByComplexity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Invalid complexity level',
        })
      );
      expect(otherService.getOthersByComplexity).not.toHaveBeenCalled();
    });

    it('should handle pagination and sorting options', async () => {
      // Arrange
      const complexityLevel = 'advanced';
      mockRequest.params = { level: complexityLevel };
      mockRequest.query = {
        limit: '20',
        page: '3',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      const mockResult = {
        results: [
          {
            _id: 'mock-id-1',
            title: 'Advanced Content 1',
            content: 'Advanced content text 1',
            complexity: 'advanced',
          },
        ],
        page: 3,
        limit: 20,
        totalPages: 5,
        totalResults: 89,
      };

      (otherService.getOthersByComplexity as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await otherController.getOthersByComplexity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(otherService.getOthersByComplexity).toHaveBeenCalledWith(
        complexityLevel,
        {
          limit: 20,
          page: 3,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { level: 'basic' };

      const error = new Error('Database error');
      (otherService.getOthersByComplexity as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await otherController.getOthersByComplexity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
