import { FiPower } from 'react-icons/fi';
import { tvApi } from '../../services/api-client';
import { useTVStore } from '../../store/tv-store';
import Button from '../common/Button';

export default function PowerControls() {
  const { isExecuting } = useTVStore();

  const handlePowerOn = async () => {
    try {
      await tvApi.powerOn();
    } catch (error) {
      console.error('Failed to power on:', error);
    }
  };

  const handlePowerOff = async () => {
    try {
      await tvApi.powerOff();
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
    </div>
  );
}
