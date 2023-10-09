import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import BlockComponent from './BlockComponent';
import { buildSmartContractData, 
  fetchHashLogEvents, 
  fetchParsedLogEvents, 
  fetchHashFunctions, 
  fetchContractReferences, 
  fetchTestData } from '../API/initialContractDataAPI';



import NetworkGraph from './graphs/networkGraph';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startBlock, setStartBlock] = useState('');
  const [endBlock, setEndBlock] = useState('');
  const [testData, setTestData] = useState(null);  

  const handleSearch = async () => {
    const dataLogs = await buildSmartContractData(searchTerm, startBlock, endBlock);
    const dataHash = await fetchHashLogEvents(searchTerm);
    const parsedLogs = await fetchParsedLogEvents(searchTerm, startBlock, endBlock);
    const dataFuncHash = await fetchHashFunctions(searchTerm);
    const dataContractReferences = await fetchContractReferences(searchTerm);
    const testData = await fetchTestData(searchTerm);
    setTestData(testData);

    


    console.log (typeof testData)

    console.log(dataLogs);
    console.log(dataHash);
    console.log(parsedLogs);
    console.log(dataFuncHash);
    console.log(dataContractReferences);
    console.log(testData);
  };

  return (
    <Box display="flex" width="50%" justifyContent="center" style={{ alignItems: 'center' }}>
      <Box style={{ margin: '10px', flex: 4 }}>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Search"
          variant="outlined"
          fullWidth
          size="small"
        />
      </Box>
      <BlockComponent 
        label="Start Block"
        value={startBlock}
        onChange={(e) => setStartBlock(e.target.value)}
      />
      <BlockComponent 
        label="End Block"
        value={endBlock}
        onChange={(e) => setEndBlock(e.target.value)}
      />
      <Box style={{ margin: '10px' }}>
        <Button 
          onClick={handleSearch}
          variant="contained"
          color="primary"
        >
          Search
        </Button>
      </Box>
          <Box>
        {/* {testData && <NetworkGraph data={testData} />} */}
    </Box>
    </Box>

   
  );
};

export default SearchComponent;
