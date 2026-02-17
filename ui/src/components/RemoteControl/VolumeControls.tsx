import { FiVolumeX, FiVolume2 } from 'react-icons/fi';
import { BiVolumeFull } from 'react-icons/bi';
import { useTVControl } from '../../hooks/useTVControl';
import Button from '../common/Button';

export default function VolumeControls() {
  const { sendCommand, isExecuting } = useTVControl();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Volume</h3>
      <div className="grid grid-cols-3 gap-2">
        <Button
          label="Vol +"
          onClick={() => sendCommand('VolumeUp')}
          variant="secondary"
          icon={<BiVolumeFull />}
          disabled={isExecuting}
        />
        <Button
          label="Vol -"
          onClick={() => sendCommand('VolumeDown')}
          variant="secondary"
          icon={<FiVolume2 />}
          disabled={isExecuting}
        />
        <Button
          label="Mute"
          onClick={() => sendCommand('Mute')}
          variant="secondary"
          icon={<FiVolumeX />}
          disabled={isExecuting}
        />
      </div>
    </div>
  );
}
