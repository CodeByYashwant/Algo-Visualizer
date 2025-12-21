import '../styles/GraphVisualizer.css';

/**
 * GraphVisualizer Component
 * Displays graph nodes and edges with animation
 */
function GraphVisualizer({ 
  numNodes, 
  edges, 
  visitedNodes, 
  exploringEdge, 
  currentNode,
  distances,
  startNode,
  algorithm
}) {
  if (!numNodes || numNodes === 0) {
    return (
      <div className="graph-visualizer">
        <p className="empty-message">Generate a graph to visualize</p>
      </div>
    );
  }

  // Calculate node positions in a circle
  const centerX = 400;
  const centerY = 300;
  const radius = Math.min(200, 250 - numNodes * 5);
  const nodePositions = [];
  
  for (let i = 0; i < numNodes; i++) {
    const angle = (2 * Math.PI * i) / numNodes - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    nodePositions.push({ x, y });
  }

  return (
    <div className="graph-visualizer">
      <svg width="800" height="600" className="graph-svg">
        {/* Draw edges */}
        {edges.map((edge, index) => {
          const u = edge.u;
          const v = edge.v;
          const pos1 = nodePositions[u];
          const pos2 = nodePositions[v];
          
          const isExploring = exploringEdge && 
            ((exploringEdge.u === u && exploringEdge.v === v) ||
             (exploringEdge.u === v && exploringEdge.v === u));
          
          return (
            <line
              key={`edge-${u}-${v}-${index}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              className={`edge ${isExploring ? 'exploring' : ''}`}
              strokeWidth={edge.weight ? '2' : '1'}
            />
          );
        })}

        {/* Draw edge weights */}
        {edges.map((edge, index) => {
          if (!edge.weight) return null;
          const u = edge.u;
          const v = edge.v;
          const pos1 = nodePositions[u];
          const pos2 = nodePositions[v];
          const midX = (pos1.x + pos2.x) / 2;
          const midY = (pos1.y + pos2.y) / 2;
          
          return (
            <text
              key={`weight-${u}-${v}-${index}`}
              x={midX}
              y={midY}
              className="edge-weight"
            >
              {edge.weight}
            </text>
          );
        })}

        {/* Draw nodes */}
        {nodePositions.map((pos, index) => {
          const isVisited = visitedNodes.includes(index);
          const isCurrent = currentNode === index;
          const isStart = startNode === index;
          
          // Calculate distance/level for BFS
          let distance = null;
          if (algorithm === 'bfs' && isVisited) {
            distance = visitedNodes.indexOf(index); // Level in BFS
          } else if (distances && distances[index] !== undefined && distances[index] !== Infinity) {
            distance = distances[index];
          }
          
          let nodeClass = 'node';
          if (isCurrent) {
            nodeClass += ' current';
          } else if (isVisited) {
            nodeClass += ' visited';
          }
          if (isStart) {
            nodeClass += ' start';
          }

          // Create tooltip text
          let tooltipText = `Node ${index}`;
          if (isStart) {
            tooltipText += ' (Start Node)';
          }
          if (distance !== null) {
            if (algorithm === 'bfs') {
              tooltipText += `\nDistance: ${distance} edge${distance !== 1 ? 's' : ''} from start`;
              tooltipText += `\nLevel: ${distance}`;
            } else {
              tooltipText += `\nDistance: ${distance}`;
            }
          }
          if (isVisited) {
            tooltipText += '\nStatus: Visited';
          }

          return (
            <g key={`node-${index}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                className={nodeClass}
              >
                <title>{tooltipText}</title>
              </circle>
              <text
                x={pos.x}
                y={pos.y}
                className="node-label"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {index}
              </text>
              {distance !== null && (
                <text
                  x={pos.x}
                  y={pos.y + 35}
                  className="node-distance"
                  textAnchor="middle"
                >
                  {algorithm === 'bfs' ? `L${distance}` : `d=${distance}`}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default GraphVisualizer;

