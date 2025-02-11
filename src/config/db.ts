import mongoose from 'mongoose';
import { MONGODB_URL } from './config';

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
