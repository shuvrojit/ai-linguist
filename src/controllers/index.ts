import { pageContentController } from './pageContent.controller';
import { analyzeMeaning, analyzeById, summarize } from './features.controller';

export const featuresController = {
  analyzeMeaning,
  analyzeById,
  summarize,
};

export { pageContentController };
