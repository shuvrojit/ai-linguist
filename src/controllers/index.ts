import { pageContentController } from './pageContent.controller';
import {
  analyzeMeaning,
  analyzeById,
  summarize,
  summarizeById,
} from './features.controller';

export const featuresController = {
  analyzeMeaning,
  analyzeById,
  summarize,
  summarizeById,
};

export { pageContentController };
