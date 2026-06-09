import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, TrendingDown, PieChart, BarChart3, Calendar } from 'lucide-react';
import { useFilteredCosts } from '../../store/useAssetStore';
import TrendLineChart from './TrendLineChart';
import CostStackChart from './CostStackChart';
import { formatCurrency } from '../../utils/helpers';

const CostTrend = () => {
  const filteredData = useFilteredCosts();

  const stats = useMemo(() => {
    const totalCost = filteredData.reduce((sum, d) => sum + d.total, 0);
    const avgMonthly = totalCost / filteredData.length;
    const latestMonth = filteredData[filteredData.length - 1]?.total || 0;
    const prevMonth = filteredData[filteredData.length - 2]?.total || 0;
    const trend = prevMonth > 0 ? ((latestMonth - prevMonth) / prevMonth) * 100 : 0;
    
    const totalParts = filteredData.reduce((sum, d) => sum + d.breakdown.parts, 0);
    const totalLabor = filteredData.reduce((sum, d) => sum + d.breakdown.labor, 0);
    const totalOutsourcing = filteredData.reduce((sum, d) => sum + d.breakdown.outsourcing, 0);
    
    const maxMonth = filteredData.reduce((max, d) => d.total > max.total ? d : max, filteredData[0]);
    
    return { totalCost, avgMonthly, trend, totalParts, totalLabor, totalOutsourcing, maxMonth };
  }, [filteredData]);

  const categoryBreakdown = useMemo(() => [
    { name: '零配件', value: stats.totalParts, color: '#00c48c', percent: ((stats.totalParts / stats.totalCost) * 100).toFixed(1) },
    { name: '人工费', value: stats.totalLabor, color: '#faad14', percent: ((stats.totalLabor / stats.totalCost) * 100).toFixed(1) },
    { name: '外包服务', value: stats.totalOutsourcing, color: '#a855f7', percent: ((stats.totalOutsourcing / stats.totalCost) * 100).toFixed(1) },
  ], [stats]);

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
              <div className="font-display text-2xl font-bold text-accent-primary">{formatCurrency(stats.totalCost)}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-secondary/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-secondary" />
            </div>
            <div>
              <div className="text-xs text-white/50">月均费用</div>
              <div className="font-display text-2xl font-bold text-accent-secondary">{formatCurrency(stats.avgMonthly)}</div>
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
              <div className="text-xs text-white/50">最高单月</div>
              <div className="font-display text-2xl font-bold text-status-pending">{formatCurrency(stats.maxMonth?.total || 0)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6" style={{ height: 'calc(100vh - 280px)' }}>
        <div className="col-span-2 space-y-6">
          <div className="glass-card p-5 h-[320px]">
            <h3 className="title-section flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-primary" />
              费用趋势分析
            </h3>
            <TrendLineChart data={filteredData} />
          </div>
          
          <div className="glass-card p-5 flex-1">
            <h3 className="title-section flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent-secondary" />
              费用分类堆叠
            </h3>
            <CostStackChart data={filteredData} />
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
                      <div className="text-xs text-white/50">{formatCurrency(item.value)}</div>
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
            <h3 className="title-section">月度费用明细</h3>
            <div className="space-y-3 mt-4 max-h-[280px] overflow-y-auto pr-2">
              {[...filteredData].reverse().map((record, index) => (
                <motion.div
                  key={record.month}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/80">
                      {record.month.replace('-', '年')}月
                    </span>
                    <span className="font-display font-bold text-accent-primary">
                      {formatCurrency(record.total)}
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
      </div>
    </motion.div>
  );
};

export default CostTrend;
