import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import checkLabelForImage from './LabelImageComponent'

function NG({ nodes, links, width = 200, height = 100 ,onNodeClick }) {
  const ref = useRef();
  //Show the relationships between smart contracts
  const [showRelationship, setShowRelationship] = useState(false);


  //Set up bi-directional links
  links.forEach(link => {
    const reverseLink = links.find(l => l.source === link.target && l.target === link.source);
    if (reverseLink) {
      link.bidirectional = true;
      reverseLink.bidirectional = true;
    }
  });

  //Effect
  useEffect(() => {
    d3.select(ref.current).selectAll("*").remove();

    nodes.forEach(node => {
      if (!node.x) node.x = width / 2;
      if (!node.y) node.y = height / 2;
    });

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(15))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    for (let i = 0; i < 300; ++i) simulation.tick();

    const svg = d3.select(ref.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('font-family', 'sans-serif')
      .call(d3.zoom().scaleExtent([0.1, 10]).on("zoom", function(event) {
        g.attr("transform", event.transform);
      }));

    const g = svg.append("g");

    const defs = g.append("defs");
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999")
      .style("stroke","none");

    const link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke-width", d => Math.sqrt(d.value) / 2)
      .attr("marker-end", "url(#arrowhead)")
      .attr("fill", "none")
      .attr("d", d => {
        if (d.bidirectional) {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dr = Math.sqrt(dx * dx + dy * dy) * 2; 
          return `M ${d.source.x},${d.source.y} A ${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        } else {
          return `M ${d.source.x},${d.source.y} L ${d.target.x},${d.target.y}`;
        }
      });

    const nodeRadius = 2

    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.05)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", nodeRadius)
      .attr("fill", "#69b3a2")
      .on("click", function(event, d) {
        //console.log("Contract Address:", d.id);
        const linkedNodes = links.filter(link => link.source.id === d.id || link.target.id === d.id)
                                .map(link => link.source.id === d.id ? link.target.id : link.source.id);
        //console.log("Connected Nodes:", linkedNodes);
        
        onNodeClick(d.id);
      });

    node.append("title").text(d => d.id);

    node.each(function(d, i) {
  const imagePath = checkLabelForImage(d.label);
  if (imagePath) {
    d3.select(this.parentNode)
      .append('image')
      .attr('xlink:href', imagePath)
      .attr('x', d.x - nodeRadius) 
      .attr('y', d.y - nodeRadius)
      .attr('width', nodeRadius * 2)
      .attr('height', nodeRadius * 2)
      .attr('pointer-events', 'none'); 
  }
});

const nodeText = g.append("g")
  .selectAll("text")
  .data(nodes)
  .join("text")
  .attr("dy", "0.35em")
  .attr("font-size", "2px")
  .attr("fill", "white")
  .attr("text-anchor", "middle")
  .text(d => {
    const address = d.id ? `${d.id.substring(0, 7)}... ` : '';
    const label = d.label && d.label.length ? `(${d.label.join(', ')})` : '';
    return address + label;
  });


    const linkText = g.append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .attr("font-size", "2px")
      .attr("fill", "#000")
      .attr("text-anchor", "middle");

    simulation.on("tick", () => {
      link.attr("d", d => {
        if (d.bidirectional) {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dr = Math.sqrt(dx * dx + dy * dy) * 2;
          return `M ${d.source.x},${d.source.y} A ${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        } else {
          return `M ${d.source.x},${d.source.y} L ${d.target.x},${d.target.y}`;
        }
      });

    node.attr("cx", d => d.x).attr("cy", d => d.y);
    nodeText.attr("x", d => d.x + 10).attr("y", d => d.y);

    if (showRelationship) {
      linkText
      .attr("x", d => {
        if (d.bidirectional) {
          return (d.source.x + d.target.x) / 2;
        } else {
          return (d.source.x + d.target.x) / 2;
        }
      })
      .attr("y", d => {
        if (d.bidirectional) {
          const midPoint = (d.source.y + d.target.y) / 2;
          return midPoint - 5; 
        } else {
          return (d.source.y + d.target.y) / 2;
        }
      })
      .text(d => d.name);
    } else {
      linkText.text('');
    }
    });

    return () => simulation.stop();
  }, [nodes, links, showRelationship]);

  return (
    <div>
      <button onClick={() => setShowRelationship(!showRelationship)}>
        Display Relationship
      </button>

      <svg ref={ref} style={{ width: '100%', height: '100%' }}></svg>
    </div>
  );
}

export default NG;
