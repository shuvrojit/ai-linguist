import {
  analyzeContent,
  summarizeContent,
  analyzeJob,
} from '../../services/features.service';
import AIRequest from '../../utils/aiRequest';
import ApiError from '../../utils/ApiError';

jest.mock('../../utils/aiRequest');

describe('Feature Service', () => {
  describe('summarizeContent', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should exist as a function', () => {
      expect(typeof summarizeContent).toBe('function');
    });

    it('should call AIRequest with correct parameters', async () => {
      const mockText = 'Test text to summarize';
      const mockResponse = {
        summary: 'Summarized text',
        key_points: ['Point 1'],
        word_count: { original: 100, summary: 25 },
      };
      (AIRequest as jest.Mock).mockResolvedValue(JSON.stringify(mockResponse));

      const result = await summarizeContent(mockText);

      expect(AIRequest).toHaveBeenCalledWith(
        'gpt-4o',
        expect.any(String),
        mockText
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError when AI service returns no response', async () => {
      (AIRequest as jest.Mock).mockResolvedValue(null);

      await expect(summarizeContent('test')).rejects.toThrow(
        new ApiError(500, 'No response from AI service')
      );
    });

    it('should throw ApiError when response is not valid JSON', async () => {
      (AIRequest as jest.Mock).mockResolvedValue('Invalid JSON');

      await expect(summarizeContent('test')).rejects.toThrow(
        new ApiError(500, 'Error processing AI service response')
      );
    });
  });

  describe('analyzeContent', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should exist as a function', () => {
      expect(typeof analyzeContent).toBe('function');
    });

    it('should call AIRequest with correct parameters', async () => {
      const mockText = 'Test text to analyze';
      const mockResponse = {
        category: 'job',
        type: 'technical',
        details: {
          job_position: 'Developer',
          company: 'Test Corp',
        },
      };
      (AIRequest as jest.Mock).mockResolvedValue(JSON.stringify(mockResponse));

      const result = await analyzeContent(mockText);

      expect(AIRequest).toHaveBeenCalledWith(
        'gpt-4o',
        expect.any(String),
        mockText
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle markdown code blocks in response', async () => {
      const mockResponse = `
\`\`\`json
{
  "category": "blog",
  "type": "technical",
  "details": {
    "title": "Test Blog",
    "content": "Test content"
  }
}
\`\`\``;
      (AIRequest as jest.Mock).mockResolvedValue(mockResponse);

      const result = await analyzeContent('test');

      expect(result).toEqual({
        category: 'blog',
        type: 'technical',
        details: {
          title: 'Test Blog',
          content: 'Test content',
        },
      });
    });

    it('should throw ApiError when AI service returns no response', async () => {
      (AIRequest as jest.Mock).mockResolvedValue(null);

      await expect(analyzeContent('test')).rejects.toThrow(
        new ApiError(500, 'No response from AI service')
      );
    });

    it('should throw ApiError when all JSON parsing attempts fail', async () => {
      (AIRequest as jest.Mock).mockResolvedValue(
        'Invalid JSON without code blocks'
      );

      await expect(analyzeContent('test')).rejects.toThrow(
        new ApiError(
          500,
          'Unable to extract valid JSON from AI service response'
        )
      );
    });
  });

  describe('analyzeJob', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should exist as a function', () => {
      expect(typeof analyzeJob).toBe('function');
    });

    it('should call AIRequest with correct parameters', async () => {
      const mockText = 'Test job description';
      const mockResponse = {
        company_title: 'Test Corp',
        job_position: 'Software Engineer',
        job_location: 'Remote',
        job_type: 'full time',
        tech_stack: ['JavaScript', 'React', 'Node.js'],
      };
      (AIRequest as jest.Mock).mockResolvedValue(JSON.stringify(mockResponse));

      const result = await analyzeJob(mockText);

      expect(AIRequest).toHaveBeenCalledWith(
        'gpt-4o',
        expect.any(String),
        mockText
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle markdown code blocks in response', async () => {
      const mockResponse = `
\`\`\`json
{
  "company_title": "Tech Company",
  "job_position": "Full Stack Developer",
  "job_location": "New York",
  "job_type": "full time",
  "workplace": "hybrid",
  "tech_stack": ["React", "Node.js", "MongoDB"]
}
\`\`\``;
      (AIRequest as jest.Mock).mockResolvedValue(mockResponse);

      const result = await analyzeJob('test job posting');

      expect(result).toEqual({
        company_title: 'Tech Company',
        job_position: 'Full Stack Developer',
        job_location: 'New York',
        job_type: 'full time',
        workplace: 'hybrid',
        tech_stack: ['React', 'Node.js', 'MongoDB'],
      });
    });

    it('should throw ApiError when AI service returns no response', async () => {
      (AIRequest as jest.Mock).mockResolvedValue(null);

      await expect(analyzeJob('test')).rejects.toThrow(
        new ApiError(500, 'No response from AI service')
      );
    });

    it('should throw ApiError when all JSON parsing attempts fail', async () => {
      (AIRequest as jest.Mock).mockResolvedValue(
        'Invalid job description response without JSON'
      );

      await expect(analyzeJob('test')).rejects.toThrow(
        new ApiError(
          500,
          'Unable to extract valid JSON from AI service response'
        )
      );
    });
  });
});
