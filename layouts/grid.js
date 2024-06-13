
function calculateDegrees(matrix) {
  return matrix.map(row => row.reduce((sum, cell) => sum + cell, 0));
}

function sortNodesByDegree(degrees) {
  return degrees.map((degree, index) => ({ index, degree })).sort((a, b) => b.degree - a.degree);
}

function createGridNodesAndLinks(matrix, sortedNodes) {
  const nodes = sortedNodes.map((node, index) => ({ ...node, id: index }));
  const links = [];
  matrix.forEach((row, sourceIndex) => {
      row.forEach((cell, targetIndex) => {
          if (cell !== 0) {
              links.push({ source: sortedNodes[sourceIndex].index, target: sortedNodes[targetIndex].index });
          }
      });
  });
  drawGridLayout(nodes, links); 
}
function createGrid() {
const matrixData = localStorage.getItem('matrix');
const matrix = JSON.parse(matrixData);
if (matrix) {
    const degrees = calculateDegrees(matrix);
    const sortedNodes = sortNodesByDegree(degrees);
    createGridNodesAndLinks(matrix, sortedNodes);
} else {
    console.error('Matrix data not found.');
}
}

document.addEventListener('DOMContentLoaded', () => {
 
  const matrixData = localStorage.getItem('matrix');
  const matrix = JSON.parse(matrixData);

  if (matrix) {
      const degrees = calculateDegrees(matrix);
      const sortedNodes = sortNodesByDegree(degrees);
      const nodesAndLinks = createGridNodesAndLinks(matrix, sortedNodes);
      drawGridLayout(nodesAndLinks.nodes, nodesAndLinks.links);
  } else {
      console.error('Matrix data not found.');
  }
});


function drawGridLayout(nodes, links) {
  const width = 800;  
  const height = 800; 
  const colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, d3.max(nodes, d => d.degree)]);
   const transitionDuration = 750;
  const zoom = d3.zoom()
    .scaleExtent([1 / 2, 4])
    .on('zoom', (event) => svg.attr('transform', event.transform));

    const svg = d3.select('#graph-display')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .append('svg')
    .attr('width', width)
    .attr('height', height);



  const numCols = Math.ceil(Math.sqrt(nodes.length));
  const cellSize = Math.min(width, height) / numCols;

 
  nodes.forEach((node, index) => {
    node.x = (index % numCols) * cellSize + cellSize / 2;
    node.y = Math.floor(index / numCols) * cellSize + cellSize / 2;
  });

  
  links.forEach(link => {
    svg.append('line')
      .attr('x1', nodes.find(n => n.id === link.source).x)
      .attr('y1', nodes.find(n => n.id === link.source).y)
      .attr('x2', nodes.find(n => n.id === link.target).x)
      .attr('y2', nodes.find(n => n.id === link.target).y)
      .attr('stroke', 'black')
      .attr('stroke-width', 2);
  });


  const nodeElements = svg.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
      .attr('cx', node => node.x)
      .attr('cy', node => node.y)
      .attr('r', 16) // Radius of nodes
      .attr('fill', node => colorScale(node.degree))
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 20).attr('stroke', 'black'); 
       
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 16).attr('stroke', 'none'); 
      });

 
  svg.selectAll('text')
    .data(nodes)
    .enter().append('text')
      .attr('x', node => node.x)
      .attr('y', node => node.y)
      .text(node => node.id) 
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle');
}
