import bravia from '../../../lib';
import type { BraviaClient } from '../types/bravia';
import fs from 'fs';
import path from 'path';

/**
 * Service class that wraps the callback-based bravia library with a Promise-based interface
 */
export class BraviaService {
  private client: BraviaClient | null = null;
  private tvIp: string;
  private pskKey: string;
  private commandListCache: Record<string, string> | null = null;

  constructor(tvIp: string, pskKey: string) {
    this.tvIp = tvIp;
    this.pskKey = pskKey;
    this.ensureCookiesFile();
  }

  /**
   * Ensure cookies.json file exists
   * The bravia library requires this file to store authentication cookies
   */
  private ensureCookiesFile(): void {
    const cookiesPath = path.join(process.cwd(), 'cookies.json');
    if (!fs.existsSync(cookiesPath)) {
      fs.writeFileSync(cookiesPath, '{}', 'utf-8');
      console.log('Created cookies.json file');
    }
  }

  /**
   * Initialize the Bravia client with authentication
   */
  async initialize(): Promise<void> {
    console.log(`[BraviaService] Initializing connection to TV at ${this.tvIp}...`);
    return new Promise((resolve, reject) => {
      try {
        bravia(this.tvIp, this.pskKey, (client) => {
          this.client = client;
          console.log(`[BraviaService] ✓ Successfully connected to TV at ${this.tvIp}`);
          resolve();
        });
      } catch (error) {
        console.error(`[BraviaService] ✗ Failed to connect to TV at ${this.tvIp}:`, error);
        reject(error);
      }
    });
  }

  /**
   * Execute a command on the TV
   * @param command - Command name (e.g., 'PowerOn', 'VolumeUp', 'Netflix')
   */
  async executeCommand(command: string): Promise<void> {
    if (!this.client) {
      console.log(`[BraviaService] Client not initialized, initializing...`);
      await this.initialize();
    }

    console.log(`[BraviaService] Executing command: ${command}`);
    return new Promise((resolve, reject) => {
      try {
        this.client!.exec(command);
        console.log(`[BraviaService] ✓ Command sent: ${command}`);
        // exec() doesn't have a callback, so wait a bit before resolving
        setTimeout(() => resolve(), 500);
      } catch (error) {
        console.error(`[BraviaService] ✗ Failed to execute command ${command}:`, error);
        reject(error);
      }
    });
  }

  /**
   * Get all available commands from the TV
   * Results are cached to avoid repeated API calls
   */
  async getCommandList(): Promise<Record<string, string>> {
    if (this.commandListCache) {
      console.log(`[BraviaService] Returning cached command list (${Object.keys(this.commandListCache).length} commands)`);
      return this.commandListCache;
    }

    if (!this.client) {
      console.log(`[BraviaService] Client not initialized, initializing...`);
      await this.initialize();
    }

    console.log(`[BraviaService] Fetching command list from TV...`);
    return new Promise((resolve, reject) => {
      try {
        this.client!.getCommandList((commands) => {
          this.commandListCache = commands;
          console.log(`[BraviaService] ✓ Received ${Object.keys(commands).length} commands from TV`);
          resolve(commands);
        });
      } catch (error) {
        console.error(`[BraviaService] ✗ Failed to fetch command list:`, error);
        reject(error);
      }
    });
  }

  /**
   * Get a list of all available command names
   */
  async getCommandNames(): Promise<string[]> {
    const commands = await this.getCommandList();
    return Object.keys(commands);
  }

  /**
   * Update the TV configuration and reinitialize the client
   */
  async updateConfig(tvIp: string, pskKey: string): Promise<void> {
    console.log(`[BraviaService] Updating configuration - New TV IP: ${tvIp}`);
    this.tvIp = tvIp;
    this.pskKey = pskKey;
    this.client = null; // Reset client to force reinitialization
    this.commandListCache = null; // Clear cache
    console.log(`[BraviaService] Configuration updated, reinitializing connection...`);
    await this.initialize();
  }

  /**
   * Get current TV configuration
   */
  getConfig(): { tvIp: string } {
    return { tvIp: this.tvIp };
    // Note: We don't return pskKey for security reasons
  }

  /**
   * Check if the client is initialized
   */
  isInitialized(): boolean {
    return this.client !== null;
  }

  /**
   * Get current TV status (volume, input, playing content, etc.)
   * Uses Sony's JSON-RPC API
   */
  async getTVStatus(): Promise<any> {
    console.log(`[BraviaService] Fetching TV status...`);

    try {
      const [volumeInfo, playingContent, powerStatus] = await Promise.allSettled([
        this.getVolumeInformation(),
        this.getPlayingContentInfo(),
        this.getPowerStatus()
      ]);

      const status = {
        volume: volumeInfo.status === 'fulfilled' ? volumeInfo.value : null,
        playing: playingContent.status === 'fulfilled' ? playingContent.value : null,
        power: powerStatus.status === 'fulfilled' ? powerStatus.value : null
      };

      console.log(`[BraviaService] ✓ TV status retrieved`);
      return status;
    } catch (error) {
      console.error(`[BraviaService] ✗ Failed to get TV status:`, error);
      throw error;
    }
  }

  /**
   * Get volume information from TV
   */
  private async getVolumeInformation(): Promise<any> {
    return this.makeJsonRpcRequest('/sony/audio', 'getVolumeInformation', '1.0', []);
  }

  /**
   * Get currently playing content
   */
  private async getPlayingContentInfo(): Promise<any> {
    return this.makeJsonRpcRequest('/sony/avContent', 'getPlayingContentInfo', '1.0', []);
  }

  /**
   * Get power status
   */
  private async getPowerStatus(): Promise<any> {
    return this.makeJsonRpcRequest('/sony/system', 'getPowerStatus', '1.0', []);
  }

  /**
   * Make a JSON-RPC request to the TV
   */
  private async makeJsonRpcRequest(path: string, method: string, version: string, params: any[]): Promise<any> {
    const axios = require('axios');

    const url = `http://${this.tvIp}${path}`;
    const headers: any = {
      'Content-Type': 'application/json'
    };

    // Add PSK key if provided
    if (this.pskKey) {
      headers['X-Auth-PSK'] = this.pskKey;
    }

    const payload = {
      id: Math.floor(Math.random() * 1000),
      method,
      version,
      params
    };

    console.log(`[BraviaService] JSON-RPC Request: ${method} to ${path}`);

    try {
      const response = await axios.post(url, payload, { headers, timeout: 5000 });

      if (response.data.error) {
        console.log(`[BraviaService] API Error: ${response.data.error.message}`);
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Authentication failed - check PSK key');
      }
      throw error;
    }
  }
}
