import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Arc

import networkx as nx

# Data from the provided table
conferences = {
    'A': {'B': 5, 'C': 7, 'E': 3, 'H': 2},
    'B': {'A': 5, 'C': 6, 'D': 4},
    'C': {'A': 7, 'B': 6, 'E': 2},
    'D': {'B': 4, 'J': 3},
    'E': {'A': 3, 'C': 2, 'F': 8, 'I': 1},
    'F': {'E': 8},
    'H': {'A': 2, 'I': 6},
    'I': {'E': 1, 'H': 6},
    'J': {'D': 3}
}

# Create a network graph
G = nx.Graph()

# Add edges to the graph
for conf, edges in conferences.items():
    for target, weight in edges.items():
        G.add_edge(conf, target, weight=weight)

# Generate positions for each node using the Spring layout
pos = nx.spring_layout(G)

# Draw the nodes
nx.draw_networkx_nodes(G, pos, node_size=700)

# Draw the labels
nx.draw_networkx_labels(G, pos)

# Draw the edges with varying thickness based on the weight of collaboration
edge_width = [G[u][v]['weight'] for u,v in G.edges()]
nx.draw_networkx_edges(G, pos, width=edge_width)

# Show the plot
plt.axis('off')  # Turn off the axis
plt.show()