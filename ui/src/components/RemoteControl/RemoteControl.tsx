import PowerControls from './PowerControls';
import VolumeControls from './VolumeControls';
import VolumeSlider from './VolumeSlider';
import NavigationPad from './NavigationPad';
import ChannelControls from './ChannelControls';
import NumberPad from './NumberPad';
import ColorButtons from './ColorButtons';
import AppLaunchers from './AppLaunchers';
import { useTVStore } from '../../store/tv-store';

export default function RemoteControl() {
  const { error, clearError } = useTVStore();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center justify-between">
          <span className="text-red-200">{error}</span>
          <button
            onClick={clearError}
            className="text-red-200 hover:text-white font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Remote Control Layout */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-2xl space-y-6">
        <PowerControls />
        <div className="border-t border-gray-700 pt-6">
          <VolumeSlider />
        </div>
        <div className="border-t border-gray-700 pt-6">
          <VolumeControls />
        </div>
        <div className="border-t border-gray-700 pt-6">
          <NavigationPad />
        </div>
        <div className="border-t border-gray-700 pt-6">
          <ChannelControls />
        </div>
        <div className="border-t border-gray-700 pt-6">
          <NumberPad />
        </div>
        <div className="border-t border-gray-700 pt-6">
          <ColorButtons />
        </div>
        <div className="border-t border-gray-700 pt-6">
          <AppLaunchers />
        </div>
      </div>
    </div>
  );
}
