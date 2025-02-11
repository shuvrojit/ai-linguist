import { OPENAI_API_KEY, MONGODB_URL, PORT } from '../config';

describe('Configuration', () => {
  it('should have OPENAI_API_KEY defined', () => {
    expect(OPENAI_API_KEY).toBeDefined();
  });

  it('should have MONGODB_URL defined', () => {
    expect(MONGODB_URL).toBeDefined();
  });

  it('should have PORT defined', () => {
    expect(PORT).toBeDefined();
  });
});
