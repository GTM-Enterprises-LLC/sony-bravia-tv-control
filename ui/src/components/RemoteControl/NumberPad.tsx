import { useTVControl } from '../../hooks/useTVControl';
import Button from '../common/Button';

export default function NumberPad() {
  const { sendCommand, isExecuting } = useTVControl();

  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0', '11', '12']
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Number Pad</h3>
      {numbers.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-3 gap-2">
          {row.map((num) => (
            <Button
              key={num}
              label={num}
              onClick={() => sendCommand(`Num${num}`)}
              variant="secondary"
              disabled={isExecuting}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
