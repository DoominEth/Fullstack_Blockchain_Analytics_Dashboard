import React, { useState, useEffect } from 'react';
import PlotGraph from '../components/graphs/PlotGraph';
import CardWrapper from '../components/CardWrapper'
import { Grid } from '@mui/material';

function HomePage() {
  const [graphDimensions, setGraphDimensions] = useState({ width: 400, height: 400 });

const [fetchedData, setFetchedData] = useState(null); // State to store fetched data

  // This is where the useEffect code should be placed:
  useEffect(() => {
    const fetchData = async (datatype, start_block, end_block, contract_address) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/blockchain-data?datatype=${datatype}&start_block=${start_block}&end_block=${end_block}&contract_address=${contract_address}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Data:", data); // Log the data to the console
          setFetchedData(data); // Store the fetched data in state
          window.fetchedData = data; // Expose it globally
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Usage

    //17000000
    //16999995
    //17000025
    //17000030
    fetchData("transactions", 17000000, 17000025, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
  }, []); 


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
