document.addEventListener('DOMContentLoaded', () => {
  const storedHierarchy = localStorage.getItem('hierarchy');
  if (storedHierarchy) {
      const hierarchyData = JSON.parse(storedHierarchy);

      const root = d3.hierarchy(hierarchyData);
      const width = 960;
      const height = 700; 

      const svg = d3.select('#graph-display').append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(300,20)'); 

      const treeLayout = d3.tree().size([height - 100, width - 300]); 
      treeLayout(root);

      // Define highlight color
      const highlightColor = '#f77'; 

      const handleNodeClick = (event, clickedNode) => {
          // Reset all nodes to the default color first
          svg.selectAll('.node circle').attr('fill', 'red');

          // Check if the clicked node has children and highlight them
          if (clickedNode.children) {
              clickedNode.children.forEach(child => {
                  svg.selectAll('.node circle')
                      .filter(d => d === child)
                      .attr('fill', highlightColor);
              });
          }

          // Highlight the clicked node itself
          svg.selectAll('.node circle')
              .filter(d => d === clickedNode)
              .attr('fill', highlightColor);
      };

      // Drawing links
      const links = svg.selectAll('.link')
          .data(root.links())
          .enter().append('path')
          .attr('class', 'link')
          .attr('d', d3.linkVertical()
              .x(d => d.x)
              .y(d => d.y)
          );

      // Drawing nodes
      const nodes = svg.selectAll('.node')
          .data(root.descendants())
          .enter().append('g')
          .attr('class', d => "node" + (d.children ? " node--internal" : " node--leaf"))
          .attr('transform', d => `translate(${d.x},${d.y})`)
          .on('click', handleNodeClick);

      nodes.append('circle')
          .attr('r', 10)
          .attr('fill', 'white');

      nodes.append('text')
          .attr('dy', '0.31em')
          .attr('x', d => d.children ? -15 : 15)
          .style('text-anchor', d => d.children ? 'end' : 'start')
          .text(d => d.data.name);

      nodes.append('title')
          .text(d => d.data.name);
  } else {
      console.error('No hierarchical data found in localStorage.');
  }
});
