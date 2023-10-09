import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const TextBoxComponent = (props) => {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);

    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };

  return (
    <TextField
        size = 'small'
      value={text}
      onChange={handleChange}
      {...props}
    />
  );
};

export default TextBoxComponent;
