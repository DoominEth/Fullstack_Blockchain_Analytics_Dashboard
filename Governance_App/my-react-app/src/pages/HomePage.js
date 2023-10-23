import React, { useState, useEffect } from 'react';
import CardWrapper from '../components/CardWrapper';
import { Grid, Container, Box } from '@mui/material';
import NG from '../components/NGComponent';
import NodeComponent from '../components/NodeComponent'
import SmartContractTab from './SmartContractTab'



//Node data
const transformData = (data) => {
  const nodes = [];
  const links = [];

  data.forEach(contract => {
    if (contract.contract_address) {
      nodes.push({ id: contract.contract_address , label: contract.label });

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

function HomePage({ data }) {
  const { graphData1, graphData2 } = data || {};
  const isDataAvailable = data && graphData1 && graphData2;
  const [selectedNode, setSelectedNode] = useState(null);


    useEffect(() => {
        console.log('Selected Node:', selectedNode);
    }, [selectedNode]);

  if (!isDataAvailable) {
    return 0
  }

  const transformedData = transformData(graphData1);

  return (
  <Container fixed style={{  display: 'flex'}}>
       <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={9}>
          <CardWrapper title="Network Diagram">
            <NG nodes={transformedData.nodes} links={transformedData.links} onNodeClick={setSelectedNode}/>
          </CardWrapper>
        </Grid>
          <Grid item xs={3}>
            <CardWrapper title="Information">
            <SmartContractTab contractData={selectedNode ? { id: selectedNode } : {}} />
          </CardWrapper>
        </Grid>
        <Grid item xs={9}>
    </Grid>

        
      </Grid>
    </Container>
  );
}


export default HomePage;