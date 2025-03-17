// filepath: /home/shuv40/Desktop/startups/ai-linguist/src/__tests__/controllers/jobDescription.controller.test.ts
import { Request, Response, NextFunction } from 'express';
import * as jobDescriptionService from '../../services/jobDescription.service';
import * as jobDescriptionController from '../../controllers/jobDescription.controller';

// Mock the jobDescription service
jest.mock('../../services/jobDescription.service');

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

describe('Job Description Controller', () => {
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

  describe('createJobDescription', () => {
    it('should create a new job description and return 201 status', async () => {
      // Arrange
      const jobData = {
        title: 'Software Engineer',
        company: 'Tech Company',
        job_type: 'Full-time',
        location: 'Remote',
        status: 'active',
        tech_stack: ['JavaScript', 'React', 'Node.js'],
        professional_experience: 3,
      };

      mockRequest.body = jobData;

      const createdJob = {
        _id: 'mock-id-123',
        ...jobData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (
        jobDescriptionService.createJobDescription as jest.Mock
      ).mockResolvedValue(createdJob);

      // Act
      await jobDescriptionController.createJobDescription(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(jobDescriptionService.createJobDescription).toHaveBeenCalledWith(
        jobData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdJob);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (
        jobDescriptionService.createJobDescription as jest.Mock
      ).mockRejectedValue(error);

      // Act
      await jobDescriptionController.createJobDescription(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getJobDescriptionById', () => {
    it('should get a job description by ID and return 200 status', async () => {
      // Arrange
      const jobId = 'mock-id-123';
      const mockJob = {
        _id: jobId,
        title: 'Software Engineer',
        company: 'Tech Company',
        job_type: 'Full-time',
        location: 'Remote',
        status: 'active',
        tech_stack: ['JavaScript', 'React', 'Node.js'],
        professional_experience: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: jobId };

      (
        jobDescriptionService.getJobDescriptionById as jest.Mock
      ).mockResolvedValue(mockJob);

      // Act
      await jobDescriptionController.getJobDescriptionById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(jobDescriptionService.getJobDescriptionById).toHaveBeenCalledWith(
        jobId
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockJob);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new Error('Job description not found');
      (
        jobDescriptionService.getJobDescriptionById as jest.Mock
      ).mockRejectedValue(error);

      // Act
      await jobDescriptionController.getJobDescriptionById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateJobDescription', () => {
    it('should update a job description by ID and return 200 status', async () => {
      // Arrange
      const jobId = 'mock-id-123';
      const updateData = {
        title: 'Senior Software Engineer',
        status: 'featured',
      };

      const updatedJob = {
        _id: jobId,
        title: 'Senior Software Engineer',
        company: 'Tech Company',
        job_type: 'Full-time',
        location: 'Remote',
        status: 'featured',
        tech_stack: ['JavaScript', 'React', 'Node.js'],
        professional_experience: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: jobId };
      mockRequest.body = updateData;

      (
        jobDescriptionService.updateJobDescriptionById as jest.Mock
      ).mockResolvedValue(updatedJob);

      // Act
      await jobDescriptionController.updateJobDescription(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(
        jobDescriptionService.updateJobDescriptionById
      ).toHaveBeenCalledWith(jobId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedJob);
    });

    it('should handle service errors', async () => {
      // Arrange
      const jobId = 'non-existent-id';
      mockRequest.params = { id: jobId };
      mockRequest.body = { title: 'Updated Title' };

      const error = new Error('Job description not found');
      (
        jobDescriptionService.updateJobDescriptionById as jest.Mock
      ).mockRejectedValue(error);

      // Act
      await jobDescriptionController.updateJobDescription(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteJobDescription', () => {
    it('should delete a job description by ID and return 204 status', async () => {
      // Arrange
      const jobId = 'mock-id-123';
      mockRequest.params = { id: jobId };

      (
        jobDescriptionService.deleteJobDescriptionById as jest.Mock
      ).mockResolvedValue(undefined);

      // Act
      await jobDescriptionController.deleteJobDescription(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(
        jobDescriptionService.deleteJobDescriptionById
      ).toHaveBeenCalledWith(jobId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new Error('Job description not found');
      (
        jobDescriptionService.deleteJobDescriptionById as jest.Mock
      ).mockRejectedValue(error);

      // Act
      await jobDescriptionController.deleteJobDescription(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getJobDescriptions', () => {
    it('should get all job descriptions with default pagination and return 200 status', async () => {
      // Arrange
      const mockResult = {
        jobs: [
          {
            _id: 'mock-id-1',
            title: 'Software Engineer',
            company: 'Company A',
          },
          {
            _id: 'mock-id-2',
            title: 'Product Manager',
            company: 'Company B',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (jobDescriptionService.getJobDescriptions as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await jobDescriptionController.getJobDescriptions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(jobDescriptionService.getJobDescriptions).toHaveBeenCalledWith(
        {}, // empty filter
        {
          limit: 10,
          page: 1,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should apply filters based on query parameters', async () => {
      // Arrange
      mockRequest.query = {
        status: 'active',
        job_type: 'Full-time',
        workplace: 'Remote',
        tech_stack: 'React',
        min_experience: '2',
        limit: '5',
        page: '2',
        sortBy: 'title',
        sortOrder: 'asc',
      };

      const mockResult = {
        jobs: [
          {
            _id: 'mock-id-3',
            title: 'Frontend Developer',
            company: 'Company C',
            status: 'active',
            job_type: 'Full-time',
            workplace: 'Remote',
            tech_stack: ['React', 'TypeScript'],
            professional_experience: 3,
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 1,
        totalResults: 1,
      };

      (jobDescriptionService.getJobDescriptions as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await jobDescriptionController.getJobDescriptions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(jobDescriptionService.getJobDescriptions).toHaveBeenCalledWith(
        {
          status: 'active',
          job_type: 'Full-time',
          workplace: 'Remote',
          tech_stack: { $in: ['React'] },
          professional_experience: { $gte: 2 },
        },
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
      const error = new Error('Database error');
      (jobDescriptionService.getJobDescriptions as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await jobDescriptionController.getJobDescriptions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getActiveJobs', () => {
    it('should get active jobs with default pagination and return 200 status', async () => {
      // Arrange
      const mockResult = {
        jobs: [
          {
            _id: 'mock-id-1',
            title: 'Software Engineer',
            company: 'Company A',
            status: 'active',
          },
          {
            _id: 'mock-id-2',
            title: 'Product Manager',
            company: 'Company B',
            status: 'active',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (jobDescriptionService.getActiveJobs as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await jobDescriptionController.getActiveJobs(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(jobDescriptionService.getActiveJobs).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should use custom pagination options when provided', async () => {
      // Arrange
      mockRequest.query = {
        limit: '5',
        page: '2',
        sortBy: 'title',
        sortOrder: 'asc',
      };

      const mockResult = {
        jobs: [
          {
            _id: 'mock-id-3',
            title: 'Frontend Developer',
            company: 'Company C',
            status: 'active',
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 2,
        totalResults: 6,
      };

      (jobDescriptionService.getActiveJobs as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await jobDescriptionController.getActiveJobs(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(jobDescriptionService.getActiveJobs).toHaveBeenCalledWith({
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
      const error = new Error('Database error');
      (jobDescriptionService.getActiveJobs as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await jobDescriptionController.getActiveJobs(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
