import mongoose from 'mongoose';
import { MONGODB_URL } from './config';

/**
 * Establishes connection to MongoDB database
 *
 * This function handles the initial connection to MongoDB and includes error handling.
 * It uses the MONGODB_URL from environment configuration and connects to the 'semantiai' database.
 *
 * @returns Promise<void>
 * @throws {Error} If connection fails
 *
 * @example
 * ```typescript
 * // In your main application file
 * import connectDB from './config/db';
 *
 * async function startServer() {
 *   await connectDB();
 *   // Start your server here
 * }
 * ```
 *
 * Connection Options:
 * - Database Name: semantiai
 * - Connection URL: Specified in environment variables
 * - Error Handling: Logs to stdout and exits process on failure
 */
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL, { dbName: 'semantiai' });
    process.stdout.write('Database connected\n');
  } catch (e) {
    process.stdout.write(`Error ${e}\n`);
    process.exit(1);
  }
};

export default connectDB;
