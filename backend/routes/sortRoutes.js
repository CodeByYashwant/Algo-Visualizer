import express from 'express';
import { runBubbleSort } from '../controllers/bubbleController.js';
import { runSelectionSort } from '../controllers/selectionController.js';
import { runInsertionSort } from '../controllers/insertionController.js';
import { runMergeSort } from '../controllers/mergeController.js';

const router = express.Router();

// POST /api/sort/bubble
router.post('/bubble', runBubbleSort);

// POST /api/sort/selection
router.post('/selection', runSelectionSort);

// POST /api/sort/insertion
router.post('/insertion', runInsertionSort);

// POST /api/sort/merge
router.post('/merge', runMergeSort);

export default router;

