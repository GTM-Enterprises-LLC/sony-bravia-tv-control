import { useState } from 'react';
import { useTVStore } from '../../store/tv-store';
import { FiX } from 'react-icons/fi';
import Button from '../common/Button';

interface ConnectionSettingsProps {
  onClose: () => void;
}

export default function ConnectionSettings({ onClose }: ConnectionSettingsProps) {
  const { tvIp, updateConfig, isLoading } = useTVStore();
  const [formData, setFormData] = useState({
    tvIp: tvIp || '192.168.1.28',
    pskKey: '3553'
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.tvIp || !formData.pskKey) {
      setError('Both TV IP and PSK Key are required');
      return;
    }

    // Validate IP format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(formData.tvIp)) {
      setError('Invalid IP address format');
      return;
    }

    try {
      await updateConfig(formData.tvIp, formData.pskKey);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update configuration');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Connection Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="tvIp" className="block text-sm font-medium text-gray-300 mb-2">
              TV IP Address
            </label>
            <input
              type="text"
              id="tvIp"
              value={formData.tvIp}
              onChange={(e) => setFormData({ ...formData, tvIp: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="192.168.1.100"
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter the IP address of your Sony Bravia TV on your local network
            </p>
          </div>

          <div>
            <label htmlFor="pskKey" className="block text-sm font-medium text-gray-300 mb-2">
              PSK Key
            </label>
            <input
              type="password"
              id="pskKey"
              value={formData.pskKey}
              onChange={(e) => setFormData({ ...formData, pskKey: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0000"
            />
            <p className="mt-1 text-xs text-gray-400">
              Pre-Shared Key configured on your TV (usually 4 digits)
            </p>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
            <p className="text-xs text-blue-200">
              <strong>Setup Help:</strong> On your TV, go to Settings → Network → Home network setup
              → IP Control → Authentication → Normal and Pre-Shared Key, then enter your PSK key.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              label="Cancel"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? 'Connecting...' : 'Save & Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
