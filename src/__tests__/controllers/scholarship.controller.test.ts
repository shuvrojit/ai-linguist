// filepath: /home/shuv40/Desktop/startups/ai-linguist/src/__tests__/controllers/scholarship.controller.test.ts
import { Request, Response, NextFunction } from 'express';
import * as scholarshipService from '../../services/scholarship.service';
import * as scholarshipController from '../../controllers/scholarship.controller';

// Mock the scholarship service
jest.mock('../../services/scholarship.service');

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

describe('Scholarship Controller', () => {
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

  describe('createScholarship', () => {
    it('should create a new scholarship and return 201 status', async () => {
      // Arrange
      const scholarshipData = {
        title: 'Engineering Scholarship',
        organization: 'Tech Foundation',
        description: 'Scholarship for engineering students',
        amount: '$5,000',
        deadline: new Date('2024-06-30'),
        country: 'USA',
        degree_level: ['Bachelor', 'Master'],
        field_of_study: ['Engineering', 'Computer Science'],
        status: 'active',
      };

      mockRequest.body = scholarshipData;

      const createdScholarship = {
        _id: 'mock-id-123',
        ...scholarshipData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (scholarshipService.createScholarship as jest.Mock).mockResolvedValue(
        createdScholarship
      );

      // Act
      await scholarshipController.createScholarship(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(scholarshipService.createScholarship).toHaveBeenCalledWith(
        scholarshipData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdScholarship);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (scholarshipService.createScholarship as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await scholarshipController.createScholarship(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getScholarshipById', () => {
    it('should get a scholarship by ID and return 200 status', async () => {
      // Arrange
      const scholarshipId = 'mock-id-123';
      const mockScholarship = {
        _id: scholarshipId,
        title: 'Engineering Scholarship',
        organization: 'Tech Foundation',
        description: 'Scholarship for engineering students',
        amount: '$5,000',
        deadline: new Date('2024-06-30'),
        country: 'USA',
        degree_level: ['Bachelor', 'Master'],
        field_of_study: ['Engineering', 'Computer Science'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: scholarshipId };

      (scholarshipService.getScholarshipById as jest.Mock).mockResolvedValue(
        mockScholarship
      );

      // Act
      await scholarshipController.getScholarshipById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(scholarshipService.getScholarshipById).toHaveBeenCalledWith(
        scholarshipId
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockScholarship);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new Error('Scholarship not found');
      (scholarshipService.getScholarshipById as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await scholarshipController.getScholarshipById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateScholarship', () => {
    it('should update a scholarship by ID and return 200 status', async () => {
      // Arrange
      const scholarshipId = 'mock-id-123';
      const updateData = {
        amount: '$6,000',
        deadline: new Date('2024-07-15'),
        status: 'featured',
      };

      const updatedScholarship = {
        _id: scholarshipId,
        title: 'Engineering Scholarship',
        organization: 'Tech Foundation',
        description: 'Scholarship for engineering students',
        amount: '$6,000', // Updated
        deadline: new Date('2024-07-15'), // Updated
        country: 'USA',
        degree_level: ['Bachelor', 'Master'],
        field_of_study: ['Engineering', 'Computer Science'],
        status: 'featured', // Updated
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: scholarshipId };
      mockRequest.body = updateData;

      (scholarshipService.updateScholarshipById as jest.Mock).mockResolvedValue(
        updatedScholarship
      );

      // Act
      await scholarshipController.updateScholarship(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(scholarshipService.updateScholarshipById).toHaveBeenCalledWith(
        scholarshipId,
        updateData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedScholarship);
    });

    it('should handle service errors', async () => {
      // Arrange
      const scholarshipId = 'non-existent-id';
      mockRequest.params = { id: scholarshipId };
      mockRequest.body = { status: 'expired' };

      const error = new Error('Scholarship not found');
      (scholarshipService.updateScholarshipById as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await scholarshipController.updateScholarship(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteScholarship', () => {
    it('should delete a scholarship by ID and return 204 status', async () => {
      // Arrange
      const scholarshipId = 'mock-id-123';
      mockRequest.params = { id: scholarshipId };

      (scholarshipService.deleteScholarshipById as jest.Mock).mockResolvedValue(
        undefined
      );

      // Act
      await scholarshipController.deleteScholarship(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(scholarshipService.deleteScholarshipById).toHaveBeenCalledWith(
        scholarshipId
      );
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new Error('Scholarship not found');
      (scholarshipService.deleteScholarshipById as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await scholarshipController.deleteScholarship(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getScholarships', () => {
    it('should get all scholarships with default pagination and return 200 status', async () => {
      // Arrange
      const mockResult = {
        scholarships: [
          {
            _id: 'mock-id-1',
            title: 'Engineering Scholarship',
            organization: 'Tech Foundation',
            status: 'active',
          },
          {
            _id: 'mock-id-2',
            title: 'Medical Scholarship',
            organization: 'Health Foundation',
            status: 'active',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (scholarshipService.getScholarships as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await scholarshipController.getScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(scholarshipService.getScholarships).toHaveBeenCalledWith(
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
        status: 'active',
        country: 'USA',
        degree_level: 'Master',
        field_of_study: 'Engineering',
        limit: '5',
        page: '2',
        sortBy: 'deadline',
        sortOrder: 'asc',
      };

      const mockResult = {
        scholarships: [
          {
            _id: 'mock-id-3',
            title: 'Advanced Engineering Scholarship',
            organization: 'Engineering Foundation',
            status: 'active',
            country: 'USA',
            degree_level: ['Master', 'PhD'],
            field_of_study: ['Engineering'],
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 1,
        totalResults: 1,
      };

      (scholarshipService.getScholarships as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await scholarshipController.getScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(scholarshipService.getScholarships).toHaveBeenCalledWith(
        {
          status: 'active',
          country: 'USA',
          degree_level: { $in: ['Master'] },
          field_of_study: { $in: ['Engineering'] },
        },
        {
          limit: 5,
          page: 2,
          sortBy: 'deadline',
          sortOrder: 'asc',
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (scholarshipService.getScholarships as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await scholarshipController.getScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getActiveScholarships', () => {
    it('should get active scholarships with default pagination and return 200 status', async () => {
      // Arrange
      const mockResult = {
        scholarships: [
          {
            _id: 'mock-id-1',
            title: 'Engineering Scholarship',
            organization: 'Tech Foundation',
            status: 'active',
          },
          {
            _id: 'mock-id-2',
            title: 'Medical Scholarship',
            organization: 'Health Foundation',
            status: 'active',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (scholarshipService.getActiveScholarships as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await scholarshipController.getActiveScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(scholarshipService.getActiveScholarships).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        sortBy: undefined,
        sortOrder: undefined,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should use custom pagination options when provided', async () => {
      // Arrange
      mockRequest.query = {
        limit: '5',
        page: '2',
        sortBy: 'deadline',
        sortOrder: 'asc',
      };

      const mockResult = {
        scholarships: [
          {
            _id: 'mock-id-3',
            title: 'Arts Scholarship',
            organization: 'Arts Foundation',
            status: 'active',
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 2,
        totalResults: 6,
      };

      (scholarshipService.getActiveScholarships as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await scholarshipController.getActiveScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(scholarshipService.getActiveScholarships).toHaveBeenCalledWith({
        limit: 5,
        page: 2,
        sortBy: 'deadline',
        sortOrder: 'asc',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (scholarshipService.getActiveScholarships as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await scholarshipController.getActiveScholarships(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getScholarshipsByCountry', () => {
    it('should get scholarships by country with default pagination and return 200 status', async () => {
      // Arrange
      const country = 'USA';
      mockRequest.params = { country };

      const mockResult = {
        scholarships: [
          {
            _id: 'mock-id-1',
            title: 'Engineering Scholarship',
            organization: 'Tech Foundation',
            country: 'USA',
          },
          {
            _id: 'mock-id-2',
            title: 'Medical Scholarship',
            organization: 'Health Foundation',
            country: 'USA',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (
        scholarshipService.getScholarshipsByCountry as jest.Mock
      ).mockResolvedValue(mockResult);

      // Act
      await scholarshipController.getScholarshipsByCountry(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(scholarshipService.getScholarshipsByCountry).toHaveBeenCalledWith(
        country,
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
      const country = 'Canada';
      mockRequest.params = { country };
      mockRequest.query = {
        limit: '5',
        page: '2',
        sortBy: 'deadline',
        sortOrder: 'asc',
      };

      const mockResult = {
        scholarships: [
          {
            _id: 'mock-id-3',
            title: 'Canadian Scholarship',
            organization: 'Canadian Foundation',
            country: 'Canada',
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 1,
        totalResults: 1,
      };

      (
        scholarshipService.getScholarshipsByCountry as jest.Mock
      ).mockResolvedValue(mockResult);

      // Act
      await scholarshipController.getScholarshipsByCountry(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(scholarshipService.getScholarshipsByCountry).toHaveBeenCalledWith(
        country,
        {
          limit: 5,
          page: 2,
          sortBy: 'deadline',
          sortOrder: 'asc',
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { country: 'Invalid Country' };
      const error = new Error('Service error');
      (
        scholarshipService.getScholarshipsByCountry as jest.Mock
      ).mockRejectedValue(error);

      // Act
      await scholarshipController.getScholarshipsByCountry(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
