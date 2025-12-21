import express from 'express';
import cors from 'cors';
import sortRoutes from './routes/sortRoutes.js';
import graphRoutes from './routes/graphRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sort', sortRoutes);
app.use('/api/graph', graphRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Algorithm Visualizer API is running' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

