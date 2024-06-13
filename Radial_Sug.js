document.addEventListener('DOMContentLoaded', () => {
    const storedData = localStorage.getItem('sugiyamaData');
    if (storedData) {
        const sugiyamaData = JSON.parse(storedData);

        const svgWidth = 1440;
        const svgHeight = 800;
        const radius = svgHeight / 2; 

        const svg = d3.select('#graph-display').append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${svgWidth / 2},${svgHeight / 2})`); 

    
        const angleScale = d3.scaleLinear()
            .domain([0, d3.max(sugiyamaData.layers)])
            .range([0, 2 * Math.PI]);

      
        const radiusScale = d3.scaleLinear()
            .domain([0, d3.max(sugiyamaData.layers)])
            .range([0, radius]);

       
        const calculateAngle = (layerIndex) => angleScale(layerIndex);

     
        const calculateRadius = (layer) => radiusScale(layer);

       
        svg.selectAll('.edge')
            .data(sugiyamaData.edgePaths)
            .enter().append('path')
            .attr('class', 'edge')
            .attr('d', d => {
                const startAngle = calculateAngle(sugiyamaData.layers[d.source]);
                const startRadius = calculateRadius(sugiyamaData.layers[d.source]);
                const endAngle = calculateAngle(sugiyamaData.layers[d.target]);
                const endRadius = calculateRadius(sugiyamaData.layers[d.target]);
                
              
                const startX = startRadius * Math.cos(startAngle);
                const startY = startRadius * Math.sin(startAngle);
                const endX = endRadius * Math.cos(endAngle);
                const endY = endRadius * Math.sin(endAngle);

                return `M${startX},${startY} L${endX},${endY}`;
            })
            .attr('fill', 'none')
            .attr('stroke', '#333')
            .attr('stroke-width', 1.5);

      
        svg.selectAll('.node')
            .data(sugiyamaData.orderedLayers.flat())
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', 10)
            .attr('cx', d => calculateRadius(sugiyamaData.layers[d]) * Math.cos(calculateAngle(sugiyamaData.layers[d])))
            .attr('cy', d => calculateRadius(sugiyamaData.layers[d]) * Math.sin(calculateAngle(sugiyamaData.layers[d])))
            .style('fill', d => getNodeColor(d));
    } else {
        console.error('No Sugiyama data found in localStorage.');
    }
});
