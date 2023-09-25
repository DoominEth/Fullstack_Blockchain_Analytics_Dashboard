// SearchBar.js
import React from 'react';
import { Button, TextField, Box } from '@mui/material';

const SearchBar = ({ setSearchTerm, searchTerm }) => {

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
      <Box style={{ margin: '10px' }}>
        <Button variant="contained" color="primary">
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default SearchBar;
