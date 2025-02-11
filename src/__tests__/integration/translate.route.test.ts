import request from 'supertest';
import app from '../../app';
import { featuresService } from '../../services';
import axios from 'axios';

jest.mock('../../services');
jest.mock('axios');

describe('Features Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Close any remaining connections
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
  });

  describe('POST /api/features/summary', () => {
    it('should generate summary successfully', async () => {
      const mockSummary = '<div>Test summary</div>';
      const mockHtmlData = '<html>Test data</html>';
      (axios.get as jest.Mock).mockResolvedValue({ data: mockHtmlData });
      (featuresService.getSummary as jest.Mock).mockResolvedValue(mockSummary);

      const response = await request(app).post('/api/features/summary').send({
        url: 'https://example.com',
      });

      expect(response.status).toBe(200);
      expect(response.body).toBe(mockSummary);
    });

    it('should handle errors when url is missing', async () => {
      const response = await request(app)
        .post('/api/features/summary')
        .send({});

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/features/extract', () => {
    it('should extract text successfully', async () => {
      const mockText = 'Extracted meaningful text';
      (featuresService.extractMeaningfullText as jest.Mock).mockResolvedValue(
        mockText
      );

      const response = await request(app)
        .post('/api/features/extract')
        .send({
          content: {
            text: '<div>Some HTML content</div>',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body).toBe(mockText);
    });
  });

  describe('POST /api/features/detailed-overview', () => {
    it('should generate detailed overview successfully', async () => {
      const mockOverview = '<div>Detailed overview</div>';
      const mockHtmlData = '<html>Test data</html>';
      (axios.get as jest.Mock).mockResolvedValue({ data: mockHtmlData });
      (featuresService.detailOverview as jest.Mock).mockResolvedValue(
        mockOverview
      );

      const response = await request(app)
        .post('/api/features/detailed-overview')
        .send({
          url: 'https://example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body).toBe(mockOverview);
    });
  });
});
