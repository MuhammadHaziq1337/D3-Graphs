
import * as d3 from 'd3';

function getAlphabeticallySortedNodes(matrix) {
    
    return matrix.map((_, i) => String.fromCharCode(65 + i)); // Converts to A, B, C, etc.
}

function getChordData(matrix, sortedNodes) {
    // Assuming matrix is square and sortedNodes is an array of node labels
    const chordData = d3.chord()(matrix);

    // Sort groups (nodes) by the alphabetical order of their corresponding labels
    chordData.groups.sort((a, b) => sortedNodes[a.index].localeCompare(sortedNodes[b.index]));

    return chordData;
}

function renderChordDiagram(matrix) {
    const sortedNodes = getAlphabeticallySortedNodes(matrix);
    const chordData = getChordData(matrix, sortedNodes);
    const width = 600;  // Adjust as needed
    const height = 600; // Adjust as needed
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 30;

    const svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

    const chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending);

    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    const ribbon = d3.ribbon()
        .radius(innerRadius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Append the groups (nodes)
    const group = svg.append('g')
        .selectAll('g')
        .data(chord(matrix))
        .join('g');

    group.append('path')
        .attr('fill', d => color(d.index))
        .attr('stroke', d => d3.rgb(color(d.index)).darker())
        .attr('d', arc);

    // Append the chords (edges)
    svg.append('g')
        .attr('fill-opacity', 0.67)
        .selectAll('path')
        .data(chord(matrix).descendants())
        .join('path')
        .attr('d', ribbon)
        .attr('fill', d => color(d.target.index))
        .attr('stroke', d => d3.rgb(color(d.target.index)).darker());

    // Add labels to the groups (nodes)
    group.append('text')
        .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr('dy', '.35em')
        .attr('transform', d => `
            rotate(${(d.angle * 180 / Math.PI - 90)})
            translate(${outerRadius + 5})
            ${d.angle > Math.PI ? 'rotate(180)' : ''}
        `)
        .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
        .text(d => sortedNodes[d.index]);

    // Optional: Implement zoom & drag behavior
    // ...
}

export { renderChordDiagram };
