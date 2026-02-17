import { useEffect } from 'react';
import { useTVStore } from './store/tv-store';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import RemoteControl from './components/RemoteControl/RemoteControl';

function App() {
  const { fetchStatus, fetchCommands } = useTVStore();

  useEffect(() => {
    // Fetch initial status and commands
    fetchStatus();
    fetchCommands();

    // Poll status every 10 seconds
    const interval = setInterval(() => {
      fetchStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchStatus, fetchCommands]);

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
