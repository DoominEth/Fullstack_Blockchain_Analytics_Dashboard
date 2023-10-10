import React from 'react';
import { Button, TextField, Box } from '@mui/material';

const SearchBar = ({ setSearchTerm, searchTerm }) => {

  return (
    <Box display="flex" width="100%" alignItems="center" px={2}  >
      <Box flex={1} mr={2}>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Search"
          variant="outlined"
          fullWidth
          size="small"
        />
      </Box>
      <Button variant="contained" color="primary">
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
