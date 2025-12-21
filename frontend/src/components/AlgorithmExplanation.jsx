import '../styles/AlgorithmExplanation.css';

/**
 * AlgorithmExplanation Component
 * Shows explanation and key concepts for the current algorithm
 */
function AlgorithmExplanation({ algorithm, mode, visitedNodes, startNode, distances, isRunning, isPaused }) {
  if (mode === 'sorting') {
    return (
      <div className="algorithm-explanation">
        <h3>How Sorting Works</h3>
        <p>Sorting algorithms rearrange array elements in ascending or descending order by comparing and swapping elements.</p>
      </div>
    );
  }

  // Calculate distances for BFS (number of edges from start)
  const getDistance = (node) => {
    if (algorithm === 'bfs' || algorithm === 'dfs') {
      // For BFS/DFS, distance is the level/step at which node was visited
      const index = visitedNodes.indexOf(node);
      return index >= 0 ? index : null;
    }
    return distances && distances[node] !== undefined ? distances[node] : null;
  };

  // Check if algorithm has completed
  const isComplete = visitedNodes.length > 0 && !isRunning && !isPaused;

  const explanations = {
    'bfs': {
      title: 'Breadth-First Search (BFS)',
      description: 'BFS explores a graph level by level, visiting all neighbors of a node before moving to the next level.',
      keyPoints: [
        'Finds shortest path (minimum edges) from start to any node',
        'Uses a queue (First-In-First-Out) to process nodes',
        'Visits nodes in order of distance from start',
        'Guarantees finding the shortest path in unweighted graphs'
      ],
      howItWorks: 'Starting from the start node, BFS visits all immediate neighbors first, then their neighbors, and so on. This ensures you always find the path with the fewest edges.'
    },
    'dfs': {
      title: 'Depth-First Search (DFS)',
      description: 'DFS explores as far as possible along each branch before backtracking.',
      keyPoints: [
        'Uses a stack (Last-In-First-Out) or recursion',
        'Explores one path completely before trying another',
        'Useful for finding cycles and paths',
        'Does not guarantee shortest path'
      ],
      howItWorks: 'DFS goes deep into the graph, following one path until it can go no further, then backtracks to explore other paths.'
    },
    'dijkstra': {
      title: "Dijkstra's Algorithm",
      description: 'Finds shortest paths from a start node to all other nodes in a weighted graph.',
      keyPoints: [
        'Works with weighted graphs (edges have costs)',
        'Uses a priority queue to always process closest unvisited node',
        'Guarantees shortest path when all weights are non-negative',
        'Time complexity: O(V²) or O(E log V) with priority queue'
      ],
      howItWorks: 'Maintains distances to all nodes and repeatedly selects the unvisited node with smallest known distance, updating distances to its neighbors.'
    },
    'bellman-ford': {
      title: 'Bellman-Ford Algorithm',
      description: 'Finds shortest paths in graphs that may have negative edge weights.',
      keyPoints: [
        'Handles negative edge weights',
        'Can detect negative cycles',
        'Slower than Dijkstra but more versatile',
        'Relaxes all edges V-1 times'
      ],
      howItWorks: 'Repeatedly relaxes all edges, updating distances. After V-1 iterations, shortest paths are found (if no negative cycles exist).'
    },
    'floyd-warshall': {
      title: 'Floyd-Warshall Algorithm',
      description: 'Finds shortest paths between all pairs of nodes in a graph.',
      keyPoints: [
        'Computes shortest paths for all node pairs',
        'Handles negative weights (but not negative cycles)',
        'Uses dynamic programming approach',
        'Time complexity: O(V³)'
      ],
      howItWorks: 'Uses dynamic programming to build up shortest paths by considering all possible intermediate nodes.'
    }
  };

  const algoInfo = explanations[algorithm] || explanations['bfs'];

  return (
    <div className="algorithm-explanation">
      <div className="explanation-header">
        <h3>{algoInfo.title}</h3>
        <span className="info-icon" title="Click to learn more">ℹ️</span>
      </div>
      
      <p className="description">{algoInfo.description}</p>
      
      <div className="key-points">
        <h4>Key Points:</h4>
        <ul>
          {algoInfo.keyPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      <div className="how-it-works">
        <h4>How It Works:</h4>
        <p>{algoInfo.howItWorks}</p>
      </div>


      {algorithm === 'bfs' && visitedNodes.length > 0 && (
        <div className="bfs-visualization">
          <h4>BFS Levels:</h4>
          <div className="levels">
            {visitedNodes.map((node, index) => (
              <div key={node} className="level-item">
                <span className="level-number">Level {index}</span>
                <span className="level-node">→ Node {node}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AlgorithmExplanation;

