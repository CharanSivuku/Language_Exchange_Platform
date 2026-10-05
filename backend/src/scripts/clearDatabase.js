import mongoose from "mongoose";
import "dotenv/config";

async function clearDatabase() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is missing from environment variables.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB to clean login/user history...");
    await mongoose.connect(mongoUri);
    console.log("Connected to database:", mongoose.connection.name);

    const usersResult = await mongoose.connection.db.collection("users").deleteMany({});
    const requestsResult = await mongoose.connection.db.collection("friendrequests").deleteMany({});

    console.log(`✅ Successfully wiped database collections:`);
    console.log(`   - Deleted ${usersResult.deletedCount} users`);
    console.log(`   - Deleted ${requestsResult.deletedCount} friend requests`);
    console.log(`🎉 Database is now completely fresh!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error.message);
    process.exit(1);
  }
}

clearDatabase();
