interface BraviaClient {
  exec(command: string): void;
  getCommandList(callback: (commands: Record<string, string>) => void): void;
  getCommandNames(callback: (names: string) => void): void;
}

declare function bravia(
  ip: string,
  pskKey: string,
  callback: (client: BraviaClient) => void
): void;

export = bravia;
