import { IPageContent } from '../models/pageContent.model';
import PageContentModel from '../models/pageContent.model';
import AIRequest from '../utils/aiRequest';
import prompts from '../utils/prompts';

export interface CreatePageContent {
  title: string;
  text: string;
  url: string;
  baseurl: string;
  html: string;
  media?: string[];
}

export const pageContentService = {
  async create(content: CreatePageContent): Promise<IPageContent> {
    const pageContent = new PageContentModel(content);
    return await pageContent.save();
  },

  async findByUrl(url: string): Promise<IPageContent | null> {
    return await PageContentModel.findOne({ url });
  },

  async findAll(): Promise<IPageContent[]> {
    return await PageContentModel.find();
  },

  async update(
    url: string,
    content: Partial<CreatePageContent>
  ): Promise<IPageContent | null> {
    return await PageContentModel.findOneAndUpdate(
      { url },
      { $set: content },
      { new: true }
    );
  },

  async delete(url: string): Promise<boolean> {
    const result = await PageContentModel.deleteOne({ url });
    return result.deletedCount > 0;
  },

  async cleanContent(content: CreatePageContent): Promise<CreatePageContent> {
    // Remove extra whitespace and normalize text
    console.log(content);

    const cleanedContent = {
      ...content,
      text: content.text.trim().replace(/\s+/g, ' '),
      title: content.title.trim(),
      html: content.html.trim(),
    };

    // Extract base URL from the full URL
    if (!cleanedContent.baseurl) {
      try {
        const url = new URL(content.url);
        cleanedContent.baseurl = `${url.protocol}//${url.hostname}`;
      } catch (error) {
        cleanedContent.baseurl = content.url;
      }
    }

    return cleanedContent;
  },
};

export const extractPageInformation = async (text: string) => {
  const response = await AIRequest('gpt-3.5-turbo', prompts.extract, text);
  return response;
};
