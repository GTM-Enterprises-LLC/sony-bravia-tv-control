import { Request, Response } from 'express';
import { BraviaService } from '../services/bravia-service';
import { updateRuntimeConfig, getRuntimeConfig } from '../config/environment';

interface SuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
}

/**
 * TV Controller - Handles all TV-related API requests
 */
export class TVController {
  constructor(private braviaService: BraviaService) {}

  /**
   * Get server and TV connection status
   */
  getStatus = async (req: Request, res: Response): Promise<void> => {
    const config = this.braviaService.getConfig();
    const isConnected = this.braviaService.isInitialized();

    const response: SuccessResponse = {
      success: true,
      data: {
        connected: isConnected,
        tvIp: config.tvIp
      },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Get all available commands
   */
  getCommands = async (req: Request, res: Response): Promise<void> => {
    const commands = await this.braviaService.getCommandNames();

    const response: SuccessResponse = {
      success: true,
      data: { commands },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Get current TV status (volume, playing content, power, etc.)
   */
  getTVStatus = async (req: Request, res: Response): Promise<void> => {
    console.log(`[TVController] getTVStatus called`);

    const status = await this.braviaService.getTVStatus();
    console.log(`[TVController] ✓ TV status retrieved`);

    const response: SuccessResponse = {
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Get comprehensive TV information
   */
  getTVInfo = async (req: Request, res: Response): Promise<void> => {
    console.log(`[TVController] getTVInfo called - fetching comprehensive TV information`);

    try {
      const [
        systemInfo,
        externalInputs,
        applications,
        networkSettings,
        ledStatus
      ] = await Promise.allSettled([
        this.braviaService.getSystemInformation(),
        this.braviaService.getCurrentExternalInputsStatus(),
        this.braviaService.getApplicationList(),
        this.braviaService.getNetworkSettings(),
        this.braviaService.getLEDIndicatorStatus()
      ]);

      const info = {
        system: systemInfo.status === 'fulfilled' ? systemInfo.value : null,
        externalInputs: externalInputs.status === 'fulfilled' ? externalInputs.value : null,
        applications: applications.status === 'fulfilled' ? applications.value : null,
        network: networkSettings.status === 'fulfilled' ? networkSettings.value : null,
        led: ledStatus.status === 'fulfilled' ? ledStatus.value : null
      };

      console.log(`[TVController] ✓ TV info retrieved`);

      const response: SuccessResponse = {
        success: true,
        data: info,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error: any) {
      console.error(`[TVController] ✗ Failed to get TV info:`, error);
      throw error;
    }
  };

  /**
   * Execute a specific command by name
   */
  executeCommand = async (req: Request, res: Response): Promise<void> => {
    const { commandName } = req.params;

    if (!commandName) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Command name is required',
          code: 'INVALID_REQUEST'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    await this.braviaService.executeCommand(commandName);

    const response: SuccessResponse = {
      success: true,
      data: { command: commandName },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Power on the TV (using IRCC TvPower command instead of Wake-on-LAN)
   * TvPower works reliably because it uses HTTP/IRCC protocol which the TV responds to even in standby
   */
  powerOn = async (req: Request, res: Response): Promise<void> => {
    // Use TvPower command instead of PowerOn to avoid Wake-on-LAN issues
    // TvPower sends an IRCC command over HTTP which works in standby mode
    await this.braviaService.executeCommand('TvPower');

    const response: SuccessResponse = {
      success: true,
      data: { command: 'TvPower' },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Power off the TV
   */
  powerOff = async (req: Request, res: Response): Promise<void> => {
    await this.braviaService.executeCommand('PowerOff');

    const response: SuccessResponse = {
      success: true,
      data: { command: 'PowerOff' },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Increase volume
   */
  volumeUp = async (req: Request, res: Response): Promise<void> => {
    await this.braviaService.executeCommand('VolumeUp');

    const response: SuccessResponse = {
      success: true,
      data: { command: 'VolumeUp' },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Decrease volume
   */
  volumeDown = async (req: Request, res: Response): Promise<void> => {
    await this.braviaService.executeCommand('VolumeDown');

    const response: SuccessResponse = {
      success: true,
      data: { command: 'VolumeDown' },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Toggle mute
   */
  mute = async (req: Request, res: Response): Promise<void> => {
    await this.braviaService.executeCommand('Mute');

    const response: SuccessResponse = {
      success: true,
      data: { command: 'Mute' },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Next channel
   */
  channelUp = async (req: Request, res: Response): Promise<void> => {
    await this.braviaService.executeCommand('ChannelUp');

    const response: SuccessResponse = {
      success: true,
      data: { command: 'ChannelUp' },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Previous channel
   */
  channelDown = async (req: Request, res: Response): Promise<void> => {
    await this.braviaService.executeCommand('ChannelDown');

    const response: SuccessResponse = {
      success: true,
      data: { command: 'ChannelDown' },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Switch to HDMI input (1-4)
   */
  switchHDMI = async (req: Request, res: Response): Promise<void> => {
    const { number } = req.params;
    const hdmiNumber = parseInt(number, 10);

    if (isNaN(hdmiNumber) || hdmiNumber < 1 || hdmiNumber > 4) {
      res.status(400).json({
        success: false,
        error: {
          message: 'HDMI number must be between 1 and 4',
          code: 'INVALID_REQUEST'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const command = `hdmi${hdmiNumber}`;
    await this.braviaService.executeCommand(command);

    const response: SuccessResponse = {
      success: true,
      data: { command, input: `HDMI ${hdmiNumber}` },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Launch an app (Netflix, YouTube, etc.)
   */
  launchApp = async (req: Request, res: Response): Promise<void> => {
    const { appName } = req.params;

    if (!appName) {
      res.status(400).json({
        success: false,
        error: {
          message: 'App name is required',
          code: 'INVALID_REQUEST'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    await this.braviaService.executeCommand(appName);

    const response: SuccessResponse = {
      success: true,
      data: { app: appName },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Get current TV configuration (non-sensitive)
   */
  getConfig = async (req: Request, res: Response): Promise<void> => {
    const config = this.braviaService.getConfig();

    const response: SuccessResponse = {
      success: true,
      data: {
        tvIp: config.tvIp,
        configured: true
      },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };

  /**
   * Update TV configuration
   */
  updateConfig = async (req: Request, res: Response): Promise<void> => {
    const { tvIp, pskKey, macAddress } = req.body;

    if (!tvIp || !pskKey) {
      res.status(400).json({
        success: false,
        error: {
          message: 'tvIp and pskKey are required',
          code: 'INVALID_REQUEST'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Update runtime configuration (including optional MAC address)
    updateRuntimeConfig({ tvIp, pskKey, macAddress });

    // Reinitialize Bravia service with new config
    await this.braviaService.updateConfig(tvIp, pskKey);

    const response: SuccessResponse = {
      success: true,
      data: { tvIp, message: 'Configuration updated successfully' },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  };
}
