import { OPENAI_API_KEY, MONGODB_URL, PORT } from '../config';

describe('Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      OPENAI_API_KEY: 'test-api-key',
      MONGODB_URL: 'mongodb://localhost:27017/test',
      PORT: '8000', // Changed to string
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should have required environment variables defined', () => {
    expect(OPENAI_API_KEY).toBeDefined();
    expect(MONGODB_URL).toBeDefined();
    expect(PORT).toBeDefined();
  });

  it('should have PORT as a number', () => {
    expect(typeof PORT).toBe('number');
  });

  it('should have valid MONGODB_URL', () => {
    expect(MONGODB_URL).toMatch(/^mongodb:\/\/.*/);
  });

  it('should have non-empty OPENAI_API_KEY', () => {
    expect(OPENAI_API_KEY.length).toBeGreaterThan(0);
  });

  describe('when environment variables are missing', () => {
    it('should throw error if PORT is NaN', () => {
      process.env.PORT = 'invalid';
      expect(() => require('../config')).toThrow();
    });
  });
});
