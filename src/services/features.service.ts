import AIRequest from '../utils/aiRequest';
import ApiError from '../utils/ApiError';
import prompts from '../utils/prompts';

export const analyzeContent = async (text: string) => {
  const response = await AIRequest('gpt-4o', prompts.analyze, text);

  if (!response) {
    throw new ApiError(500, 'No response from AI service');
  }
  const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);

  if (!jsonMatch) {
    throw new ApiError(500, 'Invalid response format from AI service');
  }
  const jsonData = JSON.parse(jsonMatch[1]);
  console.log(jsonData);
  return jsonData;
};
