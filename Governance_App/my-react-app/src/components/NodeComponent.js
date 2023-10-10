
import React from 'react';
import LabelComponent from './LabelComponent';

const NodeComponent = ({ data }) => {
  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '5px' }}>
      {data.contract_address}
      {data.label && data.label.map((l, index) => (
        <LabelComponent key={index} label={l} />
      ))}
    </div>
  );
};

export default NodeComponent;
