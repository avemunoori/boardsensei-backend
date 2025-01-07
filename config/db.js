const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from the environment variable
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    // Log the error message and stack trace for debugging
    console.error("MongoDB Connection Failed:", error.message);
    console.error(error.stack);
    process.exit(1); // Exit the app if the connection fails
  }
};

module.exports = connectDB;
