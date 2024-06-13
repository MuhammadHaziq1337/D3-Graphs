
const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const imageUpload = document.getElementById('imageUpload');

dropArea.addEventListener('dragover', (event) => {
    event.stopPropagation();
    event.preventDefault();
    dropArea.style.borderColor = '#4A90E2';
}, false);

dropArea.addEventListener('dragleave', (event) => {
    event.stopPropagation();
    event.preventDefault();
    dropArea.style.borderColor = '#ddd';
}, false);

dropArea.addEventListener('drop', (event) => {
    event.stopPropagation();
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFiles(files);
}, false);

imageUpload.addEventListener('click', () => {
    fileElem.click();
}, false);

document.querySelectorAll('.editor input[type="range"]').forEach(input => {
    input.addEventListener('change', handleUpdate);
    input.addEventListener('mousemove', handleUpdate);
});

document.addEventListener('DOMContentLoaded', (event) => {
    const frameDuration = 70;
    const totalFrames = 83;
    const totalDuration = frameDuration * totalFrames;

    setTimeout(() => {
        document.getElementById('gif-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, totalDuration);
});

function handleUpdate() {
    const suffix = this.dataset.unit || '';
    document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
}

function handleFiles(files) {
  const file = files[0];
  const reader = new FileReader();

  document.getElementById('main-content').style.display = 'none';
  document.getElementById('gif-container').style.display = 'none';
  document.getElementById('second-gif-container').style.display = 'block';

  reader.onload = function(event) {
      const text = event.target.result;
      const matrix = parseAdjacencyMatrix(text);
      const directed = isDirected(matrix);

      if (!isConnected(matrix)) {
          alert("The graph is not connected. Please upload a connected graph.");
          document.getElementById('second-gif-container').style.display = 'none';
          document.getElementById('main-content').style.display = 'block';
      } else {
          localStorage.setItem('matrix', JSON.stringify(matrix)); // Store matrix data in localStorage
          setTimeout(() => {
              document.getElementById('second-gif-container').style.display = 'none';
              analyzeGraph(matrix, directed);
          }, 5000);
      }
  };

  reader.readAsText(file);
}


function parseAdjacencyMatrix(text) {
    return text.trim().split('\n').map(row => row.trim().split(/\s+/).map(Number));
}

function isConnected(matrix) {
    let visited = new Array(matrix.length).fill(false);
    function dfs(node) {
        visited[node] = true;
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[node][i] === 1 && !visited[i]) {
                dfs(i);
            }
        }
    }
    dfs(0);
    return visited.every(v => v);
}

function isDirected(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = i + 1; j < matrix[i].length; j++) {
            if (matrix[i][j] !== matrix[j][i]) {
                return true;
            }
        }
    }
    return false;
}

function hasCycle(matrix, directed = false) {
    let visited = new Array(matrix.length).fill(false);
    let recStack = new Array(matrix.length).fill(false);

    function dfsUndirected(node, parent) {
        visited[node] = true;
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[node][i] !== 1) continue;
            if (!visited[i]) {
                if (dfsUndirected(i, node)) return true;
            } else if (i !== parent) {
                return true;
            }
        }
        return false;
    }

    function dfsDirected(node) {
        visited[node] = true;
        recStack[node] = true;
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[node][i] !== 1) continue;
            if (!visited[i] && dfsDirected(i)) {
                return true;
            } else if (recStack[i]) {
                return true;
            }
        }
        recStack[node] = false;
        return false;
    }

    for (let i = 0; i < matrix.length; i++) {
        if (!visited[i]) {
            if (directed) {
                if (dfsDirected(i)) return true;
            } else {
                if (dfsUndirected(i, -1)) return true;
            }
        }
    }
    return false;
}

function isDAG(matrix) {
    return isDirected(matrix) && !hasCycle(matrix, true);
}

function isTree(matrix) {
    if (isDirected(matrix)) return false;
    let edgeCount = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = i; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) edgeCount++;
        }
    }
    return !hasCycle(matrix, false) && edgeCount === matrix.length - 1;
}


