const path = require('path');
const fs = require('fs');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const dotenv = require('dotenv'); // Load environment variables
const app = express();
const cors = require('cors');
// const serverless = require('serverless-http'); // Uncomment if using serverless

dotenv.config(); // Load environment variables from .env file

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  user: process.env.MONGO_USERNAME,
  pass: process.env.MONGO_PASSWORD
})
  .then(() => {
    console.log('MongoDB connection successful');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Define schema and model
const Schema = mongoose.Schema;
const dataSchema = new Schema({
  name: String,
  id: Number,
  description: String,
  image: String,
  velocity: String,
  distance: String
});
const planetModel = mongoose.model('planets', dataSchema);

// Route to fetch planet details
app.post('/planet', (req, res) => {
  planetModel.findOne({ id: req.body.id }, (err, planetData) => {
    if (err) {
      return res.status(500).send("Error in Planet Data");
    }
    res.send(planetData);
  });
});

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// Route to serve API docs
app.get('/api-docs', (req, res) => {
  fs.readFile('oas.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file');
    }
    res.json(JSON.parse(data));
  });
});

// OS endpoint for system info
app.get('/os', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "os": OS.hostname(),
    "env": process.env.NODE_ENV
  });
});

// Health check endpoints
app.get('/live', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "status": "live"
  });
});

app.get('/ready', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "status": "ready"
  });
});

// Server Listener
app.listen(3000, () => {
  console.log("Server successfully running on port - " + 3000);
});

// Uncomment the next line if using serverless
// module.exports.handler = serverless(app);

module.exports = app; // Export app for testing purposes
