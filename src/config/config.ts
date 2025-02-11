import { config } from 'dotenv';

config();

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
export const MONGODB_URL = process.env.MONGODB_URL as string;
export const PORT = parseInt(process.env.PORT || '3000', 10);

if (isNaN(PORT)) {
  throw new Error('PORT must be a valid number');
}
