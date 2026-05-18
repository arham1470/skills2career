const mongoose = require("mongoose");
const User = require("./models/User");

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://skills2career:skills2career@ac-mjsbqwg-shard-00-00.orqwdsn.mongodb.net/skills2career?retryWrites=true&w=majority&appName=ac-mjsbqwg";

async function migrateRoles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Update all student roles to seeker
    const studentUpdateResult = await User.updateMany(
      { role: "student" },
      { $set: { role: "seeker" } }
    );
    console.log(`Updated ${studentUpdateResult.modifiedCount} users from student to seeker`);

    // Update all provider roles to employer
    const providerUpdateResult = await User.updateMany(
      { role: "provider" },
      { $set: { role: "employer" } }
    );
    console.log(`Updated ${providerUpdateResult.modifiedCount} users from provider to employer`);

    // Verify the changes
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);
    console.log("\nCurrent role distribution:");
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} users`);
    });

    console.log("\nMigration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateRoles();
