import { LayoutDashboard, MapPin, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAssetStore } from '../../store/useAssetStore';
import type { ViewType } from '../../types';
import { cn } from '../../utils/helpers';

interface TabConfig {
  id: ViewType;
  label: string;
  icon: typeof LayoutDashboard;
}

const tabs: TabConfig[] = [
  { id: 'overview', label: '总览', icon: LayoutDashboard },
  { id: 'floorMap', label: '楼层地图', icon: MapPin },
  { id: 'schedule', label: '维保日程', icon: Calendar },
  { id: 'faultRanking', label: '故障排行', icon: BarChart3 },
  { id: 'costTrend', label: '费用趋势', icon: TrendingUp },
];

const ViewTabs = () => {
  const { currentView, setCurrentView } = useAssetStore();

  return (
    <div className="bg-bg-secondary/50 backdrop-blur-sm border-b border-white/10">
      <div className="px-6">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={cn(
                  "relative px-5 py-3 flex items-center gap-2 text-sm font-medium transition-all duration-300",
                  isActive ? "text-accent-primary" : "text-white/60 hover:text-white/90"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewTabs;
