import { analyzeContent } from '../../services/features.service';
import AIRequest from '../../utils/aiRequest';
import ApiError from '../../utils/ApiError';

jest.mock('../../utils/aiRequest');

describe('Features Service', () => {
  describe('extractMeaning', () => {
    it('should successfully parse AI response', async () => {
      const jsonData = {
        category: 'job',
        type: 'job posting',
        metadata: {
          title: 'Software Engineer',
        },
      };

      // Format the mock response as a markdown code block with JSON
      const mockResponse = '```json\n' + JSON.stringify(jsonData) + '\n```';

      (AIRequest as jest.Mock).mockResolvedValue(mockResponse);

      const result = await analyzeContent('test content');

      expect(result).toEqual(jsonData);
    });

    it('should throw ApiError when AI service returns no response', async () => {
      (AIRequest as jest.Mock).mockResolvedValue(null);

      await expect(analyzeContent('test content')).rejects.toThrow(ApiError);
      await expect(analyzeContent('test content')).rejects.toThrow(
        'No response from AI service'
      );
    });

    it('should throw ApiError when response is not valid JSON', async () => {
      // Use a response without a valid JSON code block
      (AIRequest as jest.Mock).mockResolvedValue(
        'just some text without json code block'
      );

      await expect(analyzeContent('test content')).rejects.toThrow(ApiError);
      await expect(analyzeContent('test content')).rejects.toThrow(
        'Invalid response format from AI service'
      );
    });
  });
});
