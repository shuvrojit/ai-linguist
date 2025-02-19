import request from 'supertest';
import app from '../../app';
import { featuresService } from '../../services';

jest.mock('../../services');

describe('Features Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close any remaining connections
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
  });

  describe('POST /api/features/analyze', () => {
    const mockAnalyzeResponse = {
      category: 'blog',
      type: 'technical article',
      tags: ['programming', 'tutorial'],
      metadata: {
        title: 'Understanding TypeScript',
        author: 'John Doe',
        date: '2024-02-20',
      },
      details: {
        summary: 'A comprehensive guide to TypeScript',
        key_points: ['Type safety', 'Interfaces', 'Generics'],
        topics_covered: ['TypeScript', 'JavaScript'],
        target_audience: 'Developers',
      },
      sentiment: 'positive',
      complexity: 'intermediate',
      readability_score: 85,
    };

    it('should analyze content successfully', async () => {
      (featuresService.analyzeContent as jest.Mock).mockResolvedValue(
        mockAnalyzeResponse
      );

      const response = await request(app)
        .post('/api/features/analyze')
        .send({
          content: {
            text: 'Sample content to analyze',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAnalyzeResponse);
      expect(featuresService.analyzeContent).toHaveBeenCalledWith(
        'Sample content to analyze'
      );
    });

    it('should handle missing content gracefully', async () => {
      const response = await request(app)
        .post('/api/features/analyze')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Text content is required',
      });
    });

    it('should handle service errors', async () => {
      (featuresService.analyzeContent as jest.Mock).mockRejectedValue(
        new Error('Analysis failed')
      );

      const response = await request(app)
        .post('/api/features/analyze')
        .send({
          content: {
            text: 'Sample content',
          },
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: 'Internal server error',
      });
    });
  });
});
