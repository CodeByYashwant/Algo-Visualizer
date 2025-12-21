import '../styles/GraphControls.css';

/**
 * GraphControls Component
 * Controls for graph visualization
 */
function GraphControls({
  onGenerateGraph,
  onStart,
  onPause,
  onReset,
  onSpeedChange,
  onAlgorithmChange,
  onStartNodeChange,
  onNumNodesChange,
  isRunning,
  isPaused,
  speed,
  selectedAlgorithm,
  startNode,
  numNodes,
  algorithms
}) {
  return (
    <div className="graph-controls">
      <div className="control-section">
        <h3>Graph Settings</h3>
        <div className="control-group">
          <label htmlFor="num-nodes">Number of Nodes:</label>
          <input
            id="num-nodes"
            type="number"
            min="3"
            max="15"
            value={numNodes}
            onChange={(e) => onNumNodesChange(parseInt(e.target.value) || 5)}
            disabled={isRunning && !isPaused}
          />
        </div>
        <div className="control-group">
          <label htmlFor="start-node">Start Node:</label>
          <input
            id="start-node"
            type="number"
            min="0"
            max={numNodes - 1}
            value={startNode}
            onChange={(e) => onStartNodeChange(parseInt(e.target.value) || 0)}
            disabled={isRunning && !isPaused}
          />
        </div>
        <button
          className="btn btn-generate"
          onClick={onGenerateGraph}
          disabled={isRunning && !isPaused}
        >
          Generate Graph
        </button>
      </div>

      <div className="control-section">
        <h3>Algorithm</h3>
        <div className="control-group">
          <label htmlFor="graph-algorithm">Select Algorithm:</label>
          <select
            id="graph-algorithm"
            value={selectedAlgorithm}
            onChange={(e) => onAlgorithmChange(e.target.value)}
            disabled={isRunning && !isPaused}
          >
            {algorithms.map((algo) => (
              <option key={algo.value} value={algo.value}>
                {algo.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="control-section">
        <h3>Animation</h3>
        <div className="control-group">
          <button
            className="btn btn-start"
            onClick={onStart}
            disabled={isRunning && !isPaused}
          >
            {isPaused ? 'Resume' : 'Start'}
          </button>
          <button
            className="btn btn-pause"
            onClick={onPause}
            disabled={!isRunning || isPaused}
          >
            Pause
          </button>
          <button
            className="btn btn-reset"
            onClick={onReset}
            disabled={isRunning && !isPaused}
          >
            Reset
          </button>
        </div>
        <div className="control-group">
          <label htmlFor="graph-speed">Speed:</label>
          <input
            id="graph-speed"
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            disabled={isRunning && !isPaused}
          />
          <span className="speed-value">{speed}ms</span>
        </div>
      </div>
    </div>
  );
}

export default GraphControls;

