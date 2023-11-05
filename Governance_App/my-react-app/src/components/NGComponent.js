import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { zoom } from 'd3';
import checkLabelForImage from './LabelImageComponent';




const NG = ({ data , onNodeClick }) => {
  const svgRef = useRef(null);
   const [prevNodeCount, setPrevNodeCount] = useState(null);


  const calculateIncomingEdges = () => {
    const counts = {};
    data.links.forEach(link => {
      if (!counts[link.target.id]) counts[link.target.id] = 0;
      counts[link.target.id] += 1;
    });
    return counts;
  };


  function adjustLine(source, target, radius) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const angle = Math.atan2(dy, dx);
  const x = target.x - Math.cos(angle) * radius;
  const y = target.y - Math.sin(angle) * radius;
  return [x, y];
}

const handleNodeDoubleClick = (event, node) => {
  console.log("Node double clicked", node);
  // Add your double click logic here
};



  const handleNodeClick = (node) => {
    console.log("Node clicked", node);
    let address = node.id
    if (address) {
      onNodeClick(address);
      console.log(address)
    }
  };

  
   useEffect(() => {
    if (data && data.nodes && data.links) {
       const currentNodeCount = data.nodes.length;
      if (prevNodeCount !== currentNodeCount) {
        drawGraph();
        setPrevNodeCount(currentNodeCount);
      }
     }
  }, [data]);

  const drawGraph = () => {
  const svgElement = svgRef.current;
  const width = svgElement.clientWidth;
  const height = svgElement.clientHeight;
  const svg = d3.select(svgElement);
  

  svg.selectAll("*").remove(); 

  const graphGroup = svg.append("g")
    .attr("class", "graph-group");


 const zoomBehavior = zoom()
    .on("zoom", (event) => {
      graphGroup.attr("transform", event.transform);
    });

  svg.call(zoomBehavior);

  // Define arrowhead markers
const defs = svg.append('defs');
defs.append('marker')
  .attr('id', 'arrowhead')
  .attr('viewBox', '-0 -5 10 10')
  .attr('refY', 0)
  .attr('orient', 'auto')
  .attr('markerWidth', 10)
  .attr('markerHeight', 3)
  .attr('xoverflow', 'visible')
  .append('svg:path')
  .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
  .attr("stroke", "#00008B") 
  .attr('fill-opacity', 0.2)
  .style('stroke', 'none');

const filter = defs.append('filter')
  .attr('id', 'glow')
  .attr('x', '-50%')
  .attr('y', '-50%')
  .attr('width', '200%')
  .attr('height', '200%');

filter.append('feGaussianBlur')
  .attr('stdDeviation', '5')
  .attr('result', 'coloredBlur');

const feMerge = filter.append('feMerge');
feMerge.append('feMergeNode').attr('in', 'coloredBlur');
feMerge.append('feMergeNode').attr('in', 'SourceGraphic');


  //SIM
  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(25).strength(0.1))
    .force("charge", d3.forceManyBody().strength(-6000))
    .force("center", d3.forceCenter(width / 2, height / 2));

const link = graphGroup.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(data.links)
  .enter().append("line")
  .attr("stroke-width", 5) 
  .attr("stroke", "#00008B") 
  .attr("stroke-opacity", 0.2)

  .attr('marker-end','url(#arrowhead)');
    
    //Edge Size
     const incomingEdges = calculateIncomingEdges();

     //Nodes
  const node = graphGroup.append("g")
    .selectAll("circle")
    .data(data.nodes)
    .enter().append("circle")
    .attr("r", d => 10 * (1 + (incomingEdges[d.id] || 0))) 
    .attr("fill-opacity", 0.3) 
    .attr("stroke", "#000000")
    .attr("stroke-width", "2px")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .each(function(d) {
      d.radius = 10 * (1 + (incomingEdges[d.id] || 0)); 
    })
    .on("click", (event, d) => handleNodeClick(d))
    .on("dblclick", handleNodeDoubleClick)
    .attr('filter', 'url(#glow)'); 


  // labels
const labels = graphGroup.append("g")
  .attr("class", "labels")
  .selectAll("text")
  .data(data.nodes)
  .enter().append("text")
  .raise()
  .text(d => {
    // Check if d.label is an array and is not empty
    if (Array.isArray(d.label) && d.label.length > 0) {
      return d.label.join(', ');
    }
    // Check if d.label is a non-empty string
    else if (typeof d.label === 'string' && d.label.trim() !== '') {
      return d.label;
    }
    // If d.label is undefined, an empty array, or an empty string, return an empty string
    else {
      return '';
    }
  })
  .attr("fill", "white")
  .attr("x", 6)
  .attr("y", 3);


//images
    const images = graphGroup.append("g")
      .selectAll("image")
      .data(data.nodes)
      .enter()
      .append("image")
      .attr("xlink:href", d => checkLabelForImage(d.label))
      .attr("width", 20) // Set image size
      .attr("height", 20)
      .attr("x", d => d.x - 10) // Adjust the x and y to center the image
      .attr("y", d => d.y - 10)
       .style("pointer-events", "none"); 

  // Add address
  const address = graphGroup.append("g")
    .attr("class", "address")
    .selectAll("text")
    .data(data.nodes)
    .enter().append("text")    
    .text(d => `${d.id.slice(0, 6)}...`)
    .attr("fill", "white")
    .attr("x", 6)
    .attr("y", 3);

  simulation.on("tick", () => {
    link.each(function(d) {
      const targetRadius = 10 * (1 + (incomingEdges[d.target.id] || 0));
      const sourceRadius = 10 * (1 + (incomingEdges[d.source.id] || 0));
      
      const arrowLength = 15; //For arrowhead
      const [x2, y2] = adjustLine(d.source, d.target, targetRadius + arrowLength);
      const [x1, y1] = adjustLine(d.target, d.source, sourceRadius);
      
      d3.select(this)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2);
    });

  // node pos
  node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

  // Update address pos
  address
    .attr("x", d => d.x)
    .attr("y", d => d.y);

  labels
    .attr("x", d => d.x)
    .attr("y", d => d.y - 20);

   images
    .attr("width", d => d.radius * 2)  
    .attr("height", d => d.radius * 2) 
    .attr("x", d => d.x - d.radius)
    .attr("y", d => d.y - d.radius);
});


  };

  return (
    <div style={{ width: '100%', height: '800px' }}>
  <svg ref={svgRef} style={{ width: '100%', height: '100%' }}>
  </svg>
</div>


  );
};

export default NG;
