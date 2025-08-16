const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');   // ✅ Import CORS
const authRoutes = require('./routes/authRoute');

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());                // Allow requests from frontend
app.use(express.json());        // Parse JSON bodies

// ✅ Routes
app.use("/api", authRoutes);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected successfully");
    app.listen(5000, () => {
        console.log("Server is running on port: 5000");
    });
})
.catch((err) => console.error("MongoDB connection error: ", err));
