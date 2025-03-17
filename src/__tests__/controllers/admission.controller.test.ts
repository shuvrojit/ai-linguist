import { Request, Response, NextFunction } from 'express';
import * as admissionService from '../../services/admission.service';
import * as admissionController from '../../controllers/admission.controller';
import ApiError from '../../utils/ApiError';

// Mock the admission service
jest.mock('../../services/admission.service');

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

describe('Admission Controller', () => {
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

  describe('createAdmission', () => {
    it('should create a new admission and return 201 status', async () => {
      // Arrange
      const admissionData = {
        university: 'Test University',
        programTitle: 'Computer Science',
        degree: 'Masters',
        duration: '2 years',
        languageOfInstruction: 'English',
        admissionRequirements: ['Bachelor degree', 'GPA 3.0'],
        documentsRequired: ['Transcript', 'CV'],
        applicationDeadline: new Date('2025-07-15'),
        applicationURL: 'https://example.com',
        tuitionFee: '$10,000 per year',
      };

      mockRequest.body = admissionData;

      const createdAdmission = {
        _id: 'mock-id-123',
        ...admissionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (admissionService.createAdmission as jest.Mock).mockResolvedValue(
        createdAdmission
      );

      // Act
      await admissionController.createAdmission(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.createAdmission).toHaveBeenCalledWith(
        admissionData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdAdmission);
    });

    it('should handle errors and pass to next middleware', async () => {
      // Arrange
      const error = new Error('Database error');
      (admissionService.createAdmission as jest.Mock).mockRejectedValue(error);

      // Act
      await admissionController.createAdmission(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAdmissionById', () => {
    it('should get an admission by ID and return 200 status', async () => {
      // Arrange
      const admissionId = 'mock-id-123';
      const mockAdmission = {
        _id: admissionId,
        university: 'Test University',
        programTitle: 'Computer Science',
        degree: 'Masters',
        duration: '2 years',
        languageOfInstruction: 'English',
        admissionRequirements: ['Bachelor degree', 'GPA 3.0'],
        documentsRequired: ['Transcript', 'CV'],
        applicationDeadline: new Date('2025-07-15'),
        applicationURL: 'https://example.com',
        tuitionFee: '$10,000 per year',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: admissionId };

      (admissionService.getAdmissionById as jest.Mock).mockResolvedValue(
        mockAdmission
      );

      // Act
      await admissionController.getAdmissionById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.getAdmissionById).toHaveBeenCalledWith(
        admissionId
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAdmission);
    });

    it('should handle not found error', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new ApiError(404, 'Admission not found');
      (admissionService.getAdmissionById as jest.Mock).mockRejectedValue(error);

      // Act
      await admissionController.getAdmissionById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.getAdmissionById).toHaveBeenCalledWith(
        'non-existent-id'
      );
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateAdmission', () => {
    it('should update an admission by ID and return 200 status', async () => {
      // Arrange
      const admissionId = 'mock-id-123';
      const updateData = {
        tuitionFee: 'Updated: $12,000 per year',
        applicationDeadline: new Date('2025-08-15'),
      };

      const updatedAdmission = {
        _id: admissionId,
        university: 'Test University',
        programTitle: 'Computer Science',
        degree: 'Masters',
        duration: '2 years',
        languageOfInstruction: 'English',
        admissionRequirements: ['Bachelor degree', 'GPA 3.0'],
        documentsRequired: ['Transcript', 'CV'],
        applicationDeadline: new Date('2025-08-15'), // Updated
        applicationURL: 'https://example.com',
        tuitionFee: 'Updated: $12,000 per year', // Updated
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: admissionId };
      mockRequest.body = updateData;

      (admissionService.updateAdmissionById as jest.Mock).mockResolvedValue(
        updatedAdmission
      );

      // Act
      await admissionController.updateAdmission(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.updateAdmissionById).toHaveBeenCalledWith(
        admissionId,
        updateData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedAdmission);
    });

    it('should handle not found error when updating', async () => {
      // Arrange
      const admissionId = 'non-existent-id';
      mockRequest.params = { id: admissionId };
      mockRequest.body = { tuitionFee: 'Updated fee' };

      const error = new ApiError(404, 'Admission not found');
      (admissionService.updateAdmissionById as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await admissionController.updateAdmission(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.updateAdmissionById).toHaveBeenCalledWith(
        admissionId,
        { tuitionFee: 'Updated fee' }
      );
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteAdmission', () => {
    it('should delete an admission by ID and return 204 status', async () => {
      // Arrange
      const admissionId = 'mock-id-123';
      mockRequest.params = { id: admissionId };

      const deletedAdmission = {
        _id: admissionId,
        university: 'Test University',
        // other fields omitted for brevity
      };

      (admissionService.deleteAdmissionById as jest.Mock).mockResolvedValue(
        deletedAdmission
      );

      // Act
      await admissionController.deleteAdmission(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.deleteAdmissionById).toHaveBeenCalledWith(
        admissionId
      );
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle not found error when deleting', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new ApiError(404, 'Admission not found');
      (admissionService.deleteAdmissionById as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await admissionController.deleteAdmission(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.deleteAdmissionById).toHaveBeenCalledWith(
        'non-existent-id'
      );
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAdmissions', () => {
    it('should get all admissions with default pagination and return 200 status', async () => {
      // Arrange
      const mockResult = {
        admissions: [
          {
            _id: 'mock-id-1',
            university: 'University A',
            programTitle: 'Computer Science',
            // other fields omitted for brevity
          },
          {
            _id: 'mock-id-2',
            university: 'University B',
            programTitle: 'Data Science',
            // other fields omitted for brevity
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (admissionService.getAdmissions as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await admissionController.getAdmissions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.getAdmissions).toHaveBeenCalledWith(
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
        university: 'Harvard',
        degree: 'Masters',
        languageOfInstruction: 'English',
        limit: '5',
        page: '2',
        sortBy: 'applicationDeadline',
        sortOrder: 'asc',
      };

      const mockResult = {
        admissions: [
          {
            _id: 'mock-id-3',
            university: 'Harvard',
            degree: 'Masters',
            languageOfInstruction: 'English',
            // other fields omitted for brevity
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 1,
        totalResults: 1,
      };

      (admissionService.getAdmissions as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await admissionController.getAdmissions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.getAdmissions).toHaveBeenCalledWith(
        {
          university: 'Harvard',
          degree: 'Masters',
          languageOfInstruction: 'English',
        },
        {
          limit: 5,
          page: 2,
          sortBy: 'applicationDeadline',
          sortOrder: 'asc',
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (admissionService.getAdmissions as jest.Mock).mockRejectedValue(error);

      // Act
      await admissionController.getAdmissions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAdmissionsByUniversity', () => {
    it('should get admissions by university name and return 200 status', async () => {
      // Arrange
      const universityName = 'Harvard University';
      mockRequest.params = { university: universityName };
      mockRequest.query = {
        limit: '20',
        page: '1',
        sortBy: 'programTitle',
        sortOrder: 'asc',
      };

      const mockResult = {
        admissions: [
          {
            _id: 'mock-id-1',
            university: universityName,
            programTitle: 'Artificial Intelligence',
            // other fields omitted for brevity
          },
          {
            _id: 'mock-id-2',
            university: universityName,
            programTitle: 'Computer Science',
            // other fields omitted for brevity
          },
        ],
        page: 1,
        limit: 20,
        totalPages: 1,
        totalResults: 2,
      };

      (
        admissionService.getAdmissionsByUniversity as jest.Mock
      ).mockResolvedValue(mockResult);

      // Act
      await admissionController.getAdmissionsByUniversity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.getAdmissionsByUniversity).toHaveBeenCalledWith(
        universityName,
        {
          limit: 20,
          page: 1,
          sortBy: 'programTitle',
          sortOrder: 'asc',
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should use default pagination options when not provided', async () => {
      // Arrange
      const universityName = 'MIT';
      mockRequest.params = { university: universityName };

      const mockResult = {
        admissions: [],
        page: 1,
        limit: 10,
        totalPages: 0,
        totalResults: 0,
      };

      (
        admissionService.getAdmissionsByUniversity as jest.Mock
      ).mockResolvedValue(mockResult);

      // Act
      await admissionController.getAdmissionsByUniversity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.getAdmissionsByUniversity).toHaveBeenCalledWith(
        universityName,
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

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { university: 'Invalid University' };
      const error = new Error('Service error');
      (
        admissionService.getAdmissionsByUniversity as jest.Mock
      ).mockRejectedValue(error);

      // Act
      await admissionController.getAdmissionsByUniversity(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAdmissionsByDegree', () => {
    it('should get admissions by degree type and return 200 status', async () => {
      // Arrange
      const degreeType = 'PhD';
      mockRequest.params = { degree: degreeType };
      mockRequest.query = {
        limit: '15',
        page: '1',
        sortBy: 'university',
        sortOrder: 'asc',
      };

      const mockResult = {
        admissions: [
          {
            _id: 'mock-id-1',
            university: 'Cambridge University',
            programTitle: 'Computer Science',
            degree: degreeType,
            // other fields omitted for brevity
          },
          {
            _id: 'mock-id-2',
            university: 'Oxford University',
            programTitle: 'Artificial Intelligence',
            degree: degreeType,
            // other fields omitted for brevity
          },
        ],
        page: 1,
        limit: 15,
        totalPages: 1,
        totalResults: 2,
      };

      (admissionService.getAdmissionsByDegree as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await admissionController.getAdmissionsByDegree(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.getAdmissionsByDegree).toHaveBeenCalledWith(
        degreeType,
        {
          limit: 15,
          page: 1,
          sortBy: 'university',
          sortOrder: 'asc',
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should use default pagination options when not provided', async () => {
      // Arrange
      const degreeType = 'Masters';
      mockRequest.params = { degree: degreeType };

      const mockResult = {
        admissions: [
          {
            _id: 'mock-id-3',
            university: 'Stanford University',
            degree: degreeType,
            // other fields omitted for brevity
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      };

      (admissionService.getAdmissionsByDegree as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await admissionController.getAdmissionsByDegree(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(admissionService.getAdmissionsByDegree).toHaveBeenCalledWith(
        degreeType,
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

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { degree: 'Invalid Degree' };
      const error = new Error('Service error');
      (admissionService.getAdmissionsByDegree as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await admissionController.getAdmissionsByDegree(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getUpcomingDeadlineAdmissions', () => {
    it('should get admissions with upcoming deadlines and return 200 status', async () => {
      // Arrange
      mockRequest.query = {
        limit: '5',
        page: '1',
        sortBy: 'applicationDeadline',
        sortOrder: 'asc',
      };

      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const mockResult = {
        admissions: [
          {
            _id: 'mock-id-1',
            university: 'University A',
            programTitle: 'Data Science',
            applicationDeadline: nextWeek,
            // other fields omitted for brevity
          },
          {
            _id: 'mock-id-2',
            university: 'University B',
            programTitle: 'Computer Science',
            applicationDeadline: new Date(nextWeek.getTime() + 86400000), // one day after nextWeek
            // other fields omitted for brevity
          },
        ],
        page: 1,
        limit: 5,
        totalPages: 1,
        totalResults: 2,
      };

      (
        admissionService.getUpcomingDeadlineAdmissions as jest.Mock
      ).mockResolvedValue(mockResult);

      // Act
      await admissionController.getUpcomingDeadlineAdmissions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(
        admissionService.getUpcomingDeadlineAdmissions
      ).toHaveBeenCalledWith({
        limit: 5,
        page: 1,
        sortBy: 'applicationDeadline',
        sortOrder: 'asc',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should use default options with applicationDeadline as sortBy when not provided', async () => {
      // Arrange
      const mockResult = {
        admissions: [
          {
            _id: 'mock-id-3',
            university: 'University C',
            // other fields omitted for brevity
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      };

      (
        admissionService.getUpcomingDeadlineAdmissions as jest.Mock
      ).mockResolvedValue(mockResult);

      // Act
      await admissionController.getUpcomingDeadlineAdmissions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(
        admissionService.getUpcomingDeadlineAdmissions
      ).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        sortBy: 'applicationDeadline',
        sortOrder: 'asc',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Service error');
      (
        admissionService.getUpcomingDeadlineAdmissions as jest.Mock
      ).mockRejectedValue(error);

      // Act
      await admissionController.getUpcomingDeadlineAdmissions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
