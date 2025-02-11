import { featuresService } from '../../services';
import AIRequest from '../../utils/aiRequest';

jest.mock('../../utils/aiRequest');

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
});
