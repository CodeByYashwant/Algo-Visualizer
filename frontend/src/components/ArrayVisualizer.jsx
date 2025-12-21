import '../styles/ArrayVisualizer.css';

/**
 * ArrayVisualizer Component
 * Displays array elements as vertical bars with color coding
 */
function ArrayVisualizer({ array, comparingIndices, swappingIndices, sortedIndices }) {
  if (!array || array.length === 0) {
    return (
      <div className="array-visualizer">
        <p className="empty-message">Generate an array to visualize</p>
      </div>
    );
  }

  const maxValue = Math.max(...array);

  return (
    <div className="array-visualizer">
      <div className="bars-container">
        {array.map((value, index) => {
          const height = (value / maxValue) * 100;
          
          let barClass = 'bar';
          
          // Determine bar color based on state
          if (sortedIndices.includes(index)) {
            barClass += ' sorted';
          } else if (swappingIndices.includes(index)) {
            barClass += ' swapping';
          } else if (comparingIndices.includes(index)) {
            barClass += ' comparing';
          }

          return (
            <div key={index} className="bar-wrapper">
              <div
                className={barClass}
                style={{ '--bar-height': `${height}%` }}
                title={`Index ${index}: ${value}`}
              >
                <span className="bar-value">{value}</span>
              </div>
              <span className="bar-index">{index}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ArrayVisualizer;

