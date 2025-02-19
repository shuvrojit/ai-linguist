import { pageContentController } from './pageContent.controller';
import {
  summarize,
  overview,
  extractText,
  analyzeMeaning,
} from './features.controller';

export const featuresController = {
  summarize,
  overview,
  extractText,
  analyzeMeaning,
};

export { pageContentController };
