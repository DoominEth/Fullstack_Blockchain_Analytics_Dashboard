const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
// const NodeCache = require("node-cache"); // Commenting out NodeCache import for caching

const { fetchFromCache, insertIntoCache } = require('./DatabaseCache.js');

const app = express();
// const myCache = new NodeCache({ stdTTL: 300 }); // Cache for 300 seconds

app.use(cors());
app.use(bodyParser.json());


app.post('/api/build-smart-contract-data', async (req, res) => {
  try {
    const { start_block, end_block, contract_address } = req.body;
    const backendUrl = `http://127.0.0.1:5000/api/build-smart-contract-data`;
    const response = await axios.post(backendUrl, {
      start_block,
      end_block,
      contract_address
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/hash-log-events', async (req, res) => {
  try {
    const { contract_address } = req.body;
    const backendUrl = `http://127.0.0.1:5000/api/hash-log-events`;
    const response = await axios.post(backendUrl, {
      contract_address
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/api/blockchain-data', async (req, res) => {
    const tableName = `transactions_${req.query.contract_address.replace(/[^a-z0-9]/gi, '')}`;
    const start_block = parseInt(req.query.start_block); 
    const end_block = parseInt(req.query.end_block);
    const datatype = req.query.datatype

    // Fetch Cache Data
    const cachedData = await fetchFromCache(tableName, start_block, end_block);

    let missingData = [];

    if (cachedData.length > 0) {
        const cachedStart = cachedData[0].block_number;
        const cachedEnd = (cachedData[cachedData.length - 1].block_number) + 1; //Plus one as the call is UPTO the end_block

        console.log("Datatype:", datatype)
        console.log("CacheStart: ", cachedStart)
        console.log("CacheStart: ", cachedEnd)
        
        // Fetch data before the cache if missing
        if (start_block < cachedStart) {
            console.log("")
            const backendUrlBefore = `http://127.0.0.1:5000/api/blockchain-data?datatype=${req.query.datatype}&contract_address=${req.query.contract_address}&start_block=${start_block}&end_block=${cachedStart - 1}`;
            const responseBefore = await axios.get(backendUrlBefore);

            missingData = [...missingData, ...responseBefore.data.data];
            console.log("Collecting data before init")
        }
                
        
        // Fetch data after the cache if missing
        if (end_block > cachedEnd) {
            const backendUrlAfter = `http://127.0.0.1:5000/api/blockchain-data?datatype=${req.query.datatype}&contract_address=${req.query.contract_address}&start_block=${cachedEnd}&end_block=${end_block}`;
            const responseAfter = await axios.get(backendUrlAfter);
            missingData = [...missingData, ...responseAfter.data.data];
            console.log("Collecting data after init")
        }

        

        //Add missing data to the cache
        if (missingData.length > 0) {
            await insertIntoCache(tableName, missingData);
            console.log("Pushing New data to cache")
        }


        //Send the data
        const mergedData = [...missingData, ...cachedData].filter(block => block.block_number >= start_block && block.block_number < end_block);
        res.json(mergedData.sort((a, b) => a.block_number - b.block_number));
    } 
    else 
    {
        //Get data and send
        const backendUrl = `http://127.0.0.1:5000/api/blockchain-data?datatype=${req.query.datatype}&contract_address=${req.query.contract_address}&start_block=${start_block}&end_block=${end_block}`;
        const response = await axios.get(backendUrl);
        await insertIntoCache(tableName, response.data.data);
        res.json(response.data);
        
    }
        

});


app.listen(3001, () => {
    console.log('Node.js server running on http://localhost:3001');
});
