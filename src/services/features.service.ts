import AIRequest from '../utils/aiRequest';

export const getSummary = async (body: string) => {
  const response = await AIRequest(
    'gpt-4o-mini-2024-07-18',
    'summarize the given text',
    body
  );
  return response;
};
