import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, Typography } from '@mui/material';

function BarChartComponent({ data, width: outerWidth, height: outerHeight }) {
  const svgRef = useRef();

  const margin = { top: 20, right: 20, bottom: 80, left: 60 };
  const width = outerWidth - margin.left - margin.right;
  const height = outerHeight - margin.top - margin.bottom;

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const aggregatedData = {};
    data.forEach(d => {
      if (!aggregatedData[d.from_address]) {
        aggregatedData[d.from_address] = 0;
      }
      aggregatedData[d.from_address]++;
    });

    const dataArray = Object.keys(aggregatedData).map(key => ({ address: key, count: aggregatedData[key] }));
    const xScale = d3.scaleBand().domain(dataArray.map(d => d.address)).range([0, width]).padding(0.2);
    const yScale = d3.scaleLinear().domain([0, d3.max(dataArray, d => d.count)]).range([height, 0]);

    // Drawing bars on chartGroup
    chartGroup.selectAll("rect")
        .data(dataArray)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.address))
        .attr("y", d => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.count))
        .attr("fill", "blue");

    // Adding X-axis on chartGroup
    const xAxis = d3.axisBottom(xScale).tickSize(0);
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Adding y-axis on chartGroup
    const yAxis = d3.axisLeft(yScale);
    chartGroup.append("g").call(yAxis);

    // Adding X-axis label
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Address");

    // Adding Y-axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .text("Amount of transactions");

  }, [data, outerWidth, outerHeight]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Bar Chart
        </Typography>
        <svg ref={svgRef} width={outerWidth} height={outerHeight}></svg>
      </CardContent>
    </Card>
  );
}

export default BarChartComponent;
