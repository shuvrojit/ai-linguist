// filepath: /home/shuv40/Desktop/startups/ai-linguist/src/__tests__/controllers/blog.controller.test.ts
import { Request, Response, NextFunction } from 'express';
import * as blogService from '../../services/blog.service';
import * as blogController from '../../controllers/blog.controller';

// Mock the blog service
jest.mock('../../services/blog.service');

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

describe('Blog Controller', () => {
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

  describe('createBlog', () => {
    it('should create a new blog entry and return 201 status', async () => {
      // Arrange
      const blogData = {
        title: 'Test Blog',
        author: 'Test Author',
        content: 'Test content for the blog post',
        tags: ['test', 'blog'],
      };

      mockRequest.body = blogData;

      const createdBlog = {
        _id: 'mock-blog-id',
        ...blogData,
        publication_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (blogService.createBlog as jest.Mock).mockResolvedValue(createdBlog);

      // Act
      await blogController.createBlog(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(blogService.createBlog).toHaveBeenCalledWith(blogData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdBlog);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (blogService.createBlog as jest.Mock).mockRejectedValue(error);

      // Act
      await blogController.createBlog(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getBlogById', () => {
    it('should get a blog by ID and return 200 status', async () => {
      // Arrange
      const blogId = 'mock-blog-id';
      const mockBlog = {
        _id: blogId,
        title: 'Test Blog',
        author: 'Test Author',
        content: 'Test content for the blog post',
        tags: ['test', 'blog'],
        publication_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: blogId };

      (blogService.getBlogById as jest.Mock).mockResolvedValue(mockBlog);

      // Act
      await blogController.getBlogById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(blogService.getBlogById).toHaveBeenCalledWith(blogId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBlog);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new Error('Blog not found');
      (blogService.getBlogById as jest.Mock).mockRejectedValue(error);

      // Act
      await blogController.getBlogById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateBlog', () => {
    it('should update a blog by ID and return 200 status', async () => {
      // Arrange
      const blogId = 'mock-blog-id';
      const updateData = {
        title: 'Updated Blog Title',
        content: 'Updated blog content',
      };

      const updatedBlog = {
        _id: blogId,
        title: 'Updated Blog Title',
        author: 'Test Author',
        content: 'Updated blog content',
        tags: ['test', 'blog'],
        publication_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: blogId };
      mockRequest.body = updateData;

      (blogService.updateBlogById as jest.Mock).mockResolvedValue(updatedBlog);

      // Act
      await blogController.updateBlog(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(blogService.updateBlogById).toHaveBeenCalledWith(
        blogId,
        updateData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedBlog);
    });

    it('should handle service errors', async () => {
      // Arrange
      const blogId = 'non-existent-id';
      mockRequest.params = { id: blogId };
      mockRequest.body = { title: 'Updated Title' };

      const error = new Error('Blog not found');
      (blogService.updateBlogById as jest.Mock).mockRejectedValue(error);

      // Act
      await blogController.updateBlog(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteBlog', () => {
    it('should delete a blog by ID and return 204 status', async () => {
      // Arrange
      const blogId = 'mock-blog-id';
      mockRequest.params = { id: blogId };

      (blogService.deleteBlogById as jest.Mock).mockResolvedValue(undefined);

      // Act
      await blogController.deleteBlog(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(blogService.deleteBlogById).toHaveBeenCalledWith(blogId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest.params = { id: 'non-existent-id' };
      const error = new Error('Blog not found');
      (blogService.deleteBlogById as jest.Mock).mockRejectedValue(error);

      // Act
      await blogController.deleteBlog(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getBlogs', () => {
    it('should get all blogs with default pagination and return 200 status', async () => {
      // Arrange
      const mockResult = {
        blogs: [
          {
            _id: 'mock-blog-1',
            title: 'First Blog',
            author: 'Author 1',
          },
          {
            _id: 'mock-blog-2',
            title: 'Second Blog',
            author: 'Author 2',
          },
        ],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      };

      (blogService.getBlogs as jest.Mock).mockResolvedValue(mockResult);

      // Act
      await blogController.getBlogs(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(blogService.getBlogs).toHaveBeenCalledWith(
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
        tag: 'technology',
        limit: '5',
        page: '2',
        sortBy: 'publication_date',
        sortOrder: 'desc',
      };

      const mockResult = {
        blogs: [
          {
            _id: 'mock-blog-3',
            title: 'Tech Blog',
            author: 'Tech Author',
            sentiment: 'positive',
            complexity: 'intermediate',
            tags: ['technology', 'innovation'],
          },
        ],
        page: 2,
        limit: 5,
        totalPages: 1,
        totalResults: 1,
      };

      (blogService.getBlogs as jest.Mock).mockResolvedValue(mockResult);

      // Act
      await blogController.getBlogs(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(blogService.getBlogs).toHaveBeenCalledWith(
        {
          sentiment: 'positive',
          complexity: 'intermediate',
          tags: { $in: ['technology'] },
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
      (blogService.getBlogs as jest.Mock).mockRejectedValue(error);

      // Act
      await blogController.getBlogs(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
