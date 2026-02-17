import { useTVControl } from '../../hooks/useTVControl';
import Button from '../common/Button';

export default function ColorButtons() {
  const { sendCommand, isExecuting } = useTVControl();

  const colors = [
    { name: 'Red', bg: 'bg-red-600 hover:bg-red-700' },
    { name: 'Green', bg: 'bg-green-600 hover:bg-green-700' },
    { name: 'Yellow', bg: 'bg-yellow-600 hover:bg-yellow-700' },
    { name: 'Blue', bg: 'bg-blue-600 hover:bg-blue-700' }
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Color Buttons</h3>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => sendCommand(color.name)}
            disabled={isExecuting}
            className={`${color.bg} text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]`}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
}
