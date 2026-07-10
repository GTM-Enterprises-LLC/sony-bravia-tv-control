import axios, { AxiosInstance } from 'axios';
import type {
  APIResponse,
  StatusResponse,
  CommandsResponse,
  ConfigResponse,
  UpdateConfigRequest,
  TVInfoResponse
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
 * Debug logging for outgoing TV actions.
 *
 * Every button click ultimately becomes one HTTP request through this client,
 * so logging here shows exactly which action is sent to the TV and what came
 * back. Opt-in (also works on the deployed build) — enable in the browser
 * console with:  localStorage.tvDebug = '1'   then reload. Disable: remove it.
 */
const tvDebugEnabled = (): boolean => {
  try {
    return localStorage.getItem('tvDebug') === '1' || import.meta.env.DEV;
  } catch {
    return false;
  }
};

apiClient.interceptors.request.use((config) => {
  if (tvDebugEnabled()) {
    const method = (config.method ?? 'get').toUpperCase();
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
    console.log(
      `%c[TV →]%c ${method} ${url}`,
      'color:#a855f7;font-weight:bold',
      'color:inherit',
      config.data ?? ''
    );
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (tvDebugEnabled()) {
      const url = `${response.config.baseURL ?? ''}${response.config.url ?? ''}`;
      console.log(
        `%c[TV ✓]%c ${response.status} ${url}`,
        'color:#22c55e;font-weight:bold',
        'color:inherit',
        response.data
      );
    }
    return response;
  },
  (error) => {
    if (tvDebugEnabled()) {
      const cfg = error.config ?? {};
      const url = `${cfg.baseURL ?? ''}${cfg.url ?? ''}`;
      console.error(
        `%c[TV ✗]%c ${error.response?.status ?? 'ERR'} ${cfg.method?.toUpperCase() ?? ''} ${url}`,
        'color:#ef4444;font-weight:bold',
        'color:inherit',
        error.response?.data ?? error.message
      );
    }
    return Promise.reject(error);
  }
);

if (typeof window !== 'undefined' && !import.meta.env.DEV) {
  // One-time hint so the toggle is discoverable in production.
  console.info("[TV] Debug logging available: run  localStorage.tvDebug = '1'  and reload to trace actions.");
}

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
   * Get comprehensive TV info (external inputs, apps, system info)
   */
  getTVInfo: () =>
    apiClient.get<APIResponse<TVInfoResponse>>('/tv-info'),

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
    apiClient.post<APIResponse>(`/apps/${appName}`),

  sendText: (text: string) =>
    apiClient.post<APIResponse>('/text', { text }),

  getText: () =>
    apiClient.get<APIResponse>('/text')
};
