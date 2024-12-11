const path = require('path');
const fs = require('fs');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const serverless = require('serverless-http');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// Use environment variables passed at runtime
mongoose.connect(process.env.MONGO_URI, {
  user: process.env.MONGO_USERNAME,
  pass: process.env.MONGO_PASSWORD,
  useNewUrlParser: false,
  useUnifiedTopology: false
}, function(err) {
  if (err) {
    console.log("Error connecting to MongoDB:", err);
  } else {
    // MongoDB connection is successful
    // console.log("MongoDB Connection Successful");
  }
});

// Define the schema and model
var Schema = mongoose.Schema;
var dataSchema = new Schema({
  name: String,
  id: Number,
  description: String,
  image: String,
  velocity: String,
  distance: String
});
var planetModel = mongoose.model('planets', dataSchema);

// Define routes
app.post('/planet', function(req, res) {
  planetModel.findOne({
    id: req.body.id
  }, function(err, planetData) {
    if (err) {
      res.send("Error in Planet Data");
    } else {
      res.send(planetData);
    }
  });
});

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/api-docs', (req, res) => {
  fs.readFile('oas.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error reading file');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.get('/os', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "os": OS.hostname(),
    "env": process.env.NODE_ENV
  });
});

app.get('/live', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "status": "live"
  });
});

app.get('/ready', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "status": "ready"
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server successfully running on port - " + 3000);
});

module.exports = app;
