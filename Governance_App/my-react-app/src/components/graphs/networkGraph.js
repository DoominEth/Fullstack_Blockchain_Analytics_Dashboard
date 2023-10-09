import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function NetworkGraph({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    // Convert the data object to an array
    const dataArray = Object.values(data);

    const svg = d3.select(svgRef.current)
      .attr('width', 800)
      .attr('height', 600);

    const links = dataArray.flatMap(d => d.reference_contracts.map(ref => ({
      source: d.contract_address,
      target: ref.contract_address
    })));

    const nodes = dataArray.map(d => ({
      id: d.contract_address,
      label: d.label.join(', ')
    })).concat(
      dataArray.flatMap(d => d.reference_contracts.map(ref => ({
        id: ref.contract_address,
        label: ref.name
      })))
    );

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#000');

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 5)
      .attr('fill', '#69b3a2');

    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text(d => `${d.id} (${d.label})`)
      .attr('font-size', '10px')
      .attr('dx', 15)
      .attr('dy', 4);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(400, 300));

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
    
  }, [data]);

  return <svg ref={svgRef}></svg>;
}

export default NetworkGraph;
