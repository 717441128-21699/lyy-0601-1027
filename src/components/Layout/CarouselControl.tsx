import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Settings, X } from 'lucide-react';
import { useAssetStore } from '../../store/useAssetStore';
import { useCarousel } from '../../hooks/useCarousel';
import { useState } from 'react';

const VIEW_LABELS: Record<string, string> = {
  overview: '总览',
  floorMap: '楼层地图',
  schedule: '维保日程',
  faultRanking: '故障排行',
  costTrend: '费用趋势'
};

const CarouselControl = () => {
  const { carousel, setCarouselEnabled, setCarouselInterval, setCarouselPaused } = useAssetStore();
  const { enabled, paused, interval, currentView, viewOrder, goToNext, goToPrev, togglePause } = useCarousel();
  const [showSettings, setShowSettings] = useState(false);

  const intervalOptions = [
    { value: 5000, label: '5秒' },
    { value: 10000, label: '10秒' },
    { value: 15000, label: '15秒' },
    { value: 30000, label: '30秒' },
    { value: 60000, label: '1分钟' },
  ];

  if (!enabled) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setCarouselEnabled(true)}
        className="btn-primary flex items-center gap-2 px-4 py-2"
      >
        <Play className="w-4 h-4" />
        <span className="text-sm font-medium">大屏轮播</span>
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 bg-glass-card rounded-lg p-1.5 border border-accent-primary/30"
      >
        <div className="flex items-center gap-1 px-3">
          <div className={`w-2 h-2 rounded-full ${paused ? 'bg-status-pending' : 'bg-status-normal animate-pulse'}`} />
          <span className="text-xs text-white/70 font-medium">
            {paused ? '已暂停' : '轮播中'}
          </span>
        </div>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex items-center gap-1">
          <button
            onClick={goToPrev}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="上一个"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePause}
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
              paused 
                ? 'bg-status-normal/20 text-status-normal hover:bg-status-normal/30' 
                : 'bg-status-pending/20 text-status-pending hover:bg-status-pending/30'
            }`}
            title={paused ? '继续' : '暂停'}
          >
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={goToNext}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="下一个"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex items-center gap-2 px-2">
          {viewOrder.map((view, index) => (
            <div
              key={view}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                currentView === view 
                  ? 'bg-accent-primary w-4' 
                  : 'bg-white/20'
              }`}
              title={VIEW_LABELS[view]}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-white/10" />

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          title="设置"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setCarouselEnabled(false);
            setCarouselPaused(false);
          }}
          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-status-fault/20 transition-colors text-white/70 hover:text-status-fault"
          title="关闭轮播"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-48 bg-glass-card rounded-lg border border-white/10 p-3 z-50"
          >
            <div className="text-xs text-white/50 mb-2">轮播间隔</div>
            <div className="space-y-1">
              {intervalOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCarouselInterval(opt.value)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    interval === opt.value
                      ? 'bg-accent-primary/20 text-accent-primary'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarouselControl;
