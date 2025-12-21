import '../styles/AlgorithmSelector.css';

/**
 * AlgorithmSelector Component
 * Allows user to select which sorting algorithm to visualize
 */
function AlgorithmSelector({ selectedAlgorithm, onAlgorithmChange, disabled }) {
  const algorithms = [
    { value: 'bubble', label: 'Bubble Sort' },
    { value: 'selection', label: 'Selection Sort' },
    { value: 'insertion', label: 'Insertion Sort' },
    { value: 'merge', label: 'Merge Sort' }
  ];

  return (
    <div className="algorithm-selector">
      <label htmlFor="algorithm-select">Select Algorithm:</label>
      <select
        id="algorithm-select"
        value={selectedAlgorithm}
        onChange={(e) => onAlgorithmChange(e.target.value)}
        disabled={disabled}
      >
        {algorithms.map((algo) => (
          <option key={algo.value} value={algo.value}>
            {algo.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AlgorithmSelector;

