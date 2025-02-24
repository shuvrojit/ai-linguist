import { Types } from 'mongoose';
import AIRequest from '../utils/aiRequest';
import { IPageContent } from '../models/pageContent.model';
import PageContentModel from '../models/pageContent.model';
import prompts from '../utils/prompts';

/**
 * Interface for creating page content
 */
export interface CreatePageContent {
  /** Page title */
  title: string;
  /** Page text content */
  text: string;
  /** Full URL of the page */
  url: string;
  /** Base URL of the page */
  baseurl: string;
  /** HTML content of the page */
  html: string;
  /** Optional array of media URLs */
  media?: string[];
  /** Content type */
  contentType?: 'article' | 'news' | 'blog' | 'resource' | 'other';
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Service for managing page content operations
 */
export const pageContentService = {
  /**
   * Creates a new page content entry
   * @param content - The content to be created
   * @returns Promise resolving to the created page content
   */
  async create(content: CreatePageContent): Promise<IPageContent> {
    const pageContent = new PageContentModel(content);
    return await pageContent.save();
  },

  /**
   * Finds page content by URL
   * @param url - The URL to search for
   * @returns Promise resolving to the found page content or null
   */
  async findByUrl(url: string): Promise<IPageContent | null> {
    return await PageContentModel.findOne({ url });
  },

  /**
   * Finds page content by ID
   * @param id - MongoDB ObjectId string or ObjectId
   * @returns Promise resolving to the found page content or null
   */
  async findById(id: string | Types.ObjectId): Promise<IPageContent | null> {
    return await PageContentModel.findById(id);
  },

  /**
   * Retrieves all page contents
   * @returns Promise resolving to an array of page contents
   */
  async findAll(): Promise<IPageContent[]> {
    return await PageContentModel.find();
  },

  /**
   * Updates existing page content
   * @param url - The URL of the content to update
   * @param content - The new content data
   * @returns Promise resolving to the updated content or null
   */
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

  /**
   * Deletes page content by URL
   * @param url - The URL of the content to delete
   * @returns Promise resolving to boolean indicating success
   */
  async delete(url: string): Promise<boolean> {
    const result = await PageContentModel.deleteOne({ url });
    return result.deletedCount > 0;
  },

  /**
   * Analyzes page content and stores results in metadata
   * @param id - MongoDB ObjectId string or ObjectId
   * @returns Promise resolving to the updated page content or null
   */
  async analyzeContent(
    id: string | Types.ObjectId
  ): Promise<IPageContent | null> {
    const content = await this.findById(id);
    if (!content) return null;

    const analysis = await extractPageInformation(content.text);
    return await PageContentModel.findByIdAndUpdate(
      id,
      { $set: { metadata: { analysis } } },
      { new: true }
    );
  },

  /**
   * Cleans and normalizes content data
   * @param content - The content to clean
   * @returns Promise resolving to cleaned content
   */
  async cleanContent(content: CreatePageContent): Promise<CreatePageContent> {
    const cleanedContent = {
      ...content,
      text: content.text.trim().replace(/\s+/g, ' '),
      title: content.title.trim(),
      html: content.html.trim(),
    };

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

/**
 * Extracts structured information from page text using AI
 * @param text - The text to analyze
 * @returns Promise resolving to extracted information
 */
export const extractPageInformation = async (text: string) => {
  const response = await AIRequest('gpt-3.5-turbo', prompts.extract, text);
  return response;
};
