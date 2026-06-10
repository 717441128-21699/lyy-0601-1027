import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, TrendingUp, Wrench, AlertTriangle, Building2, Layers, Calendar, ChevronRight } from 'lucide-react';
import { useAssetStore, useAggregatedCostsByDevice, useFilteredTasks, useFilteredFaults } from '../../store/useAssetStore';
import { DEVICE_TYPE_LABELS, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import type { DeviceType } from '../../types';

interface CostDrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterType?: 'month' | 'department' | 'type';
  filterValue?: string;
}

type TabType = 'devices' | 'tasks' | 'faults';

const CostDrillDownModal = ({ isOpen, onClose, filterType, filterValue }: CostDrillDownModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('devices');
  const { filters } = useAssetStore();
  const deviceCosts = useAggregatedCostsByDevice();
  const tasks = useFilteredTasks();
  const faults = useFilteredFaults();

  const filteredDeviceCosts = useMemo(() => {
    let result = deviceCosts;
    
    if (filterType === 'month' && filterValue) {
      result = result.filter(d => d.months.includes(filterValue));
    } else if (filterType === 'department' && filterValue) {
      result = result.filter(d => d.department === filterValue);
    } else if (filterType === 'type' && filterValue) {
      result = result.filter(d => d.deviceType === filterValue as DeviceType);
    }
    
    return result;
  }, [deviceCosts, filterType, filterValue]);

  const totalCost = useMemo(() => {
    return filteredDeviceCosts.reduce((sum, d) => sum + d.total, 0);
  }, [filteredDeviceCosts]);

  const tabs = [
    { id: 'devices' as TabType, label: '费用最高设备', icon: Building2, count: filteredDeviceCosts.length },
    { id: 'tasks' as TabType, label: '关联维保任务', icon: Wrench, count: tasks.length },
    { id: 'faults' as TabType, label: '关联故障记录', icon: AlertTriangle, count: faults.length },
  ];

  const getFilterTitle = () => {
    if (!filterType || !filterValue) return '费用明细分析';
    if (filterType === 'month') return `${filterValue.replace('-', '年')}月 费用明细`;
    if (filterType === 'department') return `${filterValue} 费用明细`;
    if (filterType === 'type') return `${DEVICE_TYPE_LABELS[filterValue as DeviceType] || filterValue} 费用明细`;
    return '费用明细分析';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-glass-card border border-white/10 rounded-2xl w-full max-w-6xl max-h-[85vh] overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}>
                  <DollarSign className="w-5 h-5 text-accent-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {getFilterTitle()}
                    <span className="text-sm font-normal text-accent-secondary">
                      {formatCurrency(totalCost)}
                    </span>
                  </h2>
                  <p className="text-xs text-white/50">
                    部门: {filters.department} · 
                    资产类别: {filters.assetTypes.length > 0 ? filters.assetTypes.map(t => DEVICE_TYPE_LABELS[t]).join(', ') : '全部'} · 
                    时间范围: {filters.timeRange === '7d' ? '近7天' : filters.timeRange === '30d' ? '近30天' : filters.timeRange === '90d' ? '近90天' : '全年'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-white/10 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                      isActive ? 'text-accent-secondary' : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive 
                        ? 'bg-accent-secondary/20 text-accent-secondary' 
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {tab.count}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="costDrillDownTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-secondary"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 160px)' }}>
              <AnimatePresence mode="wait">
                {activeTab === 'devices' && (
                  <motion.div
                    key="devices"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6"
                  >
                    {filteredDeviceCosts.length > 0 ? (
                      <div className="space-y-3">
                        {filteredDeviceCosts.map((device, index) => {
                          const maxCost = filteredDeviceCosts[0]?.total || 1;
                          const percentage = (device.total / maxCost) * 100;
                          const colors = ['#ef4444', '#f97316', '#faad14', '#00d4ff', '#00c48c', '#a855f7', '#06b6d4', '#ec4899'];
                          const color = colors[index % colors.length];
                          
                          return (
                            <motion.div
                              key={device.deviceId}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-white"
                                    style={{ backgroundColor: `${color}20`, color }}
                                  >
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-medium text-white">{device.deviceName}</div>
                                    <div className="flex items-center gap-2 text-xs text-white/50">
                                      <span>{DEVICE_TYPE_LABELS[device.deviceType]}</span>
                                      <span>·</span>
                                      <span>{device.department}</span>
                                      <span>·</span>
                                      <span>{device.floor}层</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-display text-xl font-bold text-accent-secondary">
                                    {formatCurrency(device.total)}
                                  </div>
                                  <div className="text-xs text-white/40">
                                    {device.months.length} 个月
                                  </div>
                                </div>
                              </div>
                              
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.5, delay: index * 0.03 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                              </div>
                              
                              <div className="grid grid-cols-3 gap-3 text-xs">
                                <div className="p-2 rounded bg-white/5">
                                  <div className="text-white/40 mb-1">零配件</div>
                                  <div className="font-medium text-status-normal">{formatCurrency(device.breakdown.parts)}</div>
                                </div>
                                <div className="p-2 rounded bg-white/5">
                                  <div className="text-white/40 mb-1">人工费</div>
                                  <div className="font-medium text-status-pending">{formatCurrency(device.breakdown.labor)}</div>
                                </div>
                                <div className="p-2 rounded bg-white/5">
                                  <div className="text-white/40 mb-1">外包服务</div>
                                  <div className="font-medium text-purple-400">{formatCurrency(device.breakdown.outsourcing)}</div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <DollarSign className="w-16 h-16 text-white/10 mb-4" />
                        <div className="text-xl font-medium text-white/30 mb-2">暂无费用数据</div>
                        <div className="text-sm text-white/20">当前筛选条件下没有设备费用记录</div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'tasks' && (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6"
                  >
                    {tasks.length > 0 ? (
                      <div className="space-y-3">
                        {tasks.map((task, index) => {
                          const statusColor = TASK_STATUS_COLORS[task.status];
                          return (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className="p-4 rounded-lg bg-white/5 border border-white/10"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Wrench className="w-4 h-4 text-accent-primary" />
                                  <span className="font-medium text-white">{task.deviceName}</span>
                                </div>
                                <span 
                                  className="px-2 py-0.5 rounded text-xs font-medium"
                                  style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                                >
                                  {TASK_STATUS_LABELS[task.status]}
                                </span>
                              </div>
                              <div className="text-sm text-white/60 mb-2">{task.type}</div>
                              <div className="flex items-center justify-between text-xs text-white/40">
                                <span>负责人: {task.assignee}</span>
                                <span>计划日期: {task.date}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Wrench className="w-16 h-16 text-white/10 mb-4" />
                        <div className="text-xl font-medium text-white/30 mb-2">暂无维保任务</div>
                        <div className="text-sm text-white/20">当前筛选条件下没有关联的维保任务</div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'faults' && (
                  <motion.div
                    key="faults"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6"
                  >
                    {faults.length > 0 ? (
                      <div className="space-y-3">
                        {faults.map((fault, index) => (
                          <motion.div
                            key={fault.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="p-4 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-status-fault" />
                                <span className="font-medium text-white">{fault.deviceName}</span>
                              </div>
                              <span className="font-display font-bold text-status-fault">
                                {fault.faultCount} 次故障
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-xs mb-2">
                              <div>
                                <div className="text-white/40">供应商</div>
                                <div className="text-white/70">{fault.supplier}</div>
                              </div>
                              <div>
                                <div className="text-white/40">平均修复</div>
                                <div className="text-accent-primary">{fault.avgRepairTime}h</div>
                              </div>
                              <div>
                                <div className="text-white/40">累计成本</div>
                                <div className="text-accent-secondary">{formatCurrency(fault.cost)}</div>
                              </div>
                            </div>
                            <div className="text-xs text-white/40">
                              最近故障: {fault.lastFault}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <AlertTriangle className="w-16 h-16 text-white/10 mb-4" />
                        <div className="text-xl font-medium text-white/30 mb-2">暂无故障记录</div>
                        <div className="text-sm text-white/20">当前筛选条件下没有关联的故障记录</div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-bg-secondary/50">
              <div className="text-sm text-white/50 flex items-center gap-4">
                <span>
                  设备数: <span className="font-display font-bold text-accent-primary">{filteredDeviceCosts.length}</span> 台
                </span>
                <span>
                  总费用: <span className="font-display font-bold text-accent-secondary">{formatCurrency(totalCost)}</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="btn-secondary px-4 py-2 text-sm"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CostDrillDownModal;
