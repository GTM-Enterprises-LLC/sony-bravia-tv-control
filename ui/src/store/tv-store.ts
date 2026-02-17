import { create } from 'zustand';
import { tvApi } from '../services/api-client';

interface TVStatus {
  volume: {
    volume: number;
    mute: boolean;
    maxVolume: number;
    minVolume: number;
  } | null;
  power: {
    status: string;
  } | null;
  playing: any | null;
}

interface TVState {
  // Connection state
  isConnected: boolean;
  tvIp: string | null;

  // Commands
  availableCommands: string[];
  isExecuting: boolean;
  lastCommand: string | null;

  // TV Status
  tvStatus: TVStatus | null;

  // Errors
  error: string | null;

  // Loading state
  isLoading: boolean;

  // Actions
  fetchStatus: () => Promise<void>;
  fetchCommands: () => Promise<void>;
  fetchTVStatus: () => Promise<void>;
  executeCommand: (command: string) => Promise<void>;
  updateConfig: (tvIp: string, pskKey: string, macAddress?: string) => Promise<void>;
  clearError: () => void;
}

export const useTVStore = create<TVState>((set, get) => ({
  // Initial state
  isConnected: false,
  tvIp: null,
  availableCommands: [],
  isExecuting: false,
  lastCommand: null,
  tvStatus: null,
  error: null,
  isLoading: false,

  // Fetch TV connection status
  fetchStatus: async () => {
    try {
      const response = await tvApi.getStatus();
      if (response.data.success && response.data.data) {
        set({
          isConnected: response.data.data.connected,
          tvIp: response.data.data.tvIp,
          error: null
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to fetch status';
      set({ error: errorMessage, isConnected: false });
      console.error('Failed to fetch status:', error);
    }
  },

  // Fetch available commands
  fetchCommands: async () => {
    set({ isLoading: true });
    try {
      const response = await tvApi.getCommands();
      if (response.data.success && response.data.data) {
        set({
          availableCommands: response.data.data.commands,
          error: null,
          isLoading: false
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to fetch commands';
      set({ error: errorMessage, isLoading: false });
      console.error('Failed to fetch commands:', error);
    }
  },

  // Execute a command
  executeCommand: async (command: string) => {
    set({ isExecuting: true, error: null });
    try {
      await tvApi.executeCommand(command);
      set({
        isExecuting: false,
        lastCommand: command,
        error: null
      });

      // Fetch updated TV status after command execution
      await get().fetchTVStatus();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || `Failed to execute command: ${command}`;
      set({
        isExecuting: false,
        error: errorMessage
      });
      console.error(`Failed to execute command ${command}:`, error);
      throw error;
    }
  },

  // Update TV configuration
  updateConfig: async (tvIp: string, pskKey: string, macAddress?: string) => {
    set({ isLoading: true, error: null });
    try {
      await tvApi.updateConfig({ tvIp, pskKey, macAddress });
      set({
        isLoading: false,
        tvIp,
        error: null
      });
      // Refresh status and commands after config update
      await get().fetchStatus();
      await get().fetchCommands();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to update configuration';
      set({
        isLoading: false,
        error: errorMessage
      });
      console.error('Failed to update config:', error);
      throw error;
    }
  },

  // Fetch TV status (volume, power, etc.)
  fetchTVStatus: async () => {
    try {
      const response = await tvApi.getTVStatus();
      if (response.data.success && response.data.data) {
        const rawStatus = response.data.data;

        // Parse volume info (it comes as nested array)
        let volumeInfo = null;
        if (rawStatus.volume && Array.isArray(rawStatus.volume) && rawStatus.volume[0] && rawStatus.volume[0][0]) {
          volumeInfo = rawStatus.volume[0][0];
        }

        // Parse power info
        let powerInfo = null;
        if (rawStatus.power && Array.isArray(rawStatus.power) && rawStatus.power[0]) {
          powerInfo = rawStatus.power[0];
        }

        set({
          tvStatus: {
            volume: volumeInfo,
            power: powerInfo,
            playing: rawStatus.playing
          },
          error: null
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch TV status:', error);
      // Don't set error for status fetch failures (non-critical)
    }
  },

  // Clear error message
  clearError: () => {
    set({ error: null });
  }
}));
