export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  timestamp: string;
}

export interface StatusResponse {
  connected: boolean;
  tvIp: string;
}

export interface CommandsResponse {
  commands: string[];
}

export interface ConfigResponse {
  tvIp: string;
  configured: boolean;
}

export interface CommandExecutionResponse {
  command: string;
}

export interface UpdateConfigRequest {
  tvIp: string;
  pskKey: string;
  macAddress?: string; // Optional MAC address for Wake-on-LAN
}
