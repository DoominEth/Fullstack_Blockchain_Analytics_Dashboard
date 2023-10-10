
import React from 'react';

const LabelComponent = ({ label }) => {
  return (
    <div style={{ border: '1px solid gray', padding: '5px', margin: '5px', borderRadius: '25px' }}>
      {label}
    </div>
  );
};

export default LabelComponent;
