import AIRequest from '../utils/aiRequest';
import ApiError from '../utils/ApiError';
import prompts from '../utils/prompts';

export const analyzeContent = async (text: string) => {
  const response = await AIRequest('gpt-4o', prompts.analyze, text);

  if (!response) {
    throw new ApiError(500, 'No response from AI service');
  }

  try {
    // Method 1: Try to extract JSON from markdown code blocks with a more robust regex
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);

    if (jsonMatch && jsonMatch[1]) {
      const jsonContent = jsonMatch[1].trim();
      console.log('Extracted JSON content:', jsonContent);

      try {
        return JSON.parse(jsonContent);
      } catch (parseError) {
        console.error('Failed to parse extracted JSON content:', parseError);
        // Continue to fallback methods
      }
    }

    // Method 2: Try parsing the entire response as JSON
    try {
      return JSON.parse(response);
    } catch (error) {
      // Not valid JSON, continue to next method
    }

    // Method 3: Try to find any JSON-like content in the response
    const possibleJsonMatch = response.match(/(\{[\s\S]*\})/);
    if (possibleJsonMatch && possibleJsonMatch[1]) {
      try {
        return JSON.parse(possibleJsonMatch[1]);
      } catch (error) {
        // Failed this attempt too
      }
    }

    // If we get here, all parsing attempts failed
    throw new ApiError(
      500,
      'Unable to extract valid JSON from AI service response'
    );
  } catch (error) {
    // If it's already an ApiError, rethrow it to preserve the specific message
    if (error instanceof ApiError) {
      throw error;
    }
    // Otherwise, wrap it in a generic ApiError
    console.error('Error processing AI response:', error);
    throw new ApiError(500, 'Error processing AI service response');
  }
};

/**
 * Summarizes the provided text using AI, maintaining key information while reducing length
 * @param text The text to summarize
 * @returns A summary object containing the condensed text, key points, and word counts
 */
export const summarizeContent = async (text: string) => {
  const response = await AIRequest('gpt-4o', prompts.summarize, text);

  if (!response) {
    throw new ApiError(500, 'No response from AI service');
  }

  try {
    // Try parsing the response as JSON directly first
    try {
      return JSON.parse(response);
    } catch (error) {
      // If direct parsing fails, try to find JSON within markdown code blocks
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        const jsonContent = jsonMatch[1].trim();
        return JSON.parse(jsonContent);
      }

      // If both attempts fail, throw an error
      throw new ApiError(500, 'Error processing AI service response');
    }
  } catch (error) {
    console.error('Error processing AI response:', error);
    throw new ApiError(500, 'Error processing AI service response');
  }
};
