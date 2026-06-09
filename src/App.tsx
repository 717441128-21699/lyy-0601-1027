import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Layout/Header';
import ViewTabs from './components/Layout/ViewTabs';
import FilterBar from './components/common/FilterBar';
import Overview from './components/Overview/Overview';
import FloorMap from './components/FloorMap/FloorMap';
import Schedule from './components/Schedule/Schedule';
import FaultRanking from './components/FaultRanking/FaultRanking';
import CostTrend from './components/CostTrend/CostTrend';
import { useAssetStore } from './store/useAssetStore';
import { useFullscreen } from './hooks/useFullscreen';

function App() {
  const { currentView, isFullscreen: storeFullscreen, toggleFullscreen } = useAssetStore();
  const { enterFullscreen, exitFullscreen } = useFullscreen();

  useEffect(() => {
    if (storeFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }, [storeFullscreen, enterFullscreen, exitFullscreen]);

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Overview key="overview" />;
      case 'floorMap':
        return <FloorMap key="floorMap" />;
      case 'schedule':
        return <Schedule key="schedule" />;
      case 'faultRanking':
        return <FaultRanking key="faultRanking" />;
      case 'costTrend':
        return <CostTrend key="costTrend" />;
      default:
        return <Overview key="overview" />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-gradient text-white font-sans overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <Header />
        <ViewTabs />
        <FilterBar />
        
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
