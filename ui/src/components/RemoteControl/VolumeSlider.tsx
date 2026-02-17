import { useTVStore } from '../../store/tv-store';
import { tvApi } from '../../services/api-client';
import { FiVolumeX, FiVolume2 } from 'react-icons/fi';

export default function VolumeSlider() {
  const { tvStatus, isExecuting, fetchTVStatus } = useTVStore();

  const volume = tvStatus?.volume?.volume ?? 0;
  const isMuted = tvStatus?.volume?.mute ?? false;
  const maxVolume = tvStatus?.volume?.maxVolume ?? 100;

  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    const currentVolume = volume;
    const diff = newVolume - currentVolume;

    // Send volume up or down commands based on difference
    if (diff > 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        await tvApi.volumeUp();
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        await tvApi.volumeDown();
      }
    }

    // Refresh TV status after volume change
    await fetchTVStatus();
  };

  const handleMuteToggle = async () => {
    await tvApi.mute();
    // Refresh TV status after mute toggle
    await fetchTVStatus();
  };

  if (!tvStatus?.volume) {
    return null;
  }

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleMuteToggle}
          disabled={isExecuting}
          className={`p-2 rounded-lg transition-colors ${
            isMuted ? 'text-red-400 bg-red-900/30' : 'text-gray-300 hover:text-white hover:bg-gray-600'
          } disabled:opacity-50`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
        </button>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Volume</span>
            <span className="text-sm font-semibold text-white">{volume}</span>
          </div>
          <input
            type="range"
            min="0"
            max={maxVolume}
            value={volume}
            onChange={handleVolumeChange}
            disabled={isExecuting || isMuted}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
