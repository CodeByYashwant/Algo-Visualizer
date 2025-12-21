import { useState } from 'react';
import '../styles/ResultPanel.css';

/**
 * ResultPanel Component
 * Shows algorithm results with explanation toggle
 */
function ResultPanel({ 
  algorithm, 
  visitedNodes, 
  startNode, 
  distances,
  parents,
  edges,
  isComplete 
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState({});

  if (!isComplete || visitedNodes.length === 0) {
    return null;
  }

  // Calculate distances for BFS (number of edges from start)
  const getDistance = (node) => {
    if (algorithm === 'bfs' || algorithm === 'dfs') {
      const index = visitedNodes.indexOf(node);
      return index >= 0 ? index : null;
    }
    return distances && distances[node] !== undefined ? distances[node] : null;
  };

  // Reconstruct shortest path from start to target node
  const getShortestPath = (targetNode) => {
    if (targetNode === startNode) {
      return [startNode];
    }

    if (!parents || parents[targetNode] === undefined) {
      return null;
    }

    const path = [];
    let current = targetNode;
    
    while (current !== -1 && current !== undefined) {
      path.unshift(current);
      current = parents[current];
      // Safety check to avoid infinite loops
      if (path.length > visitedNodes.length) {
        break;
      }
    }

    return path.length > 0 ? path : null;
  };

  const togglePathExpansion = (node) => {
    setExpandedPaths(prev => ({
      ...prev,
      [node]: !prev[node]
    }));
  };

  const getResultTitle = () => {
    switch (algorithm) {
      case 'bfs':
        return 'BFS Result: Shortest Paths Found';
      case 'dfs':
        return 'DFS Result: Graph Traversal Complete';
      case 'dijkstra':
        return "Dijkstra's Result: Shortest Distances Found";
      case 'bellman-ford':
        return 'Bellman-Ford Result: Shortest Distances Found';
      case 'floyd-warshall':
        return 'Floyd-Warshall Result: All-Pairs Shortest Paths';
      default:
        return 'Algorithm Result';
    }
  };

  const getResultDescription = () => {
    switch (algorithm) {
      case 'bfs':
        return `BFS successfully found the shortest path from node ${startNode} to all reachable nodes. The distances shown represent the minimum number of edges required to reach each node. This is guaranteed to be the shortest path in terms of number of edges.`;
      case 'dfs':
        return `DFS completed traversal of the graph starting from node ${startNode}. All reachable nodes have been visited. Note: DFS does not guarantee shortest paths.`;
      case 'dijkstra':
        return `Dijkstra's algorithm found the shortest path distances from node ${startNode} to all reachable nodes, considering edge weights. This is the optimal solution for weighted graphs with non-negative weights.`;
      case 'bellman-ford':
        return `Bellman-Ford algorithm computed shortest distances from node ${startNode}, handling potential negative edge weights.`;
      case 'floyd-warshall':
        return `Floyd-Warshall algorithm computed shortest paths between all pairs of nodes in the graph.`;
      default:
        return 'Algorithm execution completed successfully.';
    }
  };

  return (
    <div className="result-panel">
      <div className="result-header-section">
        <div className="result-title-section">
          <h3 className="result-title">{getResultTitle()}</h3>
          {algorithm === 'bfs' && (
            <span className="success-badge">✓ Shortest Path Guaranteed</span>
          )}
        </div>
        <button 
          className={`explanation-toggle ${showExplanation ? 'active' : ''}`}
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
          <span className="toggle-icon">{showExplanation ? '▲' : '▼'}</span>
        </button>
      </div>

      {showExplanation && (
        <div className="explanation-content">
          <p className="explanation-text">{getResultDescription()}</p>
          
          {algorithm === 'bfs' && (
            <div className="bfs-explanation-detail">
              <h4>What This Means:</h4>
              <ul>
                <li><strong>Level 0:</strong> The start node (node {startNode})</li>
                <li><strong>Level 1:</strong> Nodes directly connected to the start (1 edge away)</li>
                <li><strong>Level 2:</strong> Nodes reachable through 2 edges</li>
                <li><strong>And so on...</strong></li>
              </ul>
              <p className="key-insight">
                <strong>Key Insight:</strong> BFS guarantees that when you visit a node at level N, 
                you've found the shortest path to that node (using exactly N edges). 
                No other path can be shorter!
              </p>
              <div className="path-explanation">
                <h4>Understanding Shortest Paths:</h4>
                <p>
                  Click "Show Path" on any node card to see the actual sequence of nodes 
                  you need to traverse to reach that node from the start. For example, 
                  if you see "0 → 1 → 9", it means: Start at node 0, go to node 1, then to node 9.
                  This path uses exactly {visitedNodes.length > 1 ? getDistance(visitedNodes[1]) : 0} edges, 
                  which is the minimum possible.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="results-grid">
        <div className="result-summary-box">
          <div className="summary-item">
            <span className="summary-label">Start Node:</span>
            <span className="summary-value">{startNode}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Nodes Visited:</span>
            <span className="summary-value">{visitedNodes.length}</span>
          </div>
          {algorithm === 'bfs' && (
            <div className="summary-item">
              <span className="summary-label">Max Distance:</span>
              <span className="summary-value">
                {visitedNodes.length > 0 ? visitedNodes.length - 1 : 0} edges
              </span>
            </div>
          )}
        </div>

        <div className="path-results-section">
          <h4>Shortest Paths from Node {startNode}:</h4>
          <div className="path-grid">
            {visitedNodes.map((node) => {
              const dist = getDistance(node);
              const path = algorithm === 'bfs' ? getShortestPath(node) : null;
              const isExpanded = expandedPaths[node];
              
              return (
                <div key={node} className="result-card">
                  <div className="card-header">
                    <span className="card-node">Node {node}</span>
                    {node === startNode && (
                      <span className="card-badge start-badge">Start</span>
                    )}
                  </div>
                  <div className="card-body">
                    {algorithm === 'bfs' ? (
                      <>
                        <div className="card-distance">
                          <span className="distance-label">Distance:</span>
                          <span className="distance-value">{dist} edge{dist !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="card-level">
                          <span className="level-label">Level:</span>
                          <span className="level-value">{dist}</span>
                        </div>
                        {path && path.length > 1 && (
                          <div className="card-path">
                            <button 
                              className="path-toggle"
                              onClick={() => togglePathExpansion(node)}
                            >
                              {isExpanded ? 'Hide Path' : 'Show Path'}
                            </button>
                            {isExpanded && (
                              <div className="path-display">
                                <span className="path-label">Path:</span>
                                <div className="path-nodes">
                                  {path.map((pathNode, idx) => (
                                    <span key={idx} className="path-node-item">
                                      {pathNode}
                                      {idx < path.length - 1 && <span className="path-arrow">→</span>}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : dist !== null ? (
                      <div className="card-distance">
                        <span className="distance-label">Distance:</span>
                        <span className="distance-value">{dist}</span>
                      </div>
                    ) : (
                      <div className="card-distance">Not reached</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPanel;

