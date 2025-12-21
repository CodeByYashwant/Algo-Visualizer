import '../styles/Controls.css';

/**
 * Controls Component
 * Provides UI controls for algorithm visualization
 */
function Controls({
  onGenerateArray,
  onStart,
  onPause,
  onReset,
  onSpeedChange,
  isRunning,
  isPaused,
  speed,
  arrayLength,
  onArrayLengthChange
}) {
  return (
    <div className="controls">
      <div className="control-group">
        <label htmlFor="array-length">Array Size:</label>
        <input
          id="array-length"
          type="number"
          min="5"
          max="50"
          value={arrayLength}
          onChange={(e) => onArrayLengthChange(parseInt(e.target.value) || 10)}
          disabled={isRunning}
        />
        <button
          className="btn btn-generate"
          onClick={onGenerateArray}
          disabled={isRunning}
        >
          Generate Array
        </button>
      </div>

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
        <label htmlFor="speed">Speed:</label>
        <input
          id="speed"
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
  );
}

export default Controls;

