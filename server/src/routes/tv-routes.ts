import { Router } from 'express';
import { TVController } from '../controllers/tv-controller';
import { asyncHandler } from '../middleware/error-handler';

/**
 * Create and configure TV API routes
 * @param controller - Instance of TVController
 * @returns Configured Express router
 */
export function createTVRoutes(controller: TVController): Router {
  const router = Router();

  // Status and discovery routes
  router.get('/status', asyncHandler(controller.getStatus));
  router.get('/commands', asyncHandler(controller.getCommands));
  router.get('/tv-status', asyncHandler(controller.getTVStatus));
  router.get('/tv-info', asyncHandler(controller.getTVInfo));

  // Configuration routes
  router.get('/config', asyncHandler(controller.getConfig));
  router.put('/config', asyncHandler(controller.updateConfig));

  // Dynamic command execution
  router.post('/commands/:commandName', asyncHandler(controller.executeCommand));

  // Power control
  router.post('/power/on', asyncHandler(controller.powerOn));
  router.post('/power/off', asyncHandler(controller.powerOff));

  // Volume control
  router.post('/volume/up', asyncHandler(controller.volumeUp));
  router.post('/volume/down', asyncHandler(controller.volumeDown));
  router.post('/volume/mute', asyncHandler(controller.mute));

  // Channel control
  router.post('/channel/up', asyncHandler(controller.channelUp));
  router.post('/channel/down', asyncHandler(controller.channelDown));

  // Input control
  router.post('/input/hdmi/:number', asyncHandler(controller.switchHDMI));

  // App launcher
  router.post('/apps/:appName', asyncHandler(controller.launchApp));

  return router;
}
