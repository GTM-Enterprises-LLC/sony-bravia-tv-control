import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useTVControl } from '../../hooks/useTVControl';
import Button from '../common/Button';

export default function ChannelControls() {
  const { sendCommand, isExecuting } = useTVControl();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Channels</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          label="CH +"
          onClick={() => sendCommand('ChannelUp')}
          variant="secondary"
          icon={<FiChevronUp />}
          disabled={isExecuting}
        />
        <Button
          label="CH -"
          onClick={() => sendCommand('ChannelDown')}
          variant="secondary"
          icon={<FiChevronDown />}
          disabled={isExecuting}
        />
      </div>
    </div>
  );
}
