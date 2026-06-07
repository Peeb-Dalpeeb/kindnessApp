import mongoose from 'mongoose';

// Handle connection events at module scope (registered exactly once)
mongoose.connection.on('error', (err) => {
  console.error('[database]: MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[database]: MongoDB connection disconnected.');
});

/**
 * Closes the MongoDB connection.
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    console.log('[database]: Disconnecting from MongoDB...');
    await mongoose.connection.close();
    console.log('[database]: Successfully disconnected from MongoDB.');
  } catch (error) {
    console.error('[database]: Error disconnecting from MongoDB:', error);
    throw error;
  }
}

/**
 * Initializes and establishes connection to MongoDB using Mongoose.
 * Exits the process if the DATABASE_URL is not set or if connection fails.
 */
export async function connectDatabase(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('[database]: DATABASE_URL is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('[database]: Connecting to MongoDB...');
    await mongoose.connect(databaseUrl);
    console.log('[database]: Successfully connected to MongoDB.');
  } catch (error) {
    console.error('[database]: Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
