import { useEffect, useState } from 'react';
import { Activity, Database, RefreshCw, Monitor } from 'lucide-react';
import { useAssetStore } from '../../store/useAssetStore';
import { useFullscreen } from '../../hooks/useFullscreen';
import { cn } from '../../utils/helpers';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toggleFullscreen, isDemoDataLoaded, loadDemoData, resetData } = useAssetStore();
  const { isFullscreen, toggleFullscreen: toggleFs } = useFullscreen();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'long'
    });
  };

  const handleFullscreen = () => {
    toggleFs();
    toggleFullscreen();
  };

  return (
    <header className="bg-bg-secondary/80 backdrop-blur-md border-b border-white/10 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-glow">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">企业资产维保看板</h1>
              <p className="text-xs text-white/50">Enterprise Asset Maintenance Dashboard</p>
            </div>
          </div>
          
          <div className={cn(
            "ml-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
            isDemoDataLoaded 
              ? "bg-status-normal/20 text-status-normal border border-status-normal/30" 
              : "bg-status-pending/20 text-status-pending border border-status-pending/30"
          )}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {isDemoDataLoaded ? "数据已加载" : "数据未加载"}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-white/70 font-medium">
              {formatDateTime(currentTime)}
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <button
              onClick={loadDemoData}
              className="btn-primary flex items-center gap-2 text-sm"
              title="导入演示数据"
            >
              <Database className="w-4 h-4" />
              <span>导入演示数据</span>
            </button>
            
            <button
              onClick={resetData}
              className="btn-secondary flex items-center gap-2 text-sm"
              title="一键重置"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重置</span>
            </button>
            
            <button
              onClick={handleFullscreen}
              className="btn-secondary flex items-center gap-2 text-sm"
              title={isFullscreen ? "退出全屏" : "全屏模式"}
            >
              <Monitor className="w-4 h-4" />
              <span>{isFullscreen ? "退出全屏" : "全屏"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
