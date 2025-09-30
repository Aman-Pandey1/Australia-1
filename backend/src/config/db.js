const mongoose = require('mongoose');
const env = require('./env');

let isConnected = false;
let memoryServer = null;

async function tryConnect(uri, label) {
  // eslint-disable-next-line no-console
  console.log(`[db] Trying ${label} -> ${uri}`);
  await mongoose.connect(uri, {
    autoCreate: true,
    autoIndex: env.nodeEnv !== 'production',
    serverSelectionTimeoutMS: 5000,
  });
  // eslint-disable-next-line no-console
  console.log(`[db] Connected via ${label}: ${mongoose.connection.name}`);
}

async function connectToDatabase() {
  if (isConnected) return mongoose.connection;
  mongoose.set('strictQuery', true);

  const primaryUri = env.mongoUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/escort_directory';
  const useMemory = String(process.env.USE_MEMORY_DB || '').toLowerCase() === 'true' || primaryUri === 'memory';

  if (useMemory) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await tryConnect(uri, 'in-memory');
    isConnected = true;
    return mongoose.connection;
  }

  try {
    await tryConnect(primaryUri, 'primary');
    isConnected = true;
    return mongoose.connection;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db] Primary connection failed:', err?.message || err);
    if (String(process.env.FALLBACK_MEMORY_DB || 'true').toLowerCase() === 'true') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const uri = memoryServer.getUri();
        await tryConnect(uri, 'in-memory');
        isConnected = true;
        return mongoose.connection;
      } catch (memErr) {
        // eslint-disable-next-line no-console
        console.error('[db] In-memory connection failed:', memErr?.message || memErr);
      }
    }
    throw err;
  }
}

module.exports = { connectToDatabase };

