import { FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiCircle, FiCornerDownLeft, FiHome, FiMenu, FiList } from 'react-icons/fi';
import { useTVControl } from '../../hooks/useTVControl';
import Button from '../common/Button';

export default function NavigationPad() {
  const { sendCommand, isExecuting } = useTVControl();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Navigation</h3>
      <div className="grid grid-cols-3 gap-2">
        <div></div>
        <Button
          onClick={() => sendCommand('Up')}
          variant="secondary"
          icon={<FiArrowUp size={20} />}
          disabled={isExecuting}
        />
        <div></div>

        <Button
          onClick={() => sendCommand('Left')}
          variant="secondary"
          icon={<FiArrowLeft size={20} />}
          disabled={isExecuting}
        />
        <Button
          label="OK"
          onClick={() => sendCommand('Confirm')}
          variant="primary"
          icon={<FiCircle />}
          disabled={isExecuting}
        />
        <Button
          onClick={() => sendCommand('Right')}
          variant="secondary"
          icon={<FiArrowRight size={20} />}
          disabled={isExecuting}
        />

        <div></div>
        <Button
          onClick={() => sendCommand('Down')}
          variant="secondary"
          icon={<FiArrowDown size={20} />}
          disabled={isExecuting}
        />
        <div></div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        <Button
          label="Home"
          onClick={() => sendCommand('Home')}
          variant="secondary"
          icon={<FiHome />}
          disabled={isExecuting}
        />
        <Button
          label="Return"
          onClick={() => sendCommand('Return')}
          variant="secondary"
          icon={<FiCornerDownLeft />}
          disabled={isExecuting}
        />
        <Button
          label="Options"
          onClick={() => sendCommand('Options')}
          variant="secondary"
          icon={<FiMenu />}
          disabled={isExecuting}
        />
      </div>

      <div className="flex justify-center mt-2">
        <Button
          label="Guide"
          onClick={() => sendCommand('GGuide')}
          variant="secondary"
          icon={<FiList />}
          disabled={isExecuting}
        />
      </div>
    </div>
  );
}
