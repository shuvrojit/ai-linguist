import { config } from 'dotenv';

config();

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
export const MONGODB_URL = process.env.MONGODB_URL as string;
export const PORT = process.env.PORT as string;
