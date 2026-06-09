import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Clock, DollarSign, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { useAssetStore, useFilteredTasks, useFilteredFaults } from '../../store/useAssetStore';
import { formatCurrency, getDaysUntil, isOverdue } from '../../utils/helpers';

const QuickStats = () => {
  const { costRecords, maintenanceTasks, supplierData } = useAssetStore();
  const tasks = useFilteredTasks();
  const faults = useFilteredFaults();

  const stats = useMemo(() => {
    const todayTasks = tasks.filter(t => t.date === '2026-06-10');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    
    const totalCost = costRecords.reduce((sum, r) => sum + r.total, 0);
    const avgMonthlyCost = totalCost / costRecords.length;
    
    const avgRepairTime = faults.reduce((sum, f) => sum + f.avgRepairTime, 0) / faults.length;
    const totalFaults = faults.reduce((sum, f) => sum + f.faultCount, 0);
    
    const avgSupplierResponse = supplierData.reduce((sum, s) => sum + s.responseTime, 0) / supplierData.length;
    
    const upcomingMaintenance = maintenanceTasks
      .filter(t => !isOverdue(t.date) && getDaysUntil(t.date) <= 7)
      .length;

    return [
      { icon: Wrench, label: '今日维保任务', value: todayTasks.length, color: '#00d4ff', suffix: '项' },
      { icon: TrendingUp, label: '完成率', value: Math.round((completedTasks.length / tasks.length) * 100), color: '#00c48c', suffix: '%' },
      { icon: Clock, label: '进行中', value: inProgressTasks.length, color: '#faad14', suffix: '项' },
      { icon: AlertCircle, label: '待处理', value: pendingTasks.length, color: '#ff4d4f', suffix: '项' },
      { icon: DollarSign, label: '月均费用', value: Math.round(avgMonthlyCost / 1000), color: '#a855f7', suffix: 'k' },
      { icon: Users, label: '供应商响应', value: Math.round(avgSupplierResponse), color: '#06b6d4', suffix: '分' },
      { icon: Clock, label: '平均修复时长', value: avgRepairTime.toFixed(1), color: '#f97316', suffix: 'h' },
      { icon: AlertCircle, label: '累计故障', value: totalFaults, color: '#ef4444', suffix: '次' },
    ];
  }, [tasks, costRecords, faults, supplierData, maintenanceTasks]);

  return (
    <div className="glass-card p-5 h-full">
      <h3 className="title-section">快速统计</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div 
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-white/50 truncate">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span 
                  className="font-display text-lg font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-white/40">{stat.suffix}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-accent-primary/10 to-transparent border border-accent-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-accent-primary" />
          <span className="text-sm font-medium text-white/80">即将到期维保</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-accent-primary">
            {stats[5].value}
          </span>
          <span className="text-sm text-white/50">项任务将在7天内到期</span>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
