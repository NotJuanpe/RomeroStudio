import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // API ROUTES FOR CMS & FRONTEND
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. STATS & ANALYTICS
  app.get('/api/stats', (req, res) => {
    try {
      const stats = db.getStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve stats' });
    }
  });

  app.post('/api/stats/visit', (req, res) => {
    try {
      const visits = db.incrementVisits();
      res.json({ visits });
    } catch (err) {
      res.status(500).json({ error: 'Failed to increment visit' });
    }
  });

  // 2. PROJECTS CRUD
  app.get('/api/projects', (req, res) => {
    try {
      const projects = db.getProjects();
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.get('/api/projects/:id', (req, res) => {
    try {
      const project = db.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  app.post('/api/projects', (req, res) => {
    try {
      const { title, category, description, year, area, scope, materials, heroImage, status, featured } = req.body;
      if (!title || !category) {
        return res.status(400).json({ error: 'Title and category are required' });
      }

      const newProject = db.addProject({
        id: req.body.id || `proj-${Date.now()}`,
        title,
        category,
        description: description || 'Proyecto de arquitectura integral.',
        longDescription: req.body.longDescription || description,
        year: year || new Date().getFullYear(),
        area: area || '250 m²',
        scope: scope || 'Obra Nueva',
        materials: materials || 'Hormigón Visto, Acero, Vidrio',
        heroImage: heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        detailImage: req.body.detailImage,
        beforeImage: req.body.beforeImage,
        afterImage: req.body.afterImage,
        location: req.body.location || 'Buenos Aires',
        client: req.body.client || 'Privado',
        featured: featured ?? true,
        status: status || 'En curso',
        specs: req.body.specs || {
          'Plazo estimado': '10 meses',
          'Tipo de obra': scope || 'Obra Nueva',
        },
      });

      res.status(201).json(newProject);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.put('/api/projects/:id', (req, res) => {
    try {
      const updated = db.updateProject(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', (req, res) => {
    try {
      const deleted = db.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json({ message: 'Project deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // 3. MESSAGES CRUD
  app.get('/api/messages', (req, res) => {
    try {
      const messages = db.getMessages();
      res.json(messages);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.post('/api/messages', (req, res) => {
    try {
      const { name, email, projectType, estimatedArea, message } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const newMessage = db.addMessage({
        name,
        email,
        projectType: projectType || 'Consulta General',
        estimatedArea: estimatedArea || '',
        message: message || 'Consulta recibida.',
      });

      res.status(201).json(newMessage);
    } catch (err) {
      res.status(500).json({ error: 'Failed to submit message' });
    }
  });

  app.patch('/api/messages/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      if (!status || (status !== 'Pendiente' && status !== 'Respondido')) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const updated = db.updateMessageStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update message status' });
    }
  });

  app.delete('/api/messages/:id', (req, res) => {
    try {
      const deleted = db.deleteMessage(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json({ message: 'Message deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete message' });
    }
  });

  // 4. SERVICES
  app.get('/api/services', (req, res) => {
    try {
      const services = db.getServices();
      res.json(services);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  });

  app.put('/api/services/:id', (req, res) => {
    try {
      const updated = db.updateService(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update service' });
    }
  });

  // 5. SETTINGS / CONTENIDOS
  app.get('/api/settings', (req, res) => {
    try {
      const settings = db.getSettings();
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/settings', (req, res) => {
    try {
      const updated = db.updateSettings(req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE (DEV) & STATIC (PROD)
  // ==========================================
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
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
