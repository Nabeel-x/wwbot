const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Import routes
const downloadRoute = require('./routes/getVideo');

// Use routes
app.use('/api/download', downloadRoute);

module.exports = app;
