import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import BlockComponent from './BlockComponent';
import { buildSmartContractData, fetchHashLogEvents } from '../API/initialContractDataAPI';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startBlock, setStartBlock] = useState('');
  const [endBlock, setEndBlock] = useState('');

  const handleSearch = async () => {
    const dataLogs = await buildSmartContractData(searchTerm, startBlock, endBlock);
    const dataHash = await fetchHashLogEvents(searchTerm);

    console.log(dataLogs);
    console.log(dataHash);
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
    </Box>
  );
};

export default SearchComponent;