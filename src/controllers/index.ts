import { pageContentController } from './pageContent.controller';
import {
  analyzeMeaning,
  analyzeById,
  summarize,
  summarizeById,
  analyzeJobDescription,
} from './features.controller';

export const featuresController = {
  analyzeMeaning,
  analyzeById,
  summarize,
  summarizeById,
  analyzeJobDescription,
};

export { pageContentController };
