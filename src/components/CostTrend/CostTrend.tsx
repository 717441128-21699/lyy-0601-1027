import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, TrendingDown, PieChart, BarChart3, Calendar, CalendarDays, Building2, Layers, Inbox, ChevronRight } from 'lucide-react';
import { useAggregatedCosts } from '../../store/useAssetStore';
import TrendLineChart from './TrendLineChart';
import CostStackChart from './CostStackChart';
import CostDrillDownModal from './CostDrillDownModal';
import { formatCurrency } from '../../utils/helpers';
import { DEVICE_TYPE_LABELS } from '../../types';

type ViewMode = 'month' | 'department' | 'type';

interface DrillDownState {
  isOpen: boolean;
  filterType: 'month' | 'department' | 'type';
  filterValue: string;
}

const CostTrend = () => {
  const aggregated = useAggregatedCosts();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [drillDown, setDrillDown] = useState<DrillDownState>({
    isOpen: false,
    filterType: 'month',
    filterValue: ''
  });

  const handleDrillDown = (filterType: 'month' | 'department' | 'type', filterValue: string) => {
    setDrillDown({
      isOpen: true,
      filterType,
      filterValue
    });
  };

  const closeDrillDown = () => {
    setDrillDown(prev => ({ ...prev, isOpen: false }));
  };

  const stats = useMemo(() => {
    let data: { total: number; breakdown: { parts: number; labor: number; outsourcing: number } }[] = [];
    
    if (viewMode === 'month') {
      data = aggregated.byMonth;
    } else if (viewMode === 'department') {
      data = aggregated.byDepartment;
    } else {
      data = aggregated.byType;
    }

    const totalCost = data.reduce((sum, d) => sum + d.total, 0);
    const avgAmount = data.length > 0 ? totalCost / data.length : 0;
    const latestAmount = data.length > 0 ? data[data.length - 1].total : 0;
    const prevAmount = data.length > 1 ? data[data.length - 2].total : 0;
    const trend = prevAmount > 0 ? ((latestAmount - prevAmount) / prevAmount) * 100 : 0;
    
    const totalParts = data.reduce((sum, d) => sum + d.breakdown.parts, 0);
    const totalLabor = data.reduce((sum, d) => sum + d.breakdown.labor, 0);
    const totalOutsourcing = data.reduce((sum, d) => sum + d.breakdown.outsourcing, 0);
    
    const maxItem = data.length > 0 
      ? data.reduce((max, d) => d.total > max.total ? d : max, data[0]) 
      : null;
    
    return { totalCost, avgAmount, trend, totalParts, totalLabor, totalOutsourcing, maxItem, dataLength: data.length };
  }, [aggregated, viewMode]);

  const categoryBreakdown = useMemo(() => {
    const total = stats.totalCost || 1;
    return [
      { name: '零配件', value: stats.totalParts, color: '#00c48c', percent: ((stats.totalParts / total) * 100).toFixed(1) },
      { name: '人工费', value: stats.totalLabor, color: '#faad14', percent: ((stats.totalLabor / total) * 100).toFixed(1) },
      { name: '外包服务', value: stats.totalOutsourcing, color: '#a855f7', percent: ((stats.totalOutsourcing / total) * 100).toFixed(1) },
    ];
  }, [stats]);

  const detailList = useMemo(() => {
    if (viewMode === 'month') {
      return aggregated.byMonth.map(item => ({
        label: item.month.replace('-', '年') + '月',
        rawValue: item.month,
        filterType: 'month' as const,
        ...item
      }));
    } else if (viewMode === 'department') {
      return aggregated.byDepartment.map(item => ({
        label: item.department,
        rawValue: item.department,
        filterType: 'department' as const,
        ...item
      }));
    } else {
      return aggregated.byType.map(item => ({
        label: DEVICE_TYPE_LABELS[item.deviceType as keyof typeof DEVICE_TYPE_LABELS] || item.deviceType,
        rawValue: item.deviceType,
        filterType: 'type' as const,
        ...item
      }));
    }
  }, [aggregated, viewMode]);

  const hasData = stats.dataLength > 0 && stats.totalCost > 0;

  const modeOptions = [
    { value: 'month' as ViewMode, label: '按月份', icon: CalendarDays },
    { value: 'department' as ViewMode, label: '按部门', icon: Building2 },
    { value: 'type' as ViewMode, label: '按类别', icon: Layers },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 h-full"
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <div className="text-xs text-white/50">累计维保费用</div>
              <div className="font-display text-2xl font-bold text-accent-primary">{formatCurrency(stats.totalCost || 0)}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-secondary/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-secondary" />
            </div>
            <div>
              <div className="text-xs text-white/50">平均{viewMode === 'month' ? '月' : viewMode === 'department' ? '部门' : '类别'}费用</div>
              <div className="font-display text-2xl font-bold text-accent-secondary">{formatCurrency(stats.avgAmount || 0)}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stats.trend >= 0 ? 'bg-status-fault/20' : 'bg-status-normal/20'}`}>
              {stats.trend >= 0 ? (
                <TrendingUp className="w-5 h-5 text-status-fault" />
              ) : (
                <TrendingDown className="w-5 h-5 text-status-normal" />
              )}
            </div>
            <div>
              <div className="text-xs text-white/50">环比趋势</div>
              <div className={`font-display text-2xl font-bold ${stats.trend >= 0 ? 'text-status-fault' : 'text-status-normal'}`}>
                {stats.trend >= 0 ? '+' : ''}{stats.trend.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-pending/20 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-status-pending" />
            </div>
            <div>
              <div className="text-xs text-white/50">最高费用</div>
              <div className="font-display text-2xl font-bold text-status-pending">{formatCurrency(stats.maxItem?.total || 0)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {modeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = viewMode === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setViewMode(option.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6" style={{ height: 'calc(100vh - 340px)' }}>
        {hasData ? (
          <>
            <div className="col-span-2 space-y-6">
              <div className="glass-card p-5 h-[320px]">
                <h3 className="title-section flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent-primary" />
                  费用趋势分析
                </h3>
                <TrendLineChart data={aggregated} mode={viewMode} />
              </div>
              
              <div className="glass-card p-5 flex-1">
                <h3 className="title-section flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-accent-secondary" />
                  费用分类堆叠
                </h3>
                <CostStackChart data={aggregated} mode={viewMode} />
              </div>
            </div>

            <div className="col-span-1 space-y-6">
              <div className="glass-card p-5">
                <h3 className="title-section">费用构成占比</h3>
                <div className="space-y-4 mt-4">
                  {categoryBreakdown.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-white/80">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-white" style={{ color: item.color }}>
                            {item.percent}%
                          </div>
                          <div className="text-xs text-white/50">{formatCurrency(item.value || 0)}</div>
                        </div>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="glass-card p-5 flex-1">
                <h3 className="title-section flex items-center justify-between">
                  <span>{viewMode === 'month' ? '月度' : viewMode === 'department' ? '部门' : '类别'}费用明细</span>
                  <span className="text-[10px] text-white/40 font-normal">点击查看明细</span>
                </h3>
                <div className="space-y-3 mt-4 max-h-[280px] overflow-y-auto pr-2">
                  {[...detailList].reverse().map((record, index) => (
                    <motion.div
                      key={record.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-accent-secondary/30 cursor-pointer transition-all group"
                      onClick={() => handleDrillDown(record.filterType, record.rawValue)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                          {record.label}
                        </span>
                        <span className="font-display font-bold text-accent-primary flex-shrink-0 flex items-center gap-1">
                          {formatCurrency(record.total)}
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-white/40">零配件</div>
                          <div className="font-medium text-status-normal">{formatCurrency(record.breakdown.parts)}</div>
                        </div>
                        <div>
                          <div className="text-white/40">人工费</div>
                          <div className="font-medium text-status-pending">{formatCurrency(record.breakdown.labor)}</div>
                        </div>
                        <div>
                          <div className="text-white/40">外包</div>
                          <div className="font-medium text-purple-400">{formatCurrency(record.breakdown.outsourcing)}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-3 glass-card p-12 flex flex-col items-center justify-center">
            <Inbox className="w-20 h-20 text-white/10 mb-6" />
            <div className="text-2xl font-medium text-white/30 mb-2">暂无费用数据</div>
            <div className="text-sm text-white/20">当前筛选条件下没有费用记录，请调整筛选条件</div>
          </div>
        )}
      </div>

      <CostDrillDownModal
        isOpen={drillDown.isOpen}
        onClose={closeDrillDown}
        filterType={drillDown.filterType}
        filterValue={drillDown.filterValue}
      />
    </motion.div>
  );
};

export default CostTrend;
