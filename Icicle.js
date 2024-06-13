document.addEventListener('DOMContentLoaded', () => {
    // Fetch and parse the hierarchical data from localStorage
    const storedHierarchy = localStorage.getItem('hierarchy');
    if (!storedHierarchy) {
        console.error('No hierarchical data found in localStorage.');
        return;
    }

    const hierarchyData = JSON.parse(storedHierarchy);
    const root = d3.hierarchy(hierarchyData)
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value);

    // Dimensions and layout setup
    const width = 960;
    const height = 500;
    const partitionLayout = d3.partition()
        .size([width, height])
        .padding(1);
    partitionLayout(root);

    // SVG setup
    const svg = d3.select('#graph-display')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    // Color scales
    const colorScale = d3.scaleOrdinal(d3.schemeBlues[9]);
    const highlightColor = '#f77'; // Color for highlighting clicked nodes

    // Tooltip setup
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Click event handler
    const handleNodeClick = (event, clickedNode) => {
        svg.selectAll('.node rect')
            .attr('fill', d => {
                if (clickedNode === d) {
                    return highlightColor;
                } else if (clickedNode.descendants().includes(d)) {
                    return d3.color(highlightColor).darker(d.depth - clickedNode.depth);
                } else {
                    return colorScale(d.depth);
                }
            });
    };

    // Node setup
    const cell = svg
        .selectAll('.node')
        .data(root.descendants())
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x0},${d.y0})`)
        .on('click', handleNodeClick);

    cell.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => colorScale(d.depth));

    // Text labels
    cell.append('text')
        .attr('x', 4)
        .attr('y', d => (d.y1 - d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'start')
        .text(d => d.data.name)
        .style('fill', 'white');

    // Tooltip interactions
    cell.on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', .9);
        tooltip.html(`Name: ${d.data.name}<br>Value: ${d.value}`)
            .style('left', (event.pageX) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
    });
});
