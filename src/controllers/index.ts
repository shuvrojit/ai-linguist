import { pageContentController } from './pageContent.controller';
import { summarize, overview, extractText } from './features.controller';

export const featuresController = {
  summarize,
  overview,
  extractText,
};

export { pageContentController };
