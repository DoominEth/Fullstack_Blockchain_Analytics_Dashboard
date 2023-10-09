import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import TextBoxComponent from '../components/TextBoxComponent';
import { buildEventLabelsFromGitHub, fetchUniqueLabelNames } from '../API/labelAPI';  

const SearchGitHubComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [labelName, setLabelName] = useState(''); 

  const handleSearch = async () => {
    const data = await buildEventLabelsFromGitHub(searchTerm, labelName);
    console.log(data);

    let labels = fetchUniqueLabelNames()
    console.log("Labels: ", labels)

    
    
  };

  return (
    <Box display="flex" width="50%" flexDirection="column" alignItems="center">  
      <Box style={{ margin: '10px', width: '100%' }}>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Search"
          variant="outlined"
          fullWidth
          size="small"
        />
      </Box>
      <Box display="flex" flexDirection="row" style={{ margin: '10px', width: '100%', gap: '16px' }}>  
        <Box flex={1}>  
            <TextBoxComponent 
              value={labelName} 
              onChange={(e) => setLabelName(e.target.value)} 
              label="Label Name" 
            />
        </Box>
        <Box>
          <Button 
            onClick={handleSearch}
            variant="contained"
            color="primary"
          >
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchGitHubComponent;
