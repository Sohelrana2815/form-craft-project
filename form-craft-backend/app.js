const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add your routes here
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Export the Express app
module.exports = app;