import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function NodeComponent({ nodeData, simulation }) {
  const displayAddress = nodeData.contract_address 
    ? nodeData.contract_address.substring(0, 7)
    : 'Unknown';

  return (
    <>
      <circle r={5} fill="#69b3a2" />
      <title>{nodeData.contract_address || 'Unknown'}</title>
      <text dy="0.35em" fontSize="2px" fill="white" textAnchor="middle">
        {displayAddress}...
        {nodeData.label && nodeData.label[0] ? `(${nodeData.label[0]})` : ''}
      </text>
    </>
  );
}


export default NodeComponent