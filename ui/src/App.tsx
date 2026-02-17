import { useEffect } from 'react';
import { useTVStore } from './store/tv-store';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import RemoteControl from './components/RemoteControl/RemoteControl';

function App() {
  const { fetchStatus, fetchCommands, fetchTVStatus } = useTVStore();

  useEffect(() => {
    // Fetch initial status and commands
    fetchStatus();
    fetchCommands();
    fetchTVStatus();

    // Poll connection status every 10 seconds
    const statusInterval = setInterval(() => {
      fetchStatus();
    }, 10000);

    // Poll TV status (volume, power, etc.) every 5 seconds
    const tvStatusInterval = setInterval(() => {
      fetchTVStatus();
    }, 5000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(tvStatusInterval);
    };
  }, [fetchStatus, fetchCommands, fetchTVStatus]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <RemoteControl />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
