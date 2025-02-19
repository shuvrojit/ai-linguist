import { analyzeContent } from '../../services/features.service';
import AIRequest from '../../utils/aiRequest';
import ApiError from '../../utils/ApiError';

jest.mock('../../utils/aiRequest');

describe('Features Service', () => {
  describe('extractMeaning', () => {
    it('should successfully parse AI response', async () => {
      const mockResponse = JSON.stringify({
        category: 'job',
        type: 'job posting',
        metadata: {
          title: 'Software Engineer',
        },
      });

      (AIRequest as jest.Mock).mockResolvedValue(mockResponse);

      const result = await analyzeContent('test content');

      expect(result).toEqual({
        category: 'job',
        type: 'job posting',
        metadata: {
          title: 'Software Engineer',
        },
      });
    });

    it('should throw ApiError when AI service returns no response', async () => {
      (AIRequest as jest.Mock).mockResolvedValue(null);

      await expect(analyzeContent('test content')).rejects.toThrow(ApiError);
      await expect(analyzeContent('test content')).rejects.toThrow(
        'No response from AI service'
      );
    });

    it('should throw ApiError when response is not valid JSON', async () => {
      (AIRequest as jest.Mock).mockResolvedValue('invalid json');

      await expect(analyzeContent('test content')).rejects.toThrow(ApiError);
      await expect(analyzeContent('test content')).rejects.toThrow(
        'Invalid response format from AI service'
      );
    });
  });
});
