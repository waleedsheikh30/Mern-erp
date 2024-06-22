require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');
const cors = require('cors');
const express = require('express');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version to at least 20 or greater. 👌\n');
  process.exit();
}

// Connect to the database
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', (error) => {
  console.log(`1. 🔥 Common Error: check your .env file first and add your MongoDB URL`);
  console.error(`2. 🚫 Error: ${error.message}`);
});

// Import all models
const modelsFiles = globSync('./src/models/**/*.js');
for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['https://mern-erp.vercel.app'], // Replace with your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Start the app
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

module.exports = app;
