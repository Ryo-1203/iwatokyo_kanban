import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// API Routes - 動的インポート
app.use('/api/employees', async (req, res, next) => {
  const handler = (await import('./api/employees/route.js')).default;
  handler(req, res);
});

app.use('/api/calendars', async (req, res, next) => {
  const handler = (await import('./api/calendars/route.js')).default;
  handler(req, res);
});

// Serve the main app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});