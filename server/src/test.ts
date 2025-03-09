// This is a minimal server test script to verify the environment setup

import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.json({ 
    message: 'Test server is running', 
    env: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      mongoUriExists: !!process.env.MONGO_URI,
      frontendUrl: process.env.FRONTEND_URL
    } 
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
