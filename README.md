# Interactive Graph Visualizations with D3

## Overview

This project provides interactive graph visualizations using D3.js. Users can upload their own graph data files, which are then classified into Directed Acyclic Graphs (DAGs), Trees, or General Graphs. Based on the graph type, different layout options are available for visualization:

- **DAGs:** Sugiyama, Radial Sugiyama
- **Trees:** Rheingold Tilford, Icicle
- **General Graphs:** Grid, Chord

## Dataset

Users need to upload a file containing their graph data for visualization.

## Steps:
- Upload a file: Upload your graph data file via the upload.html interface.
- Classify the graph: The application checks whether the graph is a DAG, Tree, or General Graph.
- Select a layout: Based on the classification, choose a layout to visualize the graph.
- Visualize: Click on the selected layout to display the interactive graph.

## Demonstration:

https://github.com/MuhammadHaziq1337/D3-Graphs/assets/148570176/6df2e858-b25c-416f-ac26-42abf74ddbd3



## Dependencies
- D3.js
- Express.js (for server-side handling)
- Multer (for file uploads)
