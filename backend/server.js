const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS package
const dotenv = require('dotenv'); // To manage environment variables
const authRoute = require('./routes/auth'); // Import the authentication route

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Simple route to check server status
app.get('/', (req, res) => {
  res.send('Server is up and running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Routes
app.use('/api/auth', authRoute); // Use the authentication route

// Graceful shutdown
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});