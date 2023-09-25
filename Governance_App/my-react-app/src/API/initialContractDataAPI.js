// api.js
export const buildSmartContractData = async (startBlock, endBlock, contractAddress) => {
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
