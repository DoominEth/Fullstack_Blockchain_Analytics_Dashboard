const express = require('express');
const axios = require('axios');
const cors = require('cors');
// const NodeCache = require("node-cache"); // Commenting out NodeCache import for caching

const { fetchFromCache, insertIntoCache } = require('./DatabaseCache.js');

const app = express();
// const myCache = new NodeCache({ stdTTL: 300 }); // Cache for 300 seconds

app.use(cors());

app.get('/api/data', async (req, res) => {
    // const cachedData = myCache.get("randomData"); // Check if data exists in cache

    // if (cachedData) {
    //     return res.json(cachedData);
    // }

    try {
        const response = await axios.get('http://127.0.0.1:5000/api/data');
        // myCache.set("randomData", response.data); // Store data in cache
        res.json(response.data);
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/blockchain-data', async (req, res) => {
    console.log(req.query.contract_address);
    const tableName = `transactions_${req.query.contract_address.replace(/[^a-z0-9]/gi, '')}`;
    const start_block = req.query.start_block; // Assuming you're passing these as query parameters
    const end_block = req.query.end_block;

    // Commenting out the attempt to fetch data from the database cache
    const cachedData = await fetchFromCache(tableName, start_block, end_block);

    if (cachedData && cachedData.length > 0) {
        return res.json(cachedData);
    }

    const backendUrl = `http://127.0.0.1:5000/api/blockchain-data?${new URLSearchParams(req.query).toString()}`;

    try {
        const response = await axios.get(backendUrl);

        // Commenting out the saving of data into the database cache
        await insertIntoCache(tableName, response.data);

        res.json(response.data);
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3001, () => {
    console.log('Node.js server running on http://localhost:3001');
});
