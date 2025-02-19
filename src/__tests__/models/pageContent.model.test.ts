import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PageContentModel } from '../../models';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('PageContent Model Test', () => {
  beforeEach(async () => {
    await PageContentModel.deleteMany({});
  });

  it('should create & save page content successfully', async () => {
    const validContent = {
      title: 'Test Article',
      text: 'This is the article content',
      url: 'https://example.com/article',
      html: '<div>Test content</div>',
      contentType: 'article', // Required field
      baseurl: 'https://example.com', // Optional field
      media: ['https://example.com/image.jpg'],
    };

    const content = new PageContentModel(validContent);
    const savedContent = await content.save();

    expect(savedContent._id).toBeDefined();
    expect(savedContent.title).toBe(validContent.title);
    expect(savedContent.contentType).toBe(validContent.contentType);
    expect(savedContent.createdAt).toBeDefined();
    expect(savedContent.html).toBe(validContent.html);
    expect(savedContent.baseurl).toBe(validContent.baseurl);
    expect(savedContent.media).toEqual(validContent.media);
  });

  it('should fail to save without required fields', async () => {
    const contentWithoutRequired = new PageContentModel({
      title: 'Test',
    });

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await contentWithoutRequired.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should not allow duplicate URLs', async () => {
    const content1 = new PageContentModel({
      title: 'First Article',
      text: 'Content 1',
      url: 'https://example.com/duplicate',
      contentType: 'article',
    });

    const content2 = new PageContentModel({
      title: 'Second Article',
      text: 'Content 2',
      url: 'https://example.com/duplicate',
      contentType: 'article',
    });

    await content1.save();

    let err: any = null;
    try {
      await content2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    if (err) {
      expect(err.code).toBe(11000); // MongoDB duplicate key error code
    }
  });

  it('should validate content type enum values', async () => {
    const contentWithInvalidType = new PageContentModel({
      title: 'Test',
      text: 'Content',
      url: 'https://example.com/test',
      contentType: 'invalid-type',
    });

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await contentWithInvalidType.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err?.errors.contentType).toBeDefined();
  });

  it('should store and retrieve metadata correctly', async () => {
    const contentWithMetadata = {
      title: 'Test Article',
      text: 'Content',
      url: 'https://example.com/metadata-test',
      contentType: 'article',
      metadata: {
        author: 'John Doe',
        category: 'Technology',
        tags: ['test', 'metadata'],
      },
    };

    const content = new PageContentModel(contentWithMetadata);
    const saved = await content.save();
    const retrieved = await PageContentModel.findById(saved._id);

    expect(retrieved?.metadata?.get('author')).toBe('John Doe');
    expect(retrieved?.metadata?.get('category')).toBe('Technology');
    expect(retrieved?.metadata?.get('tags')).toEqual(['test', 'metadata']);
  });
});
