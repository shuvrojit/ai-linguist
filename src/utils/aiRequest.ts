import OpenAI from 'openai';
import logger from '../config/logger';
import { OPENAI_API_KEY } from '../config/config';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * Makes a request to OpenAI's API for content processing
 *
 * @param model - The OpenAI model to use (e.g., 'gpt-3.5-turbo')
 * @param systemContent - The system prompt that defines AI's behavior
 * @param userContent - The actual content to be processed
 * @param option - Optional parameter to modify the request
 * @returns Promise resolving to the AI response content
 * @throws {Error} If the AI service is unavailable or encounters an error
 *
 * @example
 * ```typescript
 * // Generate a summary
 * const summary = await AIRequest(
 *   'gpt-3.5-turbo',
 *   'Generate a concise summary',
 *   'Long text to summarize'
 * );
 *
 * // Extract information with an option
 * const extracted = await AIRequest(
 *   'gpt-3.5-turbo',
 *   'Extract key points',
 *   'Content to analyze',
 *   'format: bullet points'
 * );
 * ```
 */
const AIRequest = async (
  model: string,
  systemContent: string,
  userContent: string,
  option?: string
) => {
  try {
    const result = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemContent },
        {
          role: 'user',
          content: option ? `${option}: ${userContent}` : userContent,
        },
      ],
      temperature: 0.3,
      top_p: 1,
    });
    return result.choices[0]?.message.content || null;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`OpenAI request failed: ${error.message}`);
      throw new Error('AI service is currently unavailable.');
    } else {
      // Handle unexpected error types
      logger.error(`OpenAI request failed: ${JSON.stringify(error)}`);
      throw new Error('AI service encountered an unknown error.');
    }
  }
};

export default AIRequest;
