import { useState } from 'react';
import { useTVStore } from '../../store/tv-store';
import { FiSettings, FiVolume2, FiVolumeX, FiPower, FiMonitor, FiTv, FiRadio } from 'react-icons/fi';
import ConnectionSettings from '../Settings/ConnectionSettings';
import type { PlayingContent } from '../../types/api';

function getInputLabel(source?: string): string | null {
  if (!source) return null;
  const hdmi = source.match(/extInput:hdmi\?port=(\d+)/);
  if (hdmi) return `HDMI ${hdmi[1]}`;
  const component = source.match(/extInput:component\?port=(\d+)/);
  if (component) return `Component ${component[1]}`;
  const composite = source.match(/extInput:composite\?port=(\d+)/);
  if (composite) return `Composite ${composite[1]}`;
  if (source.startsWith('tv:') || source.startsWith('dvb:')) return 'Broadcast TV';
  return null;
}

function getPlayingText(playing: PlayingContent): string | null {
  const parts: string[] = [];
  if (playing.dispNum) parts.push(playing.dispNum);
  if (playing.programTitle) parts.push(playing.programTitle);
  else if (playing.title) parts.push(playing.title);
  return parts.length > 0 ? parts.join(' · ') : null;
}

function getPlayingIcon(playing: PlayingContent) {
  const source = playing.source ?? '';
  if (source.startsWith('extInput:hdmi')) return FiMonitor;
  if (source.startsWith('tv:') || source.startsWith('dvb:')) return FiRadio;
  return FiTv;
}

export default function Header() {
  const [showSettings, setShowSettings] = useState(false);
  const { isConnected, tvIp, tvStatus, tvInfo } = useTVStore();

  const volume = tvStatus?.volume?.volume ?? null;
  const isMuted = tvStatus?.volume?.mute ?? false;
  const isPowered = tvStatus?.power?.status === 'active';
  const playing = tvStatus?.playing ?? null;

  const inputLabel = playing ? getInputLabel(playing.source) : null;
  const playingText = playing ? getPlayingText(playing) : null;
  const PlayingIcon = playing ? getPlayingIcon(playing) : FiTv;

  // Connected external inputs from tvInfo
  const connectedInputs = tvInfo?.externalInputs
    ?.filter(i => i.status && i.status !== 'notConnected')
    ?? null;

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
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3 bg-gray-750 rounded-lg">
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

                {/* Current Input */}
                {inputLabel && (
                  <div className="flex items-center gap-2">
                    <FiMonitor className="text-purple-400" size={18} />
                    <span className="text-sm text-gray-300">{inputLabel}</span>
                  </div>
                )}

                {/* Playing Content */}
                {playingText && (
                  <div className="flex items-center gap-2 min-w-0">
                    <PlayingIcon className="text-yellow-400 shrink-0" size={18} />
                    <span className="text-sm text-gray-300 truncate">{playingText}</span>
                  </div>
                )}
              </div>

              {/* Connected External Inputs */}
              {connectedInputs && connectedInputs.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 px-1">
                  <span className="text-xs text-gray-500">Inputs:</span>
                  {connectedInputs.map((input) => (
                    <span
                      key={input.uri ?? input.title}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        inputLabel && (input.title === inputLabel || input.label === inputLabel)
                          ? 'bg-purple-900 text-purple-300'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {input.label || input.title}
                    </span>
                  ))}
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
