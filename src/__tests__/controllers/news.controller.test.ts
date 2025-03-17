import { Request, Response, NextFunction } from 'express';
import * as newsService from '../../services/news.service';
import * as newsController from '../../controllers/news.controller';

// Mock the news service
jest.mock('../../services/news.service');

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

describe('News Controller', () => {
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

  describe('createNews', () => {
    it('should create a new news article and return 201 status', async () => {
      // Arrange
      const newsData = {
        title: 'Breaking News',
        author: 'News Reporter',
        content: 'This is breaking news content',
        category: 'Politics',
        is_breaking: true,
        region: 'Global',
        tags: ['breaking', 'politics'],
      };

      mockRequest.body = newsData;

      const createdNews = {
        _id: 'mock-id-123',
        ...newsData,
        publication_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (newsService.createNews as jest.Mock).mockResolvedValue(createdNews);

      // Act
      await newsController.createNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(newsService.createNews).toHaveBeenCalledWith(newsData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdNews);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (newsService.createNews as jest.Mock).mockRejectedValue(error);

      // Act
      await newsController.createNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getNewsById', () => {
    it('should get a news article by ID and return 200 status', async () => {
      // Arrange
      const newsId = 'mock-id-123';
      const mockNews = {
        _id: newsId,
        title: 'Breaking News',
        author: 'News Reporter',
        content: 'This is breaking news content',
        category: 'Politics',
        is_breaking: true,
        region: 'Global',
        publication_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: newsId };

      (newsService.getNewsById as jest.Mock).mockResolvedValue(mockNews);

      // Act
      await newsController.getNewsById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(newsService.getNewsById).toHaveBeenCalledWith(newsId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNews);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new Error('News article not found');
      (newsService.getNewsById as jest.Mock).mockRejectedValue(error);

      // Act
      await newsController.getNewsById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateNews', () => {
    it('should update a news article by ID and return 200 status', async () => {
      // Arrange
      const newsId = 'mock-id-123';
      const updateData = {
        title: 'Updated News Title',
        is_breaking: false,
      };

      const updatedNews = {
        _id: newsId,
        title: 'Updated News Title',
        author: 'News Reporter',
        content: 'This is breaking news content',
        category: 'Politics',
        is_breaking: false,
        region: 'Global',
        publication_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: newsId };
      mockRequest.body = updateData;

      (newsService.updateNewsById as jest.Mock).mockResolvedValue(updatedNews);

      // Act
      await newsController.updateNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(newsService.updateNewsById).toHaveBeenCalledWith(
        newsId,
        updateData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedNews);
    });

    it('should handle service errors', async () => {
      // Arrange
      const newsId = 'non-existent-id';
      mockRequest.params = { id: newsId };
      mockRequest.body = { title: 'Updated Title' };

      const error = new Error('News article not found');
      (newsService.updateNewsById as jest.Mock).mockRejectedValue(error);

      // Act
      await newsController.updateNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteNews', () => {
    it('should delete a news article by ID and return 204 status', async () => {
      // Arrange
      const newsId = 'mock-id-123';
      mockRequest.params = { id: newsId };

      (newsService.deleteNewsById as jest.Mock).mockResolvedValue(undefined);

      // Act
      await newsController.deleteNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(newsService.deleteNewsById).toHaveBeenCalledWith(newsId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new Error('News article not found');
      (newsService.deleteNewsById as jest.Mock).mockRejectedValue(error);

      // Act
      await newsController.deleteNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getNews', () => {
    it('should get all news articles with default pagination and return 200 status', async () => {
      // Arrange
      const mockResult = {
        articles: [
          {
            _id: 'mock-id-1',
            title: 'First News Article',
            category: 'Tech',
          },
          {
            _id: 'mock-id-2',
            title: 'Second News Article',
            category: 'Sports',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (newsService.getNews as jest.Mock).mockResolvedValue(mockResult);

      // Act
      await newsController.getNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(newsService.getNews).toHaveBeenCalledWith(
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
        sentiment: 'neutral',
        complexity: 'basic',
        tag: 'tech',
        category: 'Technology',
        region: 'North America',
        limit: '5',
        page: '2',
        sortBy: 'publication_date',
        sortOrder: 'desc',
      };

      const mockResult = {
        articles: [
          {
            _id: 'mock-id-3',
            title: 'Tech News',
            category: 'Technology',
            region: 'North America',
            sentiment: 'neutral',
            complexity: 'basic',
            tags: ['tech', 'innovation'],
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 1,
        totalResults: 1,
      };

      (newsService.getNews as jest.Mock).mockResolvedValue(mockResult);

      // Act
      await newsController.getNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(newsService.getNews).toHaveBeenCalledWith(
        {
          sentiment: 'neutral',
          complexity: 'basic',
          tags: { $in: ['tech'] },
          category: 'Technology',
          region: 'North America',
        },
        {
          limit: 5,
          page: 2,
          sortBy: 'publication_date',
          sortOrder: 'desc',
        }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (newsService.getNews as jest.Mock).mockRejectedValue(error);

      // Act
      await newsController.getNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getBreakingNews', () => {
    it('should get breaking news with default limit and return 200 status', async () => {
      // Arrange
      const mockNews = [
        {
          _id: 'mock-id-1',
          title: 'Breaking News 1',
          is_breaking: true,
        },
        {
          _id: 'mock-id-2',
          title: 'Breaking News 2',
          is_breaking: true,
        },
      ];

      (newsService.getBreakingNews as jest.Mock).mockResolvedValue(mockNews);

      // Act
      await newsController.getBreakingNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(newsService.getBreakingNews).toHaveBeenCalledWith(5); // Default limit
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ news: mockNews });
    });

    it('should use custom limit when provided', async () => {
      // Arrange
      mockRequest.query = { limit: '10' };

      const mockNews = [
        { _id: 'mock-id-1', title: 'Breaking News 1', is_breaking: true },
        { _id: 'mock-id-2', title: 'Breaking News 2', is_breaking: true },
        { _id: 'mock-id-3', title: 'Breaking News 3', is_breaking: true },
      ];

      (newsService.getBreakingNews as jest.Mock).mockResolvedValue(mockNews);

      // Act
      await newsController.getBreakingNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(newsService.getBreakingNews).toHaveBeenCalledWith(10);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ news: mockNews });
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (newsService.getBreakingNews as jest.Mock).mockRejectedValue(error);

      // Act
      await newsController.getBreakingNews(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getNewsByCategory', () => {
    it('should get news by category with default pagination', async () => {
      // Arrange
      const category = 'Technology';
      mockRequest.params = { category };

      const mockResult = {
        articles: [
          {
            _id: 'mock-id-1',
            title: 'Tech News 1',
            category: 'Technology',
          },
          {
            _id: 'mock-id-2',
            title: 'Tech News 2',
            category: 'Technology',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (newsService.getNewsByCategory as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await newsController.getNewsByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(newsService.getNewsByCategory).toHaveBeenCalledWith(category, {
        limit: 10,
        page: 1,
        sortBy: undefined,
        sortOrder: undefined,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should use custom pagination and sorting options when provided', async () => {
      // Arrange
      const category = 'Sports';
      mockRequest.params = { category };
      mockRequest.query = {
        limit: '5',
        page: '2',
        sortBy: 'title',
        sortOrder: 'asc',
      };

      const mockResult = {
        articles: [
          {
            _id: 'mock-id-3',
            title: 'Sports News',
            category: 'Sports',
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 1,
        totalResults: 1,
      };

      (newsService.getNewsByCategory as jest.Mock).mockResolvedValue(
        mockResult
      );

      // Act
      await newsController.getNewsByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(newsService.getNewsByCategory).toHaveBeenCalledWith(category, {
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
      mockRequest.params = { category: 'InvalidCategory' };
      const error = new Error('Service error');
      (newsService.getNewsByCategory as jest.Mock).mockRejectedValue(error);

      // Act
      await newsController.getNewsByCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
