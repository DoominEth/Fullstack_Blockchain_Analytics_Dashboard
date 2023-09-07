import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { Card, CardContent, Typography } from '@mui/material';

function CardComponent({ apiEndpoint }) {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Clear previous SVG content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    axios.get(apiEndpoint)
      .then(response => {
        const fetchedData = JSON.parse(response.data.data);
        setData(fetchedData);

        const xScale = d3.scaleLinear().domain([0, 100]).range([50, 350]);
        const yScale = d3.scaleLinear().domain([0, 100]).range([350, 50]);

        // Axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
        svg.append('g').attr('transform', 'translate(0, 350)').call(xAxis);
        svg.append('g').attr('transform', 'translate(50, 0)').call(yAxis);

        svg.selectAll('circle')
          .data(fetchedData)
          .enter()
          .append('circle')
          .attr('cx', d => xScale(d.x))
          .attr('cy', d => yScale(d.y))
          .attr('r', 5);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [apiEndpoint]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          D3 Graph
        </Typography>
        <svg ref={svgRef} width="400" height="400"></svg>
      </CardContent>
    </Card>
  );
}

export default CardComponent;
