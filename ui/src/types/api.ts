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

export interface PlayingContent {
  uri?: string;
  source?: string;
  title?: string;
  dispNum?: string;
  programTitle?: string;
  startDateTime?: string;
  durationSec?: number;
  mediaType?: string;
  contentKind?: string;
}

export interface ExternalInput {
  uri?: string;
  title?: string;
  status?: string;
  label?: string;
  icon?: string;
}

export interface TVInfoResponse {
  system: any | null;
  externalInputs: ExternalInput[] | null;
  applications: any | null;
  network: any | null;
  led: any | null;
}
