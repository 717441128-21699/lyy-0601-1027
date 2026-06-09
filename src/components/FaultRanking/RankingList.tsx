import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Building2, TrendingUp } from 'lucide-react';
import type { FaultRecord } from '../../types';
import { DEVICE_TYPE_LABELS } from '../../types';
import { formatCurrency, formatShortDate } from '../../utils/helpers';

interface RankingListProps {
  faults: FaultRecord[];
}

const RankingList = ({ faults }: RankingListProps) => {
  const maxFaultCount = Math.max(...faults.map(f => f.faultCount), 1);

  return (
    <div className="space-y-3">
      {faults.map((fault, index) => {
        const percentage = (fault.faultCount / maxFaultCount) * 100;
        const rankColors = ['#ff4d4f', '#ff7a45', '#faad14', '#00d4ff', '#00c48c'];
        const rankColor = rankColors[Math.min(index, rankColors.length - 1)];
        
        return (
          <motion.div
            key={fault.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="glass-card-hover p-4 relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: rankColor }} />
            
            <div className="flex items-start gap-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: `${rankColor}20`, color: rankColor }}
              >
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white truncate">{fault.deviceName}</h4>
                    <span className="text-xs text-white/40">
                      {DEVICE_TYPE_LABELS[fault.deviceType]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-status-fault" />
                    <span className="font-display font-bold text-status-fault">
                      {fault.faultCount}
                    </span>
                    <span className="text-xs text-white/40">次</span>
                  </div>
                </div>
                
                <div className="progress-bar mb-3">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: rankColor
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-accent-primary" />
                    <span className="text-white/50">平均修复:</span>
                    <span className="text-white/80 font-medium">{fault.avgRepairTime}h</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Building2 className="w-3.5 h-3.5 text-accent-primary" />
                    <span className="text-white/50 truncate">{fault.supplier}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <TrendingUp className="w-3.5 h-3.5 text-accent-primary" />
                    <span className="text-white/50">累计:</span>
                    <span className="text-white/80 font-medium">{formatCurrency(fault.cost)}</span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-white/40 flex items-center gap-1.5">
                  <span>最近故障: {formatShortDate(fault.lastFault)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RankingList;
