import { useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import { SiNetflix, SiYoutube, SiHbo, SiTubi, SiSpotify } from 'react-icons/si';
import { FiMonitor, FiPlayCircle, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useTVControl } from '../../hooks/useTVControl';
import { useTVStore } from '../../store/tv-store';
import type { BraviaApp } from '../../types/api';
import Button from '../common/Button';

// Curated quick-launch favorites, matched by the title the TV reports.
// Apps not installed on the TV are simply skipped.
const FAVORITES: { title: string; icon?: IconType }[] = [
  { title: 'Netflix', icon: SiNetflix },
  { title: 'YouTube', icon: SiYoutube },
  { title: 'Disney+' },
  { title: 'Prime Video' },
  { title: 'HBO Max', icon: SiHbo },
  { title: 'Tubi', icon: SiTubi },
  { title: 'Pluto TV' },
  { title: 'Spotify', icon: SiSpotify },
];

export default function AppLaunchers() {
  const { sendCommand, isExecuting } = useTVControl();
  const { tvInfo, launchAppByUri } = useTVStore();
  const [showAll, setShowAll] = useState(false);

  // getApplicationList comes back nested ([[...]]); flatten and keep valid apps.
  const apps: BraviaApp[] = useMemo(
    () => (tvInfo?.applications ?? []).flat().filter((a) => a && a.uri && a.title),
    [tvInfo]
  );

  const byTitle = useMemo(() => {
    const m = new Map<string, BraviaApp>();
    for (const a of apps) m.set(a.title.toLowerCase(), a);
    return m;
  }, [apps]);

  const favorites = FAVORITES
    .map((f) => ({ ...f, app: byTitle.get(f.title.toLowerCase()) }))
    .filter((f): f is typeof f & { app: BraviaApp } => Boolean(f.app));

  const sortedApps = useMemo(
    () => apps.slice().sort((a, b) => a.title.localeCompare(b.title)),
    [apps]
  );

  const launch = (uri: string) => {
    launchAppByUri(uri).catch(() => {
      /* error surfaced via store */
    });
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Apps & Input</h3>

      {/* Favorite apps */}
      {favorites.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {favorites.map((f) => {
            const Icon = f.icon ?? FiPlayCircle;
            return (
              <Button
                key={f.title}
                label={f.title}
                onClick={() => launch(f.app.uri)}
                variant="primary"
                icon={<Icon />}
                disabled={isExecuting}
              />
            );
          })}
        </div>
      )}

      {/* All installed apps (browse & launch anything) */}
      {apps.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            {showAll ? <FiChevronDown /> : <FiChevronRight />}
            All Apps ({apps.length})
          </button>
          {showAll && (
            <div className="mt-2 max-h-64 overflow-y-auto grid grid-cols-2 gap-2 pr-1">
              {sortedApps.map((app) => (
                <Button
                  key={app.uri}
                  label={app.title}
                  onClick={() => launch(app.uri)}
                  variant="secondary"
                  icon={<FiPlayCircle />}
                  disabled={isExecuting}
                  className="text-xs"
                />
              ))}
            </div>
          )}
        </div>
      )}

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
