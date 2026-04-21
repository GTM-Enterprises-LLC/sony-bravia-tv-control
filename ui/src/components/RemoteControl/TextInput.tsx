import { useEffect, useRef, useState } from 'react';
import { useTVStore } from '../../store/tv-store';
import Button from '../common/Button';

const DEBOUNCE_MS = 400;

export default function TextInput() {
  const sendText = useTVStore((s) => s.sendText);
  const [value, setValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const lastSentRef = useRef<string>('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const push = async (text: string) => {
    if (text === lastSentRef.current) return;
    lastSentRef.current = text;
    setIsSending(true);
    try {
      await sendText(text);
    } catch {
      // Error surfaced via the store's error banner
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => push(value), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const handleSubmit = async () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    await push(value);
  };

  const handleClear = async () => {
    setValue('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    await push('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-400">Keyboard Input</h3>
        <span className="text-xs text-gray-500">
          {isSending ? 'Sending…' : 'Focus a text field on the TV first'}
        </span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Type here to send to TV…"
          className="flex-1 min-w-0 px-3 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[44px]"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <Button label="Send" onClick={handleSubmit} variant="primary" disabled={isSending} />
        <Button label="Clear" onClick={handleClear} variant="secondary" disabled={isSending} />
      </div>
    </div>
  );
}
