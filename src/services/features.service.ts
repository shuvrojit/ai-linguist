import AIRequest from '../utils/aiRequest';

const summaryPrompt =
  "Summarize the following long blog post into a quick overview that captures all the main points and subjects discussed. The summary should be comprehensive yet concise, allowing a blog reader to quickly grasp the content. Keep the summary between 300 and 500 characters. Only Generate HTML for the content. Don't response with normal text just the html snippet nothing else";

const detailedOverviewPrompt =
  "Generate a detailed summary of the following long blog post. The summary should provide comprehensive coverage of all the main points and subjects discussed, offering readers a thorough understanding of the content. Aim for a length of around 800 to 1000 characters. Only Generate HTML for the content. Don't response with normal text just the html snippet nothing else";

export const getSummary = async (content: string) => {
  const response = await AIRequest('gpt-4o-mini', summaryPrompt, content);
  return response;
};

export const detailOverview = async (content: string) => {
  const response = await AIRequest(
    'gpt-4o-mini-2024-07-18',
    detailedOverviewPrompt,
    content
  );
  return response;
};
