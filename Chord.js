document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the matrix from localStorage
    const matrixData = localStorage.getItem('matrix');
    const matrix = JSON.parse(matrixData);
  
    if (matrix) {
      drawChordDiagram(matrix);
    } else {
      console.error('Matrix data not found.');
    }
  });
  
  function drawChordDiagram(matrix) {
    const width = 500;
    const height = 500;
    const innerRadius = Math.min(width, height) * 0.5 - 100;
    const outerRadius = innerRadius + 10;
  
    const svg = d3.select('#graph-display').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
    const chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending);
  
    const chords = chord(matrix);
  
    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
  
    const ribbon = d3.ribbon()
        .radius(innerRadius);
  
    // Define the color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Draw the arcs (node)
    svg.datum(chords)
      .selectAll('g')
      .data(d => d.groups)
      .enter().append('g')
      .append('path')
      .style('fill', d => color(d.index))
      .style('stroke', d => d3.rgb(color(d.index)).darker())
      .attr('d', arc);
  
    // Add node labels
    svg.selectAll('g')
      .append('text')
      .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr('dy', '.35em')
      .attr('class', 'node-label')
      .attr('transform', d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 5})
        ${d.angle > Math.PI ? 'rotate(180)' : ''}
      `)
      .style('text-anchor', d => d.angle > Math.PI ? 'end' : null)
      .text(d => `Node ${d.index}`) // Replace with actual labels if available
      .style('pointer-events', 'none');
  
    // Draw the chords (links)
    svg.selectAll('path.chord')
      .data(d => d)
      .enter().append('path')
      .attr('class', 'chord')
      .style('fill', d => color(d.source.index))
      .style('stroke', d => d3.rgb(color(d.source.index)).darker())
      .attr('d', ribbon);
  }
  