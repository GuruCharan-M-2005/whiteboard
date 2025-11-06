import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory store
let pages: any[] = [];
let shapes: any[] = [];

// ----- Pages API -----
app.get('/api/pages', (req, res) => {
  res.json(pages);
});

app.post('/api/pages', (req, res) => {
  const { name } = req.body;
  const newPage = { id: uuidv4(), name: name || `Page ${pages.length + 1}` };
  pages.push(newPage);
  res.status(201).json(newPage);
});

app.delete('/api/pages/:id', (req, res) => {
  const { id } = req.params;
  pages = pages.filter(p => p.id !== id);
  shapes = shapes.filter(s => s.pageId !== id);
  res.json({ message: 'Page deleted' });
});

// ----- Shapes API -----
app.get('/api/shapes', (req, res) => {
  res.json(shapes);
});

app.post('/api/shapes', (req, res) => {
  const newShape = { id: uuidv4(), ...req.body };
  shapes.push(newShape);
  res.status(201).json(newShape);
});

app.put('/api/shapes/:id', (req, res) => {
  const { id } = req.params;
  const index = shapes.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: 'Shape not found' });
  shapes[index] = { ...shapes[index], ...req.body };
  res.json(shapes[index]);
});

app.delete('/api/shapes/:id', (req, res) => {
  const { id } = req.params;
  shapes = shapes.filter(s => s.id !== id);
  res.json({ message: 'Shape deleted' });
});

// Page-specific shapes
app.get('/api/pages/:id/shapes', (req, res) => {
  const { id } = req.params;
  const pageShapes = shapes.filter(s => s.pageId === id);
  res.json(pageShapes);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
