const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require("node-cache");  // Import node-cache

const app = express();
const myCache = new NodeCache({ stdTTL: 300 }); // Cache for 300 seconds

app.use(cors());

app.get('/api/data', async (req, res) => {
    const cachedData = myCache.get("randomData");  // Check if data exists in cache

    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const response = await axios.get('http://127.0.0.1:5000/api/data');
        myCache.set("randomData", response.data); // Store data in cache
        res.json(response.data);
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/blockchain-data', async (req, res) => {
    // Constructing the Flask API URL with query parameters
    const backendUrl = `http://127.0.0.1:5000/api/blockchain-data?${new URLSearchParams(req.query).toString()}`;

    try {
        const response = await axios.get(backendUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(3001, () => {
    console.log('Node.js server running on http://localhost:3001');
});
