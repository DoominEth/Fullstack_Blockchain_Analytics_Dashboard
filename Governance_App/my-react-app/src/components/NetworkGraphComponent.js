import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ContractGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Extract nodes and links
    const nodes = data.map(d => ({ id: d.contract_address, label: d.label }));
    const links = [];

    data.forEach(d => {
      d.reference_contracts.forEach(ref => {
        if (nodes.find(n => n.id === ref.address)) {
          links.push({
            source: d.contract_address,
            target: ref.address,
            name: ref.name
          });
        }
      });
    });

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(300, 200));

    // Render links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "black");

    // Render nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 10)
      .attr("fill", "gray")
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded));

    node.append("title")
      .text(d => d.id);

    simulation.nodes(nodes).on("tick", ticked);
    simulation.force("link").links(links);

    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }

    function dragStarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragEnded(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [data]);

  return (
    <svg ref={svgRef} width={600} height={400} />
  );
};

export default ContractGraph;
