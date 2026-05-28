require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/error");
const { apiLimiter, authLimiter } = require("./middleware/rateLimit");
const setupSocket = require("./socket/index");

// Routes
const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/auth");
const seekerRoutes = require("./routes/seeker");
const companyRoutes = require("./routes/company");
const internshipRoutes = require("./routes/internship");
const applicationRoutes = require("./routes/application");
const notificationRoutes = require("./routes/notification");
const chatRoutes = require("./routes/chat");
const adminRoutes = require("./routes/admin");
const candidateRoutes = require("./routes/candidate");
const employerRoutes = require("./routes/employer");
const interviewRoutes = require("./routes/interview");
const skillsRoutes = require("./routes/skills");
const institutionRoutes = require("./routes/institution");
const courseRoutes = require("./routes/course");
const careerPathwayRoutes = require("./routes/careerPathway");


const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);

// Socket.io Setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
});
setupSocket(io);

connectDB();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(cors({ 
  origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : ["http://localhost:5173", "http://127.0.0.1:5173"], 
  credentials: true 
}));
app.use(express.json({ limit: "10kb" })); // Prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Rate Limiting
app.use("/api/", apiLimiter);
app.use("/api/auth/", authLimiter);

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/seeker", seekerRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/career-pathway", careerPathwayRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});