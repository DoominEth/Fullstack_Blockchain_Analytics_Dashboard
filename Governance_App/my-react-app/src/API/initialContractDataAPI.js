// api.js
export const buildSmartContractData = async (contractAddress, startBlock, endBlock) => {
  const response = await fetch('http://localhost:3001/api/build-smart-contract-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      start_block: startBlock,
      end_block: endBlock,
      contract_address: contractAddress
    })
  });
  const data = await response.json();
  return data;
};


export const fetchHashLogEvents = async (contractAddress) => {
  const response = await fetch('http://localhost:3001/api/hash-log-events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contract_address: contractAddress
    })
  });
  const data = await response.json();
  return data;
};

export const fetchParsedLogEvents = async (contractAddress, startBlock, endBlock) => {
  const response = await fetch('http://localhost:3001/api/parse-log-events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start_block: startBlock,
      end_block: endBlock,
      contract_address: contractAddress,
    }),
  });
  const data = await response.json();
  return data;
};
