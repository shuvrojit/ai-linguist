import connectDB from './config/db';
import logger from './config/logger';
import { PORT } from './config/config';
import app from './app';

connectDB();

if (isNaN(PORT)) {
  throw new Error('Invalid PORT environment variable');
}

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} ...`);
});
