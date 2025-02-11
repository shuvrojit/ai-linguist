import app from './app';
import logger from './config/logger';
import connectDB from './config/db';
import { PORT } from './config/config';

connectDB();

if (isNaN(PORT)) {
  throw new Error('Invalid PORT environment variable');
}

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} ...`);
});
