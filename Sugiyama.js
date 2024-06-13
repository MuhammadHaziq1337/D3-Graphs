document.addEventListener('DOMContentLoaded', () => {
    const storedData = localStorage.getItem('sugiyamaData');
    if (storedData) {
        const sugiyamaData = JSON.parse(storedData);

        const svgWidth = 1440; 
        const svgHeight = 800;
        const margin = { top: 450, right: 120, bottom: 20, left: 120 }; 

        const width = svgWidth - margin.right - margin.left;
        const height = svgHeight - margin.top - margin.bottom;

        const svg = d3.select('#graph-display').append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

     
        function determineNodeType(index) {
            const hasChildren = sugiyamaData.edgePaths.some(edge => edge.source === index);
            const hasParent = sugiyamaData.edgePaths.some(edge => edge.target === index);
            if (!hasParent) return 'root'; 
            if (hasChildren) return 'parent'; 
            return 'leaf'; 
        }

      
        function getNodeColor(index) {
            const nodeType = determineNodeType(index);
            if (nodeType === 'root') return 'black';
            if (nodeType === 'parent') return 'brown';
            return 'blue'; 
        }

      
        const rootLayerNum = Math.min(...sugiyamaData.layers);

        
        svg.selectAll('.node')
            .data(sugiyamaData.orderedLayers.flat())
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', 20) 
            .attr('cx', d => sugiyamaData.xCoordinates[d])
            .attr('cy', d => (rootLayerNum - sugiyamaData.layers[d]) * 100) 
            .style('fill', d => getNodeColor(d)); 
       
        svg.selectAll('.edge')
            .data(sugiyamaData.edgePaths)
            .enter().append('line')
            .attr('class', 'edge')
            .attr('x1', d => sugiyamaData.xCoordinates[d.source])
            .attr('y1', d => (rootLayerNum - sugiyamaData.layers[d.source]) * 100)
            .attr('x2', d => sugiyamaData.xCoordinates[d.target])
            .attr('y2', d => (rootLayerNum - sugiyamaData.layers[d.target]) * 100)
            .attr('stroke', 'black') 
            .attr('stroke-width', 2); 
    } else {
        console.error('No Sugiyama data found in localStorage.');
    }
});
