import { useState, useEffect, useRef } from 'react';
import ArrayVisualizer from './components/ArrayVisualizer';
import GraphVisualizer from './components/GraphVisualizer';
import Controls from './components/Controls';
import GraphControls from './components/GraphControls';
import AlgorithmSelector from './components/AlgorithmSelector';
import QueueStackDisplay from './components/QueueStackDisplay';
import AlgorithmExplanation from './components/AlgorithmExplanation';
import GraphLegend from './components/GraphLegend';
import ResultPanel from './components/ResultPanel';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  // Theme: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Mode: 'sorting' or 'graph'
  const [mode, setMode] = useState('sorting');

  // Sorting state
  const [array, setArray] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
  const [comparingIndices, setComparingIndices] = useState([]);
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [selectedSortAlgorithm, setSelectedSortAlgorithm] = useState('bubble');
  const [arrayLength, setArrayLength] = useState(20);

  // Graph state
  const [numNodes, setNumNodes] = useState(5);
  const [startNode, setStartNode] = useState(0);
  const [edges, setEdges] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [exploringEdge, setExploringEdge] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [distances, setDistances] = useState(null);
  const [parents, setParents] = useState({});
  const [queueStackData, setQueueStackData] = useState([]);
  const [queueStackType, setQueueStackType] = useState('queue');
  const [selectedGraphAlgorithm, setSelectedGraphAlgorithm] = useState('bfs');

  // Common state
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);

  const animationRef = useRef(null);

  // Sorting algorithms
  const sortAlgorithms = [
    { value: 'bubble', label: 'Bubble Sort' },
    { value: 'selection', label: 'Selection Sort' },
    { value: 'insertion', label: 'Insertion Sort' },
    { value: 'merge', label: 'Merge Sort' }
  ];

  // Graph algorithms
  const graphAlgorithms = [
    { value: 'bfs', label: 'BFS (Breadth-First Search)' },
    { value: 'dfs', label: 'DFS (Depth-First Search)' },
    { value: 'dijkstra', label: "Dijkstra's Algorithm" },
    { value: 'bellman-ford', label: 'Bellman-Ford' },
    { value: 'floyd-warshall', label: 'Floyd-Warshall' }
  ];

  // Generate random array for sorting
  const generateRandomArray = () => {
    const newArray = Array.from({ length: arrayLength }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setOriginalArray([...newArray]);
    resetSortingState();
  };

  // Generate random graph
  const generateRandomGraph = () => {
    const newEdges = [];
    const edgeSet = new Set();
    
    // Generate edges (ensure connectivity)
    for (let i = 0; i < numNodes; i++) {
      const next = (i + 1) % numNodes;
      const edgeKey = `${Math.min(i, next)}-${Math.max(i, next)}`;
      if (!edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        const weight = Math.floor(Math.random() * 20) + 1;
        newEdges.push({ u: i, v: next, weight });
      }
    }

    // Add some random edges
    const additionalEdges = Math.floor(numNodes * 1.5);
    for (let i = 0; i < additionalEdges; i++) {
      const u = Math.floor(Math.random() * numNodes);
      const v = Math.floor(Math.random() * numNodes);
      if (u !== v) {
        const edgeKey = `${Math.min(u, v)}-${Math.max(u, v)}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          const weight = Math.floor(Math.random() * 20) + 1;
          newEdges.push({ u, v, weight });
        }
      }
    }

    setEdges(newEdges);
    resetGraphState();
  };

  const resetSortingState = () => {
    setSteps([]);
    setCurrentStepIndex(0);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setIsRunning(false);
    setIsPaused(false);
  };

  const resetGraphState = () => {
    setSteps([]);
    setCurrentStepIndex(0);
    setVisitedNodes([]);
    setExploringEdge(null);
    setCurrentNode(null);
    setDistances(null);
    setParents({});
    setQueueStackData([]);
    setIsRunning(false);
    setIsPaused(false);
  };

  // Fetch sorting steps
  const fetchSortSteps = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sort/${selectedSortAlgorithm}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array: originalArray }),
      });

      if (!response.ok) throw new Error('Failed to fetch sorting steps');
      const data = await response.json();
      
      // Reset state first, then set steps
      setCurrentStepIndex(0);
      setArray([...originalArray]);
      setComparingIndices([]);
      setSwappingIndices([]);
      setSortedIndices([]);
      setIsRunning(false);
      setIsPaused(false);
      setSteps(data.steps);
      
      return data.steps;
    } catch (error) {
      console.error('Error fetching steps:', error);
      alert('Error: Could not connect to backend. Make sure the backend server is running.');
      return null;
    }
  };

  // Fetch graph steps
  const fetchGraphSteps = async () => {
    try {
      const endpoint = selectedGraphAlgorithm === 'bellman-ford' 
        ? 'bellman-ford' 
        : selectedGraphAlgorithm === 'floyd-warshall'
        ? 'floyd-warshall'
        : selectedGraphAlgorithm;
      
      const body = selectedGraphAlgorithm === 'floyd-warshall'
        ? { numNodes, edges }
        : { numNodes, startNode, edges };

      const response = await fetch(`${API_BASE_URL}/graph/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to fetch graph steps');
      const data = await response.json();
      
      // Reset state first, then set steps
      setCurrentStepIndex(0);
      setVisitedNodes([]);
      setExploringEdge(null);
      setCurrentNode(null);
      setDistances(null);
      setParents({});
      setQueueStackData([]);
      setIsRunning(false);
      setIsPaused(false);
      setSteps(data.steps);
      
      return data.steps;
    } catch (error) {
      console.error('Error fetching graph steps:', error);
      alert('Error: Could not connect to backend. Make sure the backend server is running.');
      return null;
    }
  };

  // Start visualization
  const handleStart = async () => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    // If no steps exist, fetch them first
    if (steps.length === 0) {
      const fetchedSteps = mode === 'sorting' 
        ? await fetchSortSteps()
        : await fetchGraphSteps();
      
      if (!fetchedSteps || fetchedSteps.length === 0) {
        console.log('No steps fetched');
        return;
      }
      
      console.log('Fetched steps:', fetchedSteps.length);
      // Use a small delay to ensure state is updated
      requestAnimationFrame(() => {
        setIsRunning(true);
        setIsPaused(false);
      });
    } else {
      // Steps already exist, start immediately
      console.log('Starting with existing steps:', steps.length);
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => setIsPaused(true);
  
  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setSteps([]);
    
    if (mode === 'sorting') {
      setArray([...originalArray]);
      resetSortingState();
    } else {
      resetGraphState();
    }
  };

  // Apply sorting step
  const applySortStep = (step, currentArray) => {
    const newArray = [...currentArray];
    const newComparingIndices = [];
    const newSwappingIndices = [];
    const newSortedIndices = [...sortedIndices];

    switch (step.type) {
      case 'compare':
        newComparingIndices.push(step.i);
        if (step.j !== undefined) newComparingIndices.push(step.j);
        break;
      case 'swap':
        newSwappingIndices.push(step.i);
        if (step.j !== undefined) {
          newSwappingIndices.push(step.j);
          [newArray[step.i], newArray[step.j]] = [newArray[step.j], newArray[step.i]];
        }
        break;
      case 'overwrite':
        if (step.value !== undefined) newArray[step.i] = step.value;
        break;
      case 'sorted':
        if (!newSortedIndices.includes(step.i)) newSortedIndices.push(step.i);
        break;
    }

    return { array: newArray, comparingIndices: newComparingIndices, swappingIndices: newSwappingIndices, sortedIndices: newSortedIndices };
  };

  // Apply graph step
  const applyGraphStep = (step) => {
    switch (step.type) {
      case 'visit':
        setVisitedNodes(prev => {
          if (step.node !== undefined && !prev.includes(step.node)) {
            return [...prev, step.node];
          }
          return prev;
        });
        setCurrentNode(step.node);
        break;
      case 'explore':
        setExploringEdge({ u: step.node, v: step.target });
        break;
      case 'enqueue':
        // enqueue step just indicates a node was enqueued, queue state comes from queue step
        break;
      case 'dequeue':
        // dequeue step indicates a node was dequeued
        setCurrentNode(step.node);
        break;
      case 'queue':
        setQueueStackData(step.queue || []);
        setQueueStackType('queue');
        break;
      case 'stack':
        setQueueStackData(step.stack || []);
        setQueueStackType('stack');
        break;
      case 'priority_queue':
        setQueueStackData(step.queue || []);
        setQueueStackType('queue');
        break;
      case 'update_distance':
        if (step.node !== undefined && step.distance !== undefined) {
          setDistances(prev => ({
            ...prev,
            [step.node]: step.distance
          }));
        }
        break;
      case 'parent':
        if (step.node !== undefined && step.parent !== undefined) {
          setParents(prev => ({
            ...prev,
            [step.node]: step.parent
          }));
        }
        break;
      case 'initialize':
      case 'iteration':
      case 'check':
      case 'update':
      case 'finalize':
      case 'final_distance':
      case 'check_negative_cycle':
      case 'negative_cycle':
      case 'relax':
        // These are informational steps, no state change needed
        break;
      default:
        console.log('Unhandled step type:', step.type, step);
    }
  };

  // Animation loop
  useEffect(() => {
    console.log('Animation effect:', { isRunning, isPaused, stepsLength: steps.length, currentStepIndex });
    
    if (isRunning && !isPaused && steps.length > 0 && currentStepIndex < steps.length) {
      animationRef.current = setTimeout(() => {
        const step = steps[currentStepIndex];
        
        if (!step) {
          console.log('No step at index:', currentStepIndex, 'Total steps:', steps.length);
          setIsRunning(false);
          return;
        }

        console.log('Processing step:', currentStepIndex, step.type);

        if (mode === 'sorting') {
          const result = applySortStep(step, array);
          setArray(result.array);
          setComparingIndices(result.comparingIndices);
          setSwappingIndices(result.swappingIndices);
          setSortedIndices(result.sortedIndices);
        } else {
          applyGraphStep(step);
        }

        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          console.log('Animation complete');
          setIsRunning(false);
          setIsPaused(false);
          // Clear queue/stack when animation completes
          if (mode === 'graph') {
            setQueueStackData([]);
            setCurrentNode(null);
            setExploringEdge(null);
          }
        }
      }, speed);

      return () => {
        if (animationRef.current) clearTimeout(animationRef.current);
      };
    }
  }, [isRunning, isPaused, currentStepIndex, steps, speed, mode, array]);

  // Clear comparing/swapping indices
  useEffect(() => {
    if (mode === 'sorting' && (comparingIndices.length > 0 || swappingIndices.length > 0)) {
      const timer = setTimeout(() => {
        setComparingIndices([]);
        setSwappingIndices([]);
      }, speed * 0.8);
      return () => clearTimeout(timer);
    }
  }, [comparingIndices, swappingIndices, speed, mode]);

  // Clear exploring edge
  useEffect(() => {
    if (mode === 'graph' && exploringEdge) {
      const timer = setTimeout(() => setExploringEdge(null), speed * 0.8);
      return () => clearTimeout(timer);
    }
  }, [exploringEdge, speed, mode]);

  // Initialize on mount
  useEffect(() => {
    generateRandomArray();
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1>Algorithm Visualizer</h1>
            <p className="subtitle">Visualize sorting and graph algorithms step by step</p>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <div className="mode-switcher">
          <button
            className={`mode-btn ${mode === 'sorting' ? 'active' : ''}`}
            onClick={() => {
              if (!isRunning || isPaused) {
                setMode('sorting');
                generateRandomArray();
              }
            }}
            disabled={isRunning && !isPaused}
          >
            Sorting Algorithms
          </button>
          <button
            className={`mode-btn ${mode === 'graph' ? 'active' : ''}`}
            onClick={() => {
              if (!isRunning || isPaused) {
                setMode('graph');
                generateRandomGraph();
              }
            }}
            disabled={isRunning && !isPaused}
          >
            Graph Algorithms
          </button>
        </div>
      </header>

      <main className="app-main">
        {mode === 'sorting' ? (
          <>
            <div className="control-panel">
              <AlgorithmSelector
                selectedAlgorithm={selectedSortAlgorithm}
                onAlgorithmChange={setSelectedSortAlgorithm}
                disabled={isRunning && !isPaused}
              />
              <Controls
                onGenerateArray={generateRandomArray}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
                onSpeedChange={setSpeed}
                onArrayLengthChange={setArrayLength}
                isRunning={isRunning}
                isPaused={isPaused}
                speed={speed}
                arrayLength={arrayLength}
              />
            </div>
            <div className="visualization-area">
              <ArrayVisualizer
                array={array}
                comparingIndices={comparingIndices}
                swappingIndices={swappingIndices}
                sortedIndices={sortedIndices}
              />
            </div>
          </>
        ) : (
          <>
            <div className="control-panel">
              <GraphControls
                onGenerateGraph={generateRandomGraph}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
                onSpeedChange={setSpeed}
                onAlgorithmChange={setSelectedGraphAlgorithm}
                onStartNodeChange={setStartNode}
                onNumNodesChange={setNumNodes}
                isRunning={isRunning}
                isPaused={isPaused}
                speed={speed}
                selectedAlgorithm={selectedGraphAlgorithm}
                startNode={startNode}
                numNodes={numNodes}
                algorithms={graphAlgorithms}
              />
            </div>

            <div className="graph-main-content">
              <div className="graph-visualization-section">
                <div className="visualization-area graph-area">
                  <GraphLegend algorithm={selectedGraphAlgorithm} />
                  <GraphVisualizer
                    numNodes={numNodes}
                    edges={edges}
                    visitedNodes={visitedNodes}
                    exploringEdge={exploringEdge}
                    currentNode={currentNode}
                    distances={distances}
                    startNode={startNode}
                    algorithm={selectedGraphAlgorithm}
                  />
                </div>
                <div className="queue-stack-area">
                  <QueueStackDisplay
                    data={queueStackData}
                    type={queueStackType}
                    title={selectedGraphAlgorithm === 'bfs' || selectedGraphAlgorithm === 'dijkstra' 
                      ? 'Queue' 
                      : selectedGraphAlgorithm === 'dfs'
                      ? 'Stack'
                      : 'Data Structure'}
                  />
                </div>
              </div>

              <div className="algorithm-info-section">
                <AlgorithmExplanation
                  algorithm={selectedGraphAlgorithm}
                  mode={mode}
                  visitedNodes={visitedNodes}
                  startNode={startNode}
                  distances={distances}
                  isRunning={isRunning}
                  isPaused={isPaused}
                />
              </div>
            </div>

            <ResultPanel
              algorithm={selectedGraphAlgorithm}
              visitedNodes={visitedNodes}
              startNode={startNode}
              distances={distances}
              parents={parents}
              edges={edges}
              isComplete={!isRunning && !isPaused && visitedNodes.length > 0}
            />
          </>
        )}

        <div className="info-panel">
          <div className="info-item">
            <span className="info-label">Mode:</span>
            <span className="info-value">{mode === 'sorting' ? 'Sorting' : 'Graph'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Algorithm:</span>
            <span className="info-value">
              {mode === 'sorting'
                ? selectedSortAlgorithm.charAt(0).toUpperCase() + selectedSortAlgorithm.slice(1) + ' Sort'
                : graphAlgorithms.find(a => a.value === selectedGraphAlgorithm)?.label || selectedGraphAlgorithm}
            </span>
          </div>
          {mode === 'sorting' ? (
            <>
              <div className="info-item">
                <span className="info-label">Array Size:</span>
                <span className="info-value">{array.length}</span>
              </div>
            </>
          ) : (
            <>
              <div className="info-item">
                <span className="info-label">Nodes:</span>
                <span className="info-value">{numNodes}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Edges:</span>
                <span className="info-value">{edges.length}</span>
              </div>
            </>
          )}
          <div className="info-item">
            <span className="info-label">Steps:</span>
            <span className="info-value">{currentStepIndex} / {steps.length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="info-value">
              {isRunning && !isPaused ? 'Running' : isPaused ? 'Paused' : 'Ready'}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
