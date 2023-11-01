import { useMemo } from 'react';

const useProcessedDatasets = (bigList, smallList, newNodeAddress) => {
  return useMemo(() => {
    //Base governance ecosystem
    const smallListAddresses = new Set(smallList.map(item => item.contract_address));

    // Filter Meta gov list
    const filteredBigList = bigList.filter(contract => !smallListAddresses.has(contract.contract_address));

    // Update the reference contracts in the filtered big list
    const updatedBigList = filteredBigList.map(contract => {
      return {
        ...contract,
        reference_contracts: contract.reference_contracts.map(ref => {
          return smallListAddresses.has(ref.address) ? { ...ref, address: newNodeAddress } : ref;
        })
      };
    });

    // Create the "MetaGov" node with potentially updated reference contracts
    const curveNode = {
      contract_address: 'MetaGov',
      label: ['MetaGovernance'], // Add appropriate labels if needed
      reference_contracts: [] // Add any specific reference contracts if needed
    };

    // Append the "Curve" node to the end of the updated big list
    return [...updatedBigList, curveNode];
  }, [bigList, smallList, newNodeAddress]);
};

export default useProcessedDatasets;
