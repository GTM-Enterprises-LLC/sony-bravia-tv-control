import axios, { AxiosInstance } from 'axios';
import type {
  APIResponse,
  StatusResponse,
  CommandsResponse,
  ConfigResponse,
  UpdateConfigRequest
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/**
 * Axios client instance with default configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * TV API service with typed methods
 */
export const tvApi = {
  /**
   * Get server and TV connection status
   */
  getStatus: () =>
    apiClient.get<APIResponse<StatusResponse>>('/status'),

  /**
   * Get all available commands
   */
  getCommands: () =>
    apiClient.get<APIResponse<CommandsResponse>>('/commands'),

  /**
   * Get current TV status (volume, power, playing content)
   */
  getTVStatus: () =>
    apiClient.get<APIResponse>('/tv-status'),

  /**
   * Execute a specific command by name
   */
  executeCommand: (command: string) =>
    apiClient.post<APIResponse>(`/commands/${command}`),

  /**
   * Get current TV configuration
   */
  getConfig: () =>
    apiClient.get<APIResponse<ConfigResponse>>('/config'),

  /**
   * Update TV configuration
   */
  updateConfig: (config: UpdateConfigRequest) =>
    apiClient.put<APIResponse>('/config', config),

  // Convenience methods for common commands
  powerOn: () =>
    apiClient.post<APIResponse>('/power/on'),

  powerOff: () =>
    apiClient.post<APIResponse>('/power/off'),

  volumeUp: () =>
    apiClient.post<APIResponse>('/volume/up'),

  volumeDown: () =>
    apiClient.post<APIResponse>('/volume/down'),

  mute: () =>
    apiClient.post<APIResponse>('/volume/mute'),

  channelUp: () =>
    apiClient.post<APIResponse>('/channel/up'),

  channelDown: () =>
    apiClient.post<APIResponse>('/channel/down'),

  switchHDMI: (number: number) =>
    apiClient.post<APIResponse>(`/input/hdmi/${number}`),

  launchApp: (appName: string) =>
    apiClient.post<APIResponse>(`/apps/${appName}`)
};
