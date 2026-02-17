import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env, getRuntimeConfig } from './config/environment';
import { BraviaService } from './services/bravia-service';
import { TVController } from './controllers/tv-controller';
import { createTVRoutes } from './routes/tv-routes';
import { errorHandler } from './middleware/error-handler';

/**
 * Initialize and start the Express server
 */
async function startServer() {
  // Create Express app
  const app = express();

  // Middleware (must be before custom logger to parse body)
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  }));
  app.use(express.json());

  // Logging middleware
  app.use(morgan('dev')); // Logs: :method :url :status :response-time ms

  // Custom request logger
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('  Body:', JSON.stringify(req.body, null, 2));
    }
    next();
  });

  // Initialize Bravia service with configuration
  const config = getRuntimeConfig();
  const braviaService = new BraviaService(config.tvIp, config.pskKey);

  // Initialize TV controller
  const tvController = new TVController(braviaService);

  // Mount API routes
  const apiRouter = createTVRoutes(tvController);
  app.use('/api/v1', apiRouter);

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      name: 'Sony Bravia TV Control API',
      version: '2.0.0',
      endpoints: {
        status: '/api/v1/status',
        commands: '/api/v1/commands',
        config: '/api/v1/config'
      }
    });
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  // Start server
  app.listen(env.PORT, () => {
    console.log('┌─────────────────────────────────────────┐');
    console.log('│  Sony Bravia TV Control Server         │');
    console.log('├─────────────────────────────────────────┤');
    console.log(`│  Environment: ${env.NODE_ENV.padEnd(25)} │`);
    console.log(`│  Port:        ${env.PORT.toString().padEnd(25)} │`);
    console.log(`│  TV IP:       ${config.tvIp.padEnd(25)} │`);
    console.log(`│  CORS Origin: ${env.CORS_ORIGIN.padEnd(25)} │`);
    console.log('└─────────────────────────────────────────┘');
    console.log(`\nServer running at http://localhost:${env.PORT}`);
    console.log(`API available at http://localhost:${env.PORT}/api/v1\n`);
  });
}

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