function convertToHierarchy(adjacencyMatrix, rootNodeIndex) {
    function buildTree(nodeIndex, nodes, ancestors) {
      let children = [];
      nodes[nodeIndex].visited = true; 
      adjacencyMatrix[nodeIndex].forEach((edge, index) => {
        if (edge === 1 && index !== nodeIndex && !nodes[index].visited) {
          if (ancestors.has(index)) {
           
            throw new Error('The graph is not a tree, it contains a cycle!');
          }
          children.push(buildTree(index, nodes, new Set([...ancestors, nodeIndex])));
        }
      });
     
      return children.length > 0
        ? { name: `Node ${nodeIndex}`, children }
        : { name: `Node ${nodeIndex}`, value: 1 };
    }
  
  
    let nodes = adjacencyMatrix.map(() => ({ visited: false }));
  
   
    return buildTree(rootNodeIndex, nodes, new Set([rootNodeIndex]));
  }
  
  function longestPathLayering(adjacencyMatrix) {
    // First, find all the sinks in the graph (nodes with no outgoing edges)
    const sinks = adjacencyMatrix.map((row, i) => {
      const isSink = !row.some((value, j) => value === 1 && i !== j);
      return isSink ? i : null;
    }).filter(index => index !== null);
  
    // Initialize the layer assignment with -1 for all nodes
    const layers = new Array(adjacencyMatrix.length).fill(-1);
  
    // A utility function to recursively assign layers
    function assignLayer(node, layer) {
      // If the node is already assigned to a layer, return
      if (layers[node] !== -1) return;
  
      // Assign the current node to the current layer
      layers[node] = layer;
  
      // Recurse for all nodes that point to the current node
      adjacencyMatrix.forEach((row, i) => {
        if (row[node] === 1 && i !== node) {
          assignLayer(i, layer + 1); // Assign nodes to the next layer
        }
      });
    }
  
    // Assign layers starting from the sinks
    sinks.forEach(sink => {
      assignLayer(sink, 0); // Sinks are assigned to layer 0
    });
  
    // If there are nodes not assigned to any layer
    if (layers.some(layer => layer === -1)) {
      throw new Error('The graph is not a DAG or is disconnected.');
    }
  
    return layers;
  }


  function calculateBarycenters(adjacencyMatrix, layers) {
    const barycenters = adjacencyMatrix.map(() => -1);
    const layerIndices = [...new Set(layers)]; // Unique layer indices
  
   
    for (let currentLayerIndex = 1; currentLayerIndex < layerIndices.length; currentLayerIndex++) {
      const currentLayer = layerIndices[currentLayerIndex];
      const nodesInCurrentLayer = layers.map((layer, index) => layer === currentLayer ? index : -1).filter(index => index !== -1);
  
      // Calculate the barycenter for each node in the current layer
      nodesInCurrentLayer.forEach(nodeIndex => {
        let sumPositions = 0;
        let countPositions = 0;
        
        
        const previousLayer = layerIndices[currentLayerIndex - 1];
        const nodesInPreviousLayer = layers.map((layer, index) => layer === previousLayer ? index : -1).filter(index => index !== -1);
  
       
        nodesInPreviousLayer.forEach(prevNodeIndex => {
          if (adjacencyMatrix[prevNodeIndex][nodeIndex] === 1) {
            sumPositions += layers.indexOf(prevNodeIndex); 
            countPositions++;
          }
        });
  
        // Calculate the average position
        const averagePosition = countPositions > 0 ? sumPositions / countPositions : -1;
        barycenters[nodeIndex] = averagePosition;
      });
    }
  
    return barycenters;
  }
  
  function orderByBarycenter(adjacencyMatrix, layers) {
    const barycenters = calculateBarycenters(adjacencyMatrix, layers);
    
   
    const layerIndices = [...new Set(layers)];
    const orderedLayers = layerIndices.map(layer => {
      return layers
        .map((nodeLayer, index) => nodeLayer === layer ? index : -1)
        .filter(index => index !== -1)
        .sort((a, b) => barycenters[a] - barycenters[b]);
    });
  
    return orderedLayers;
  }


  function assignXCoordinates(orderedLayers, layerWidth) {
    let xCoordinates = {};
  
   
    const nodeSpacing = layerWidth / (Math.max(...orderedLayers.map(layer => layer.length)) + 1);
  
    orderedLayers.forEach((layer, layerIndex) => {
      // Calculate the starting x position for the first node in this layer
      let xPos = nodeSpacing;
  
      layer.forEach(nodeIndex => {
        xCoordinates[nodeIndex] = xPos;
        xPos += nodeSpacing;
      });
    });
  
    return xCoordinates;
  }
  
  function routeEdges(orderedLayers, adjacencyMatrix) {
    let edgePaths = [];
  
    orderedLayers.forEach((layer, layerIndex) => {
      // If this is the last layer, no edges go out from here.
      if (layerIndex === orderedLayers.length - 1) return;
  
      const nextLayer = orderedLayers[layerIndex + 1];
  
      layer.forEach(nodeIndex => {
        const targets = adjacencyMatrix[nodeIndex]
          .map((edge, index) => edge === 1 ? index : -1)
          .filter(index => index !== -1);
  
        targets.forEach(targetIndex => {
          if (nextLayer.includes(targetIndex)) {
            
            edgePaths.push({ source: nodeIndex, target: targetIndex });
          }
        });
      });
    });
  
    return edgePaths;
  }
  

  function analyzeGraph(matrix, directed) {
    let graphType;
    let layouts;
    if (isDAG(matrix)) {
        graphType = "DAG";
        layouts = ["Sugiyama", "Radial Sugiyama"];

        const layers = longestPathLayering(matrix);
        const orderedLayers = orderByBarycenter(matrix, layers);
        const xCoordinates = assignXCoordinates(orderedLayers, 1000); 
        const edgePaths = routeEdges(orderedLayers, matrix);

        const sugiyamaData = {
            layers,
            orderedLayers,
            xCoordinates,
            edgePaths
        };
        localStorage.setItem('sugiyamaData', JSON.stringify(sugiyamaData));
    } else if (isTree(matrix)) {
        graphType = "Tree";
        layouts = ["Rheingold Tilford", "Icicle"];
        let hierarchy = convertToHierarchy(matrix, 0); 
        localStorage.setItem('hierarchy', JSON.stringify(hierarchy)); 
        
    } else {
        graphType = "General Graph";
        layouts = ["Grid", "Chord"];
    }
    window.location.href = `layouts.html?graphType=${graphType}&layouts=${layouts.join(',')}`;
}
 

  