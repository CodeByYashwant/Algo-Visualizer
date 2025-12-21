import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Execute bubble sort C++ program and return steps
 */
export const runBubbleSort = async (req, res) => {
  try {
    const { array } = req.body;

    if (!array || !Array.isArray(array)) {
      return res.status(400).json({ error: 'Array is required in request body' });
    }

    // Convert array to space-separated string for C++ program
    const arrayString = array.join(' ');

    // Path to compiled C++ executable (Windows uses .exe, Unix doesn't)
    const isWindows = process.platform === 'win32';
    const executableName = isWindows ? 'bubble.exe' : 'bubble';
    const cppExecutable = path.join(__dirname, '../cpp/build', executableName);

    // Execute C++ program with array as input
    const { stdout, stderr } = await execAsync(
      `"${cppExecutable}" ${arrayString}`,
      { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer
    );

    if (stderr) {
      console.error('C++ program stderr:', stderr);
    }

    // Parse JSON steps from stdout
    const steps = [];
    const lines = stdout.trim().split('\n');
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          const step = JSON.parse(line);
          steps.push(step);
        } catch (e) {
          // Skip invalid JSON lines
          console.warn('Skipping invalid JSON line:', line);
        }
      }
    }

    res.json({ steps, originalArray: array });
  } catch (error) {
    console.error('Error executing bubble sort:', error);
    res.status(500).json({ error: 'Failed to execute bubble sort', details: error.message });
  }
};

