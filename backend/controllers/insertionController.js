import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Execute insertion sort C++ program and return steps
 */
export const runInsertionSort = async (req, res) => {
  try {
    const { array } = req.body;

    if (!array || !Array.isArray(array)) {
      return res.status(400).json({ error: 'Array is required in request body' });
    }

    const arrayString = array.join(' ');
    const isWindows = process.platform === 'win32';
    const executableName = isWindows ? 'insertion.exe' : 'insertion';
    const cppExecutable = path.join(__dirname, '../cpp/build', executableName);

    const { stdout, stderr } = await execAsync(
      `"${cppExecutable}" ${arrayString}`,
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

    res.json({ steps, originalArray: array });
  } catch (error) {
    console.error('Error executing insertion sort:', error);
    res.status(500).json({ error: 'Failed to execute insertion sort', details: error.message });
  }
};

