import { useState } from 'react';
import { useTVStore } from '../../store/tv-store';
import { FiSettings, FiVolume2, FiVolumeX, FiPower } from 'react-icons/fi';
import ConnectionSettings from '../Settings/ConnectionSettings';

export default function Header() {
  const [showSettings, setShowSettings] = useState(false);
  const { isConnected, tvIp, tvStatus } = useTVStore();

  const volume = tvStatus?.volume?.volume ?? null;
  const isMuted = tvStatus?.volume?.mute ?? false;
  const isPowered = tvStatus?.power?.status === 'active';

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
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

          {/* TV Status Bar */}
          {isConnected && tvStatus && (
            <div className="flex items-center gap-4 p-3 bg-gray-750 rounded-lg">
              {/* Power Status */}
              <div className="flex items-center gap-2">
                <FiPower className={isPowered ? 'text-green-400' : 'text-gray-500'} size={18} />
                <span className="text-sm text-gray-300">
                  {isPowered ? 'On' : 'Off'}
                </span>
              </div>

              {/* Volume Status */}
              {volume !== null && (
                <div className="flex items-center gap-2">
                  {isMuted ? (
                    <FiVolumeX className="text-red-400" size={18} />
                  ) : (
                    <FiVolume2 className="text-blue-400" size={18} />
                  )}
                  <span className="text-sm text-gray-300">
                    {isMuted ? 'Muted' : `Vol: ${volume}`}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {showSettings && (
        <ConnectionSettings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}
