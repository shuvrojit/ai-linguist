import { featuresService } from '../../services';
import AIRequest from '../../utils/aiRequest';
import logger from '../../config/logger';
import { jobDescriptionService } from '../../services';

jest.mock('../../utils/aiRequest');
jest.mock('../../config/logger');
jest.mock('../../services/jobDescription.service');

describe('Features Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    // Ensure all pending promises are resolved
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
  });

  describe('getSummary', () => {
    it('should generate summary correctly', async () => {
      const mockSummaryHtml = '<div>Summary content</div>';
      (AIRequest as jest.Mock).mockResolvedValue(mockSummaryHtml);

      const result = await featuresService.getSummary(
        'Some content to summarize'
      );
      expect(result).toBe(mockSummaryHtml);
      expect(AIRequest).toHaveBeenCalledWith(
        'gpt-4o-mini',
        expect.any(String),
        expect.any(String)
      );
    });

    it('should handle summary generation errors', async () => {
      (AIRequest as jest.Mock).mockRejectedValue(new Error('AI service error'));

      await expect(featuresService.getSummary('Some content')).rejects.toThrow(
        'AI service error'
      );
    });
  });

  describe('extractMeaningfullText', () => {
    it('should extract text correctly', async () => {
      const mockExtractedText = 'Meaningful text';
      (AIRequest as jest.Mock).mockResolvedValue(mockExtractedText);

      const result = await featuresService.extractMeaningfullText(
        '<div>Some HTML</div>'
      );
      expect(result).toBe(mockExtractedText);
      expect(AIRequest).toHaveBeenCalledWith(
        'gpt-4o-mini-2024-07-18',
        expect.any(String),
        expect.any(String)
      );
    });
  });

  describe('detailOverview', () => {
    it('should generate detailed overview correctly', async () => {
      const mockOverviewHtml = '<div>Detailed overview content</div>';
      (AIRequest as jest.Mock).mockResolvedValue(mockOverviewHtml);

      const result = await featuresService.detailOverview(
        'Some content for overview'
      );
      expect(result).toBe(mockOverviewHtml);
      expect(AIRequest).toHaveBeenCalledWith(
        'gpt-4o-mini-2024-07-18',
        expect.any(String),
        expect.any(String)
      );
    });
  });

  describe('extractMeaning', () => {
    const mockJobResponse = {
      category: 'job',
      type: 'job posting',
      tags: ['software', 'engineering'],
      metadata: {
        title: 'Software Engineer',
        date: '2024-03-01',
      },
      details: {
        company_info: {
          name: 'Tech Corp',
          location: 'Remote',
          culture: 'Startup',
        },
        position_details: {
          title: 'Software Engineer',
          type: 'full-time',
          workplace: 'remote',
          experience_required: '3',
        },
        tech_stack: ['React'],
        requirements: ['React experience'],
        responsibilities: ['Build features'],
      },
    };

    const mockBlogResponse = {
      category: 'blog',
      type: 'technical article',
      tags: ['programming', 'tutorial'],
      metadata: {
        title: 'React Best Practices',
        author: 'John Doe',
        date: '2024-03-01',
      },
      details: {
        summary: 'Article about React',
        key_points: ['State management', 'Components'],
        topics_covered: ['React', 'JavaScript'],
        target_audience: 'Developers',
      },
      sentiment: 'positive',
      complexity: 'intermediate',
      readability_score: 85,
    };

    it('should extract job posting content correctly', async () => {
      (AIRequest as jest.Mock).mockResolvedValue(
        JSON.stringify(mockJobResponse)
      );
      (jobDescriptionService.createJob as jest.Mock).mockResolvedValue({
        _id: 'job123',
      });

      const result = await featuresService.analyzeContent('sample job text');

      expect(AIRequest).toHaveBeenCalledWith(
        'gpt-4',
        expect.any(String),
        expect.stringContaining('sample job text')
      );
      expect(result.category).toBe('job');
      expect(result.jobId).toBe('job123');
    });

    it('should extract blog content correctly', async () => {
      (AIRequest as jest.Mock).mockResolvedValue(
        JSON.stringify(mockBlogResponse)
      );

      const result = await featuresService.analyzeContent('sample blog text');

      expect(AIRequest).toHaveBeenCalledWith(
        'gpt-4',
        expect.any(String),
        expect.stringContaining('sample blog text')
      );
      expect(result.category).toBe('blog');
      expect(result.jobId).toBeUndefined();
    });

    it('should handle AI service errors', async () => {
      (AIRequest as jest.Mock).mockRejectedValue(new Error('AI service error'));

      await expect(featuresService.analyzeContent('test')).rejects.toThrow(
        'AI service error'
      );
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle invalid JSON response', async () => {
      (AIRequest as jest.Mock).mockResolvedValue('invalid json');

      await expect(featuresService.analyzeContent('test')).rejects.toThrow(
        'Invalid response format'
      );
    });

    it('should handle job saving errors gracefully', async () => {
      (AIRequest as jest.Mock).mockResolvedValue(
        JSON.stringify(mockJobResponse)
      );
      (jobDescriptionService.createJob as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const result = await featuresService.analyzeContent('sample job text');

      expect(result.category).toBe('job');
      expect(result.jobId).toBeUndefined();
      expect(logger.warn).toHaveBeenCalled();
    });
  });
});
