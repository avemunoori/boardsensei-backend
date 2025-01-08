const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// Trust proxy setting for express-rate-limit
app.set("trust proxy", 1);

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors({ origin: ["https://your-frontend-domain.com", "http://localhost:3000"], credentials: true })); // CORS setup
app.use(express.json());
app.use(morgan("combined")); // Log HTTP requests

// Rate limiter for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts
  message: "Too many login attempts, please try again later.",
});
app.use("/api/auth/login", loginLimiter);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/lessons", require("./routes/lessons"));
app.use("/api/quizzes", require("./routes/quizzes"));

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Server setup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
