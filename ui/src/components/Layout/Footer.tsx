import { useTVStore } from '../../store/tv-store';

export default function Footer() {
  const { lastCommand, isExecuting, error } = useTVStore();

  return (
    <footer className="bg-gray-800 border-t border-gray-700 px-6 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-400">
            {isExecuting && (
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Executing command...
              </span>
            )}
            {!isExecuting && lastCommand && (
              <span className="text-green-400">
                Last command: {lastCommand}
              </span>
            )}
            {!isExecuting && !lastCommand && !error && (
              <span>Ready</span>
            )}
            {error && (
              <span className="text-red-400">{error}</span>
            )}
          </div>
          <div className="text-gray-500 text-xs">
            © 2026 Sony Bravia Remote
          </div>
        </div>
      </div>
    </footer>
  );
}
