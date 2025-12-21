import express from 'express';
import { runBFS } from '../controllers/bfsController.js';
import { runDFS } from '../controllers/dfsController.js';
import { runDijkstra } from '../controllers/dijkstraController.js';
import { runBellmanFord } from '../controllers/bellmanFordController.js';
import { runFloydWarshall } from '../controllers/floydWarshallController.js';

const router = express.Router();

// POST /api/graph/bfs
router.post('/bfs', runBFS);

// POST /api/graph/dfs
router.post('/dfs', runDFS);

// POST /api/graph/dijkstra
router.post('/dijkstra', runDijkstra);

// POST /api/graph/bellman-ford
router.post('/bellman-ford', runBellmanFord);

// POST /api/graph/floyd-warshall
router.post('/floyd-warshall', runFloydWarshall);

export default router;

