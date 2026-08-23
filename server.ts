import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { licenseRouter } from './server/routes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/license', licenseRouter);

  // Quick alias for /api/admin/licenses
  app.use('/api/admin/licenses', licenseRouter);

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'Kelola Lead Sales CRM',
      licenseService: 'active',
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kelola Lead Sales server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
