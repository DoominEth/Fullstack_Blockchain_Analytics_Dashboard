import React, { useRef, useEffect } from 'react';
import { select } from 'd3-selection';

function NetworkDiagram({ data }) {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!data || !svgRef.current) return;

        const svg = select(svgRef.current);
   const width = svgRef.current.parentElement.clientWidth; 

        // Clear the previous SVG content
        svg.selectAll("*").remove();

        const rectWidth = width * 0.1 ;
        const rectHeight = 30;
        const fontSize = width * 0.01;
        const nodeData = data[0];
        const abbreviatedAddress = nodeData.contract_address.slice(0, 8) + "...";
        const labels = nodeData.label;

        // Rectangle
        svg.append("rect")
            .attr("x", 10)
            .attr("y", 80)
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            .attr("data-address", nodeData.contract_address);

        // Text
    svg.append("text")
        .attr("x", 10 + rectWidth / 2)
        .attr("y", 80 + fontSize) 
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("font-size", fontSize + "px")
        .style("font-weight", "bold")
        .text(abbreviatedAddress);

    // Render labels below the contract address
    labels.forEach((label, idx) => {
        svg.append("text")
            .attr("x", 10 + rectWidth / 2)
            // We start rendering the labels immediately below the abbreviated address
            .attr("y", 80 + (idx + 1) * fontSize + fontSize) 
            .attr("text-anchor", "middle")
            .style("font-size", fontSize + "px")
            .text(label);
    });

    }, [data]);

    return <svg ref={svgRef} viewBox="0 0 1200 200"></svg>;
}

export default NetworkDiagram;
