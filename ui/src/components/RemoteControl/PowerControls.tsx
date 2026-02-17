import { FiPower } from 'react-icons/fi';
import { tvApi } from '../../services/api-client';
import { useTVStore } from '../../store/tv-store';
import Button from '../common/Button';

export default function PowerControls() {
  const { isExecuting, fetchTVStatus } = useTVStore();

  const handlePowerOn = async () => {
    try {
      await tvApi.powerOn();
      // Refresh TV status after command
      await fetchTVStatus();
    } catch (error) {
      console.error('Failed to power on:', error);
    }
  };

  const handlePowerOff = async () => {
    try {
      await tvApi.powerOff();
      // Refresh TV status after command
      await fetchTVStatus();
    } catch (error) {
      console.error('Failed to power off:', error);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Power</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          label="Power On"
          onClick={handlePowerOn}
          variant="primary"
          icon={<FiPower />}
          disabled={isExecuting}
        />
        <Button
          label="Power Off"
          onClick={handlePowerOff}
          variant="danger"
          icon={<FiPower />}
          disabled={isExecuting}
        />
      </div>
      <div className="text-xs text-gray-400 mt-2 p-2 bg-green-900/20 border border-green-800/30 rounded">
        ℹ️ Power On uses the TV's power button command (works even in standby mode).
      </div>
    </div>
  );
}
