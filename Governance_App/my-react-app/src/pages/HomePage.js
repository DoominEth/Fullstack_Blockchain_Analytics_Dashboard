import React, { useState, useEffect } from 'react';
import CardWrapper from '../components/CardWrapper';
import { Grid, Container } from '@mui/material';
import NG from '../components/NGComponent';
import SmartContractTab from './SmartContractTab';

import useProcessedDatasets from '../components/processNetworkData';
import curveNetworkData from '../data/Networks/CurveNetwork.json';
import convexNetworkData from '../data/Networks/ConvexNetwork.json';
import ParsedNetworkData from '../data/Networks/ParsedNetwork.json'


import TestComponent from '../components/TextBoxComponent';



//Node data to be prepared for the Node graph
const transformData = (data, commonNodes = []) => {
  const nodes = commonNodes.map(node => ({ id: node.contract_address, label: node.label }));
  const links = [];

  data.forEach(contract => {
    if (contract.contract_address) {
      if (!commonNodes.find(cn => cn.contract_address === contract.contract_address)) {
        nodes.push({ id: contract.contract_address, label: contract.label });
      }

      contract.reference_contracts.forEach(reference => {
        links.push({
          source: contract.contract_address,
          target: reference.address,
          name: reference.name,
          value: 1
        });
      }); 
    }
  });

  return { nodes, links };
};


function HomePage({ data, test }) {
  const [selectedNode, setSelectedNode] = useState(null);

  
  useEffect(() => {
    console.log('Selected Node:', selectedNode);
  }, [selectedNode]);

  const isDataAvailable = data && data.graphData1 && data.graphData2;
  const dataSource = test ? ParsedNetworkData : isDataAvailable ? data.graphData1 : null;
  const transformedData = dataSource ? transformData(dataSource) : null;

  if (!transformedData) {
    return 'Data not available'; //place holder
  }

  return (
    <Container fixed style={{ display: 'flex' }}>

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={9}>
          <CardWrapper title="Network Diagram">
            {transformedData && <NG data={transformedData} onNodeClick={setSelectedNode} />}
            {/* <NG nodes={transformedData.nodes} links={transformedData.links} onNodeClick={setSelectedNode} /> */}{/*Old way of doing Node graph*/}
          </CardWrapper>
        </Grid>
        <Grid item xs={3}>
          <CardWrapper title="Information">
            <SmartContractTab contractData={selectedNode ? { id: selectedNode } : {}} />
          </CardWrapper>
        </Grid>
        <Grid item xs={9}>
          {/* ...  */}
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomePage;
