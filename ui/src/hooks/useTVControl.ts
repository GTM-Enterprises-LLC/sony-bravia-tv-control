import { useTVStore } from '../store/tv-store';

/**
 * Custom hook for TV control operations
 * Provides a simplified interface to the TV store
 */
export function useTVControl() {
  const {
    isExecuting,
    error,
    lastCommand,
    executeCommand,
    clearError
  } = useTVStore();

  /**
   * Send a command to the TV
   */
  const sendCommand = async (command: string) => {
    try {
      await executeCommand(command);
    } catch (err) {
      // Error is already handled in the store
      // Just propagate it if needed
    }
  };

  return {
    sendCommand,
    isExecuting,
    error,
    lastCommand,
    clearError
  };
}
