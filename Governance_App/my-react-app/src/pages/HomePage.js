import React from 'react';
import PlotGraph from '../components/graphs/PlotGraph';
import CardWrapper from '../components/CardWrapper';
import { Grid, Container } from '@mui/material';
import BarChartComponent from '../components/graphs/barGraph.js';
import NetworkGraph from '../components/NetworkComponent';
//import NetworkGraph from '../components/NetworkGraphComponent';


function HomePage({ data }) {
  const { graphData1, graphData2 } = data || {};

  if (!data) {
    return <div>Loading data...</div>;
  }

  return (
    <Container maxWidth={true} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '15px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CardWrapper title="Network Diagram">
            <NetworkGraph data={graphData1} />
          </CardWrapper>
        </Grid>
        <Grid item xs={6}>
          <CardWrapper title="Network Diagram">
            <NetworkGraph data={graphData1} />
          </CardWrapper>
        </Grid>
        <Grid item xs={6}>
          <CardWrapper title="Network Diagram">
            <NetworkGraph data={graphData1} />
          </CardWrapper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomePage;
