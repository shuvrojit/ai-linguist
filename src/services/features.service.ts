import AIRequest from '../utils/aiRequest';
import ApiError from '../utils/ApiError';
import prompts from '../utils/prompts';

export const analyzeContent = async (text: string) => {
  const response = await AIRequest('gpt-4o', prompts.analyze, text);

  if (!response) {
    throw new ApiError(500, 'No response from AI service');
  }

  try {
    return JSON.parse(response);
  } catch (parseError) {
    throw new ApiError(500, 'Invalid response format from AI service');
  }
};
