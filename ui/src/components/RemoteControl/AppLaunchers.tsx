import { SiNetflix, SiYoutube } from 'react-icons/si';
import { FiMonitor } from 'react-icons/fi';
import { useTVControl } from '../../hooks/useTVControl';
import { useTVStore } from '../../store/tv-store';
import Button from '../common/Button';

export default function AppLaunchers() {
  const { sendCommand, isExecuting } = useTVControl();
  const { availableCommands } = useTVStore();

  // Check which apps are available
  const hasNetflix = availableCommands.includes('Netflix');
  const hasYouTube = availableCommands.includes('YouTube');

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Apps & Input</h3>

      {/* Apps */}
      <div className="grid grid-cols-2 gap-2">
        {hasNetflix && (
          <Button
            label="Netflix"
            onClick={() => sendCommand('Netflix')}
            variant="danger"
            icon={<SiNetflix />}
            disabled={isExecuting}
          />
        )}
        {hasYouTube && (
          <Button
            label="YouTube"
            onClick={() => sendCommand('YouTube')}
            variant="danger"
            icon={<SiYoutube />}
            disabled={isExecuting}
          />
        )}
      </div>

      {/* HDMI Inputs */}
      <div className="grid grid-cols-4 gap-2 mt-2">
        {[1, 2, 3, 4].map((num) => (
          <Button
            key={num}
            label={`HDMI ${num}`}
            onClick={() => sendCommand(`hdmi${num}`)}
            variant="secondary"
            icon={<FiMonitor />}
            disabled={isExecuting}
            className="text-xs"
          />
        ))}
      </div>
    </div>
  );
}
