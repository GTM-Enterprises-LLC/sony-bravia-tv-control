import { create } from 'zustand';
import { tvApi } from '../services/api-client';

interface TVState {
  // Connection state
  isConnected: boolean;
  tvIp: string | null;

  // Commands
  availableCommands: string[];
  isExecuting: boolean;
  lastCommand: string | null;

  // Errors
  error: string | null;

  // Loading state
  isLoading: boolean;

  // Actions
  fetchStatus: () => Promise<void>;
  fetchCommands: () => Promise<void>;
  executeCommand: (command: string) => Promise<void>;
  updateConfig: (tvIp: string, pskKey: string) => Promise<void>;
  clearError: () => void;
}

export const useTVStore = create<TVState>((set, get) => ({
  // Initial state
  isConnected: false,
  tvIp: null,
  availableCommands: [],
  isExecuting: false,
  lastCommand: null,
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
  updateConfig: async (tvIp: string, pskKey: string) => {
    set({ isLoading: true, error: null });
    try {
      await tvApi.updateConfig({ tvIp, pskKey });
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

  // Clear error message
  clearError: () => {
    set({ error: null });
  }
}));
