const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Import CORS package

const app = express();

app.use(cors());  // Use CORS middleware

app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/data');
    res.json(response.data);
  } catch (error) {
    console.error('Error details:', error.response ? error.response.data : error);  // Log the error details
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3001, () => {
  console.log('Node.js server running on http://localhost:3001');
});
