import mongoose from 'mongoose';

/**
 * Reusable MongoDB Connection Function
 * Connects to MongoDB using MONGODB_URI environment variable
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.warn('⚠️  MONGODB_URI is not defined in environment variables. DB connection skipped until configured.');
      return false;
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure if database connection fails in strict environment
    process.exit(1);
  }
};

export default connectDB;
