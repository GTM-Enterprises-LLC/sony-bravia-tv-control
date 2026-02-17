import { useState } from 'react';
import { useTVStore } from '../../store/tv-store';
import { FiSettings } from 'react-icons/fi';
import ConnectionSettings from '../Settings/ConnectionSettings';

export default function Header() {
  const [showSettings, setShowSettings] = useState(false);
  const { isConnected, tvIp } = useTVStore();

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Sony Bravia Remote</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-400">
                {isConnected ? `Connected to ${tvIp}` : 'Disconnected'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <FiSettings size={24} />
          </button>
        </div>
      </header>

      {showSettings && (
        <ConnectionSettings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}
