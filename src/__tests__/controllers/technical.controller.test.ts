// filepath: /home/shuv40/Desktop/startups/ai-linguist/src/__tests__/controllers/technical.controller.test.ts
import { Request, Response, NextFunction } from 'express';
import * as technicalService from '../../services/technical.service';
import * as technicalController from '../../controllers/technical.controller';
import ApiError from '../../utils/ApiError';

// Mock the technical service
jest.mock('../../services/technical.service');

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

describe('Technical Controller', () => {
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

  describe('createTechnical', () => {
    it('should create a new technical document and return 201 status', async () => {
      // Arrange
      const technicalData = {
        title: 'React Hooks Guide',
        author: 'Tech Author',
        technology: 'React',
        complexity_level: 'intermediate',
        content_type: 'tutorial',
        code_snippets: ['const [state, setState] = useState(initialState);'],
        tags: ['react', 'hooks', 'frontend'],
      };

      mockRequest.body = technicalData;

      const createdTechnical = {
        _id: 'mock-id-123',
        ...technicalData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (technicalService.createTechnical as jest.Mock).mockResolvedValue(
        createdTechnical
      );

      // Act
      await technicalController.createTechnical(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(technicalService.createTechnical).toHaveBeenCalledWith(
        technicalData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdTechnical);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (technicalService.createTechnical as jest.Mock).mockRejectedValue(error);

      // Act
      await technicalController.createTechnical(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTechnicalById', () => {
    it('should get a technical document by ID and return 200 status', async () => {
      // Arrange
      const technicalId = 'mock-id-123';
      const mockTechnical = {
        _id: technicalId,
        title: 'React Hooks Guide',
        author: 'Tech Author',
        technology: 'React',
        complexity_level: 'intermediate',
        content_type: 'tutorial',
        code_snippets: ['const [state, setState] = useState(initialState);'],
        tags: ['react', 'hooks', 'frontend'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: technicalId };

      (technicalService.getTechnicalById as jest.Mock).mockResolvedValue(
        mockTechnical
      );

      // Act
      await technicalController.getTechnicalById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(technicalService.getTechnicalById).toHaveBeenCalledWith(
        technicalId
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTechnical);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new Error('Technical document not found');
      (technicalService.getTechnicalById as jest.Mock).mockRejectedValue(error);

      // Act
      await technicalController.getTechnicalById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateTechnical', () => {
    it('should update a technical document by ID and return 200 status', async () => {
      // Arrange
      const technicalId = 'mock-id-123';
      const updateData = {
        title: 'Updated React Hooks Guide',
        complexity_level: 'advanced',
      };

      const updatedTechnical = {
        _id: technicalId,
        title: 'Updated React Hooks Guide',
        author: 'Tech Author',
        technology: 'React',
        complexity_level: 'advanced',
        content_type: 'tutorial',
        code_snippets: ['const [state, setState] = useState(initialState);'],
        tags: ['react', 'hooks', 'frontend'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: technicalId };
      mockRequest.body = updateData;

      (technicalService.updateTechnicalById as jest.Mock).mockResolvedValue(
        updatedTechnical
      );

      // Act
      await technicalController.updateTechnical(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(technicalService.updateTechnicalById).toHaveBeenCalledWith(
        technicalId,
        updateData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedTechnical);
    });

    it('should handle service errors', async () => {
      // Arrange
      const technicalId = 'non-existent-id';
      mockRequest.params = { id: technicalId };
      mockRequest.body = { title: 'Updated Title' };

      const error = new Error('Technical document not found');
      (technicalService.updateTechnicalById as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await technicalController.updateTechnical(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteTechnical', () => {
    it('should delete a technical document by ID and return 204 status', async () => {
      // Arrange
      const technicalId = 'mock-id-123';
      mockRequest.params = { id: technicalId };

      (technicalService.deleteTechnicalById as jest.Mock).mockResolvedValue(
        undefined
      );

      // Act
      await technicalController.deleteTechnical(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(technicalService.deleteTechnicalById).toHaveBeenCalledWith(
        technicalId
      );
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new Error('Technical document not found');
      (technicalService.deleteTechnicalById as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await technicalController.deleteTechnical(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTechnical', () => {
    it('should get all technical documents with default pagination and return 200 status', async () => {
      // Arrange
      const mockResult = {
        documents: [
          {
            _id: 'mock-id-1',
            title: 'React Hooks Guide',
            technology: 'React',
            complexity_level: 'intermediate',
          },
          {
            _id: 'mock-id-2',
            title: 'Node.js Best Practices',
            technology: 'Node.js',
            complexity_level: 'beginner',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (technicalService.getTechnical as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await technicalController.getTechnical(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(technicalService.getTechnical).toHaveBeenCalledWith(
        {}, // empty filter
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

    it('should apply filters based on query parameters', async () => {
      // Arrange
      mockRequest.query = {
        sentiment: 'positive',
        complexity: 'intermediate',
        tag: 'react',
        technology: 'JavaScript',
        content_type: 'tutorial',
        limit: '5',
        page: '2',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      const mockResult = {
        documents: [
          {
            _id: 'mock-id-3',
            title: 'Advanced JavaScript Patterns',
            technology: 'JavaScript',
            complexity_level: 'intermediate',
            content_type: 'tutorial',
            sentiment: 'positive',
            tags: ['react', 'javascript'],
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 1,
        totalResults: 1,
      };

      (technicalService.getTechnical as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await technicalController.getTechnical(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(technicalService.getTechnical).toHaveBeenCalledWith(
        {
          sentiment: 'positive',
          complexity_level: 'intermediate',
          tags: { $in: ['react'] },
          technology: 'JavaScript',
          content_type: 'tutorial',
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
      (technicalService.getTechnical as jest.Mock).mockRejectedValue(error);

      // Act
      await technicalController.getTechnical(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTechnicalByTechnology', () => {
    it('should get technical documents by technology with default pagination', async () => {
      // Arrange
      const technology = 'React';
      mockRequest.params = { technology };

      const mockResult = {
        documents: [
          {
            _id: 'mock-id-1',
            title: 'React Hooks Guide',
            technology: 'React',
            complexity_level: 'intermediate',
          },
          {
            _id: 'mock-id-2',
            title: 'React State Management',
            technology: 'React',
            complexity_level: 'advanced',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (
        technicalService.getTechnicalByTechnology as jest.Mock
      ).mockResolvedValue(mockResult);

      // Act
      await technicalController.getTechnicalByTechnology(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(technicalService.getTechnicalByTechnology).toHaveBeenCalledWith(
        technology,
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

    it('should use custom pagination and sorting options when provided', async () => {
      // Arrange
      const technology = 'JavaScript';
      mockRequest.params = { technology };
      mockRequest.query = {
        limit: '5',
        page: '2',
        sortBy: 'title',
        sortOrder: 'asc',
      };

      const mockResult = {
        documents: [
          {
            _id: 'mock-id-3',
            title: 'JavaScript Design Patterns',
            technology: 'JavaScript',
            complexity_level: 'advanced',
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 1,
        totalResults: 1,
      };

      (
        technicalService.getTechnicalByTechnology as jest.Mock
      ).mockResolvedValue(mockResult);

      // Act
      await technicalController.getTechnicalByTechnology(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(technicalService.getTechnicalByTechnology).toHaveBeenCalledWith(
        technology,
        {
          limit: 5,
          page: 2,
          sortBy: 'title',
          sortOrder: 'asc',
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { technology: 'InvalidTech' };
      const error = new Error('Service error');
      (
        technicalService.getTechnicalByTechnology as jest.Mock
      ).mockRejectedValue(error);

      // Act
      await technicalController.getTechnicalByTechnology(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTechnicalByComplexity', () => {
    it('should get technical documents by complexity level with default pagination', async () => {
      // Arrange
      const level = 'beginner';
      mockRequest.params = { level };

      const mockResult = {
        documents: [
          {
            _id: 'mock-id-1',
            title: 'Node.js for Beginners',
            technology: 'Node.js',
            complexity_level: 'beginner',
          },
          {
            _id: 'mock-id-2',
            title: 'React Basics',
            technology: 'React',
            complexity_level: 'beginner',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (
        technicalService.getTechnicalByComplexity as jest.Mock
      ).mockResolvedValue(mockResult);

      // Act
      await technicalController.getTechnicalByComplexity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(technicalService.getTechnicalByComplexity).toHaveBeenCalledWith(
        level,
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

    it('should use custom pagination and sorting options when provided', async () => {
      // Arrange
      const level = 'advanced';
      mockRequest.params = { level };
      mockRequest.query = {
        limit: '5',
        page: '2',
        sortBy: 'title',
        sortOrder: 'asc',
      };

      const mockResult = {
        documents: [
          {
            _id: 'mock-id-3',
            title: 'Advanced React Patterns',
            technology: 'React',
            complexity_level: 'advanced',
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 1,
        totalResults: 1,
      };

      (
        technicalService.getTechnicalByComplexity as jest.Mock
      ).mockResolvedValue(mockResult);

      // Act
      await technicalController.getTechnicalByComplexity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(technicalService.getTechnicalByComplexity).toHaveBeenCalledWith(
        level,
        {
          limit: 5,
          page: 2,
          sortBy: 'title',
          sortOrder: 'asc',
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should throw error for invalid complexity level', async () => {
      // Arrange
      mockRequest.params = { level: 'expert' }; // Invalid level

      // Act
      await technicalController.getTechnicalByComplexity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid complexity level');
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { level: 'intermediate' };
      const error = new Error('Service error');
      (
        technicalService.getTechnicalByComplexity as jest.Mock
      ).mockRejectedValue(error);

      // Act
      await technicalController.getTechnicalByComplexity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
