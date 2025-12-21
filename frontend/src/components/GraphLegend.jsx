import '../styles/GraphLegend.css';

/**
 * GraphLegend Component
 * Shows legend for graph visualization colors and states
 */
function GraphLegend({ algorithm }) {
  const legendItems = [
    {
      color: '#8b5cf6',
      label: 'Start Node',
      description: 'The node where the algorithm begins'
    },
    {
      color: '#f59e0b',
      label: 'Current Node',
      description: 'Node being processed right now'
    },
    {
      color: '#10b981',
      label: 'Visited Node',
      description: 'Node that has been processed'
    },
    {
      color: '#4facfe',
      label: 'Unvisited Node',
      description: 'Node not yet processed'
    },
    {
      color: '#fbbf24',
      label: 'Exploring Edge',
      description: 'Edge being examined currently'
    }
  ];

  return (
    <div className="graph-legend">
      <h4>Legend</h4>
      <div className="legend-items">
        {legendItems.map((item, index) => (
          <div key={index} className="legend-item" title={item.description}>
            <div className="legend-color" style={{ backgroundColor: item.color }}></div>
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
      {algorithm === 'bfs' && (
        <div className="legend-note">
          <strong>Note:</strong> L0, L1, L2... show the level (distance in edges) from the start node. 
          BFS guarantees the shortest path in terms of number of edges.
        </div>
      )}
    </div>
  );
}

export default GraphLegend;

