const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Import Routes
const authRoutes = require("./routes/authRoute");
const destinationRoutes = require("./routes/destinationRoute");
const packageRoutes = require("./routes/packageRoute");
const chatRoutes = require("./routes/chatRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
const wishlistRoutes = require("./routes/wishlistRoutes");
const bookingRoutes = require("./routes/bookingRoutes"); // ← ADD THIS LINE

// ✅ Use Routes
app.use("/api", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/packages", packageRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/bookings", bookingRoutes); // ← ADD THIS LINE

// ✅ Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });