import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, type LucideIcon } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import { getTrendColor, cn } from '../../utils/helpers';

interface StatCardProps {
  title: string;
  value: number;
  trend: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

const StatCard = ({ title, value, trend, icon: Icon, color, delay = 0 }: StatCardProps) => {
  const { count } = useCountUp(value, 2000);
  const trendColor = getTrendColor(trend);
  const isPositive = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="stat-card border-gradient"
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div 
          className="w-full h-full rounded-full blur-3xl" 
          style={{ backgroundColor: color }} 
        />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm text-white/60 font-medium">{title}</span>
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        </div>
        
        <div className="font-display text-3xl font-bold mb-2 text-glow" style={{ color }}>
          {count.toLocaleString()}
        </div>
        
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <ArrowUp className="w-4 h-4" style={{ color: trendColor }} />
          ) : (
            <ArrowDown className="w-4 h-4" style={{ color: trendColor }} />
          )}
          <span className="text-sm font-medium" style={{ color: trendColor }}>
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-white/40">较上月</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
