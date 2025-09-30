import mongoose from "mongoose";

let memoryServer = null;

export async function connectToDatabase(mongoUri) {
  mongoose.set("strictQuery", true);

  const useMemory = process.env.USE_MEMORY_DB === "1" || mongoUri === "memory";

  if (useMemory) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();
    await mongoose.connect(memUri, { autoIndex: true });
    // eslint-disable-next-line no-console
    console.log("[mongo] connected (memory)");
    return;
  }

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 15000,
    });
    // eslint-disable-next-line no-console
    console.log("[mongo] connected");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[mongo] connection error", error);
    throw error;
  }
}

