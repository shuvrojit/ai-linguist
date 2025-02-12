import OpenAI from 'openai';
import logger from '../config/logger';
import { OPENAI_API_KEY } from '../config/config';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

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
      // max_tokens: 256,
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
