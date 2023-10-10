import React, { useState } from 'react';
import { Box, Button, TextField, Container } from '@mui/material';
import BlockComponent from './BlockComponent';
import { buildSmartContractData, 
  fetchHashLogEvents, 
  fetchParsedLogEvents, 
  fetchHashFunctions, 
  fetchContractReferences, 
  fetchTestData } from '../API/initialContractDataAPI';

const SearchComponent = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startBlock, setStartBlock] = useState('');
  const [endBlock, setEndBlock] = useState('');

  const handleSearch = async () => {
    const dataLogs = await buildSmartContractData(searchTerm, startBlock, endBlock);
    const dataHash = await fetchHashLogEvents(searchTerm);
    const parsedLogs = await fetchParsedLogEvents(searchTerm, startBlock, endBlock);
    const dataFuncHash = await fetchHashFunctions(searchTerm);
    const dataContractReferences = await fetchContractReferences(searchTerm);
    const testData = await fetchTestData(searchTerm);

    console.log(dataLogs);
    console.log(dataHash);
    console.log(parsedLogs);
    console.log(dataFuncHash);
    console.log(dataContractReferences);
    console.log(testData);


        onSearch({
      graphData1: testData,
      graphData2: dataHash,
    });

  };

return (
    <Container maxWidth="md">
      <Box display="flex" alignItems="center" >
        <Box m={1} flex={4}>
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
        <Box m={1}>
          <Button onClick={handleSearch} variant="contained" color="primary">
            Search
          </Button>
        </Box>
        <Box>
        </Box>
      </Box>
    </Container>
  );
};


export default SearchComponent;