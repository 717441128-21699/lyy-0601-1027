import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Building2, DollarSign, Inbox } from 'lucide-react';
import { useAssetStore, useFilteredFaults } from '../../store/useAssetStore';
import RankingList from './RankingList';
import SupplierRadar from './SupplierRadar';
import RepairTimeChart from './RepairTimeChart';
import { formatCurrency } from '../../utils/helpers';

const FaultRanking = () => {
  const { supplierData } = useAssetStore();
  const faults = useFilteredFaults();

  const stats = useMemo(() => {
    const totalFaults = faults.reduce((sum, f) => sum + f.faultCount, 0);
    const totalFaultTime = faults.reduce((sum, f) => sum + f.avgRepairTime, 0);
    const avgRepairTime = faults.length > 0 ? totalFaultTime / faults.length : 0;
    const totalCost = faults.reduce((sum, f) => sum + f.cost, 0);
    const uniqueSuppliers = new Set(faults.map(f => f.supplier)).size;
    
    return { totalFaults, avgRepairTime, totalCost, uniqueSuppliers };
  }, [faults]);

  const hasData = faults.length > 0;

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
            <div className="w-10 h-10 rounded-lg bg-status-fault/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-status-fault" />
            </div>
            <div>
              <div className="text-xs text-white/50">累计故障</div>
              <div className="font-display text-2xl font-bold text-status-fault">{stats.totalFaults || 0}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <div className="text-xs text-white/50">平均修复时长</div>
              <div className="font-display text-2xl font-bold text-accent-primary">{(stats.avgRepairTime || 0).toFixed(1)}h</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-secondary/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent-secondary" />
            </div>
            <div>
              <div className="text-xs text-white/50">故障成本</div>
              <div className="font-display text-2xl font-bold text-accent-secondary">{formatCurrency(stats.totalCost || 0)}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-normal/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-status-normal" />
            </div>
            <div>
              <div className="text-xs text-white/50">服务供应商</div>
              <div className="font-display text-2xl font-bold text-status-normal">{stats.uniqueSuppliers || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {hasData ? (
        <div className="grid grid-cols-3 gap-6" style={{ height: 'calc(100vh - 280px)' }}>
          <div className="col-span-1 glass-card p-5 overflow-y-auto overflow-x-hidden pr-2">
            <h3 className="title-section">高频故障TOP 10</h3>
            <RankingList faults={faults.slice(0, 10)} />
          </div>

          <div className="col-span-2 space-y-6">
            <div className="glass-card p-5 h-[320px]">
              <h3 className="title-section">平均修复时长对比</h3>
              <RepairTimeChart faults={faults.slice(0, 10)} />
            </div>
            
            <div className="grid grid-cols-2 gap-6 flex-1">
              <div className="glass-card p-5">
                <h3 className="title-section">供应商响应能力评估</h3>
                <SupplierRadar suppliers={supplierData} />
              </div>
              
              <div className="glass-card p-5">
                <h3 className="title-section">供应商成本分析</h3>
                <div className="space-y-4 mt-4">
                  {supplierData.map((supplier, index) => {
                    const colors = ['#00d4ff', '#00c48c', '#faad14', '#a855f7'];
                    const avgCost = faults
                      .filter(f => f.supplier === supplier.name)
                      .reduce((sum, f) => sum + f.cost, 0);
                    
                    return (
                      <motion.div
                        key={supplier.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-white/5 border border-white/5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white/80">{supplier.name}</span>
                          <span className="font-display font-bold" style={{ color: colors[index] }}>
                            {formatCurrency(avgCost)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-white/40">响应速度</div>
                            <div className="font-medium text-white/80">{supplier.responseTime}分</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/40">修复率</div>
                            <div className="font-medium text-white/80">{supplier.repairRate}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/40">满意度</div>
                            <div className="font-medium text-white/80">{supplier.satisfaction}%</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 280px)' }}>
          <Inbox className="w-16 h-16 text-white/20 mb-4" />
          <div className="text-xl font-medium text-white/40 mb-2">暂无故障数据</div>
          <div className="text-sm text-white/30">当前筛选条件下没有故障记录，请调整筛选条件</div>
        </div>
      )}
    </motion.div>
  );
};

export default FaultRanking;
