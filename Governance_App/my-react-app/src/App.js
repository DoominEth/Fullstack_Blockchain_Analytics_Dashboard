import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

function App() {
  const svgRef = useRef();

  useEffect(() => {
    // Fetch data from API
    axios.get('http://localhost:3001/api/data')  // Change to http://localhost:5000/api/data if not using Node.js backend
      .then(response => {
        const data = JSON.parse(response.data.data);

        // Create D3 graph
        const svg = d3.select(svgRef.current);
        const xScale = d3.scaleLinear().domain([0, 100]).range([0, 300]);
        const yScale = d3.scaleLinear().domain([0, 100]).range([300, 0]);

        svg.selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .attr('cx', d => xScale(d.x))
          .attr('cy', d => yScale(d.y))
          .attr('r', 5);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <svg ref={svgRef} width="300" height="300"></svg>
  );
}

export default App;
