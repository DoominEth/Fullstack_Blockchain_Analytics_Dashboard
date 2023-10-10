import React from 'react';
import { TextField, Box } from '@mui/material';

const BlockComponent = ({ label, value, onChange }) => {
  return (
    <Box style={{ margin: '10px', flex: 1 }}>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        variant="outlined"
        size="small" 
        type="number"
      />
    </Box>
  );
};

export default BlockComponent;
