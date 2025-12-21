import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Execute Bellman-Ford algorithm C++ program and return steps
 */
export const runBellmanFord = async (req, res) => {
  try {
    const { numNodes, startNode, edges } = req.body;

    if (numNodes === undefined || numNodes === null || startNode === undefined || startNode === null || !edges || !Array.isArray(edges)) {
      return res.status(400).json({ error: 'numNodes, startNode, and edges array are required' });
    }

    const args = [numNodes.toString(), startNode.toString()];
    edges.forEach(edge => {
      args.push(edge.u.toString(), edge.v.toString(), (edge.weight || 1).toString());
    });

    const isWindows = process.platform === 'win32';
    const executableName = isWindows ? 'bellman_ford.exe' : 'bellman_ford';
    const cppExecutable = path.join(__dirname, '../cpp/build', executableName);

    const { stdout, stderr } = await execAsync(
      `"${cppExecutable}" ${args.join(' ')}`,
      { maxBuffer: 10 * 1024 * 1024 }
    );

    if (stderr) {
      console.error('C++ program stderr:', stderr);
    }

    const steps = [];
    const lines = stdout.trim().split('\n');
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          const step = JSON.parse(line);
          steps.push(step);
        } catch (e) {
          console.warn('Skipping invalid JSON line:', line);
        }
      }
    }

    res.json({ steps, numNodes, startNode, edges });
  } catch (error) {
    console.error('Error executing Bellman-Ford:', error);
    res.status(500).json({ error: 'Failed to execute Bellman-Ford', details: error.message });
  }
};

