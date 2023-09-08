import React, { useState } from 'react';
import PlotGraph from '../components/graphs/PlotGraph';
import CardWrapper from '../components/CardWrapper'
import { Grid } from '@mui/material';

function HomePage() {
  const [graphDimensions, setGraphDimensions] = useState({ width: 400, height: 400 });

  return (
    <div>
      <h1>Home Page</h1>
      <Grid container spacing={3}> {/* spacing={3} adds a gap between the grid items */}
        <Grid item xs={12} sm={6} md={4}>
          <CardWrapper title="Graph 1">
            <PlotGraph 
              apiEndpoint="http://localhost:3001/api/data" 
              width={graphDimensions.width} 
              height={graphDimensions.height} 
            />
          </CardWrapper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CardWrapper title="Graph 2">
            <PlotGraph 
              apiEndpoint="http://localhost:5000/api/data" 
              width={graphDimensions.width} 
              height={graphDimensions.height} 
            />
          </CardWrapper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CardWrapper title="Graph 3">
            <PlotGraph 
              apiEndpoint="http://localhost:5000/api/data" 
              width={graphDimensions.width} 
              height={graphDimensions.height} 
            />
          </CardWrapper>
        </Grid>
                <Grid item xs={12} sm={6} md={4}>
          <CardWrapper title="Graph 3">
            <PlotGraph 
              apiEndpoint="http://localhost:5000/api/data" 
              width={graphDimensions.width} 
              height={graphDimensions.height} 
            />
          </CardWrapper>
        </Grid>
      </Grid>

    </div>
  );
}
export default HomePage;
