// TypeScript definitions for ../../../lib/index.js

declare module '../../../lib' {
  /**
   * Creates a new Bravia client instance and authenticates with the TV
   * @param ip - TV IP address
   * @param pskKey - Pre-Shared Key for authentication (can be empty string for cookie-based auth)
   * @param callback - Called when authentication is complete with the client instance
   */
  function bravia(ip: string, pskKey: string, callback: (client: BraviaClient) => void): void;

  interface BraviaClient {
    /**
     * Execute a remote control command on the TV
     * @param command - Command name (e.g., 'PowerOn', 'VolumeUp', 'Netflix')
     */
    exec(command: string): void;

    /**
     * Get all available commands from the TV
     * @param callback - Called with an object mapping command names to IR codes
     */
    getCommandList(callback: (commands: Record<string, string>) => void): void;

    /**
     * Get a comma-separated list of all available command names
     * @param callback - Called with a comma-separated string of command names
     */
    getCommandNames(callback: (names: string) => void): void;
  }

  export = bravia;
}
