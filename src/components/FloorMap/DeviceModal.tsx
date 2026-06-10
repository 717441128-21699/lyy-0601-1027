import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Building, Tag, Clock, AlertTriangle, CheckCircle, Wrench, History, FileText, TrendingUp, DollarSign, Zap } from 'lucide-react';
import type { Device } from '../../types';
import { STATUS_LABELS, STATUS_COLORS, DEVICE_TYPE_LABELS, FAULT_STATUS_LABELS, FAULT_STATUS_COLORS, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../types';
import { formatDate, getDaysUntil, isOverdue, cn, formatCurrency } from '../../utils/helpers';
import { useDeviceFaultHistory, useDeviceTasks } from '../../store/useAssetStore';

interface DeviceModalProps {
  device: Device | null;
  onClose: () => void;
}

type TabType = 'info' | 'faults' | 'tasks';

const DeviceModal = ({ device, onClose }: DeviceModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const faultRecord = useDeviceFaultHistory(device?.id || null);
  const deviceTasks = useDeviceTasks(device?.id || null);

  if (!device) return null;

  const statusColor = STATUS_COLORS[device.status];
  const daysUntil = getDaysUntil(device.nextMaintenance);
  const isMaintenanceOverdue = isOverdue(device.nextMaintenance);

  const tabs = [
    { id: 'info' as TabType, label: '基本信息', icon: FileText },
    { id: 'faults' as TabType, label: '故障历史', icon: History, badge: faultRecord?.faultCount || 0 },
    { id: 'tasks' as TabType, label: '维保任务', icon: Wrench, badge: deviceTasks.length },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass-card w-full max-w-3xl max-h-[85vh] overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>

          <div className="p-6 border-b border-white/10">
            <div className="flex items-start gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${statusColor}20`, border: `2px solid ${statusColor}` }}
              >
                <CheckCircle className="w-7 h-7" style={{ color: statusColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-1 truncate">{device.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                  >
                    {STATUS_LABELS[device.status]}
                  </span>
                  <span className="text-sm text-white/50">{DEVICE_TYPE_LABELS[device.type]}</span>
                  <span className="text-sm text-white/50">{device.floor}层</span>
                  <span className="text-sm text-white/50">{device.department}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex border-b border-white/10 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                    isActive ? "text-accent-primary" : "text-white/50 hover:text-white/80"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                      isActive 
                        ? "bg-accent-primary/20 text-accent-primary" 
                        : "bg-white/10 text-white/60"
                    )}>
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="deviceModalTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 220px)' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                        <Tag className="w-3.5 h-3.5" />
                        设备编号
                      </div>
                      <div className="font-display text-white font-medium">{device.id}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                        <Building className="w-3.5 h-3.5" />
                        所属部门
                      </div>
                      <div className="text-white font-medium">{device.department}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                        <User className="w-3.5 h-3.5" />
                        品牌型号
                      </div>
                      <div className="text-white font-medium">{device.brand} {device.model}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        安装日期
                      </div>
                      <div className="text-white font-medium">{formatDate(device.installDate)}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <Clock className="w-4 h-4" />
                          上次维保
                        </div>
                        <span className="text-white font-medium">{formatDate(device.lastMaintenance)}</span>
                      </div>
                    </div>

                    <div className={cn(
                      "p-4 rounded-lg border",
                      isMaintenanceOverdue 
                        ? "bg-status-fault/10 border-status-fault/30" 
                        : "bg-white/5 border-white/10"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm">
                          {isMaintenanceOverdue ? (
                            <AlertTriangle className="w-4 h-4 text-status-fault" />
                          ) : (
                            <Clock className="w-4 h-4 text-white/70" />
                          )}
                          <span className={isMaintenanceOverdue ? "text-status-fault" : "text-white/70"}>
                            下次维保
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "font-medium",
                            isMaintenanceOverdue ? "text-status-fault" : "text-white"
                          )}>
                            {formatDate(device.nextMaintenance)}
                          </span>
                          <div className={cn(
                            "text-xs",
                            isMaintenanceOverdue ? "text-status-fault" : "text-white/40"
                          )}>
                            {isMaintenanceOverdue 
                              ? `已超期 ${Math.abs(daysUntil)} 天` 
                              : `还有 ${daysUntil} 天`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${Math.min(100, Math.max(0, (1 - daysUntil / 90) * 100))}%`,
                            backgroundColor: isMaintenanceOverdue ? '#ff4d4f' : '#00d4ff'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {faultRecord && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-status-fault/5 border border-status-fault/20">
                        <div className="flex items-center gap-1 text-xs text-white/50 mb-1">
                          <AlertTriangle className="w-3 h-3 text-status-fault" />
                          累计故障
                        </div>
                        <div className="font-display text-xl font-bold text-status-fault">{faultRecord.faultCount}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-accent-primary/5 border border-accent-primary/20">
                        <div className="flex items-center gap-1 text-xs text-white/50 mb-1">
                          <Zap className="w-3 h-3 text-accent-primary" />
                          平均修复
                        </div>
                        <div className="font-display text-xl font-bold text-accent-primary">{faultRecord.avgRepairTime}h</div>
                      </div>
                      <div className="p-3 rounded-lg bg-accent-secondary/5 border border-accent-secondary/20">
                        <div className="flex items-center gap-1 text-xs text-white/50 mb-1">
                          <DollarSign className="w-3 h-3 text-accent-secondary" />
                          累计成本
                        </div>
                        <div className="font-display text-xl font-bold text-accent-secondary">{formatCurrency(faultRecord.cost)}</div>
                      </div>
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
                  {faultRecord && faultRecord.history.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-accent-primary" />
                          <span className="text-sm font-medium text-white/80">故障处置追踪</span>
                        </div>
                        <div className="text-xs text-white/50">
                          共 {faultRecord.history.length} 条记录 · 供应商: {faultRecord.supplier}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {faultRecord.history.map((item, index) => {
                          const statusColor = FAULT_STATUS_COLORS[item.status];
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 rounded-lg bg-white/5 border border-white/10 relative overflow-hidden"
                            >
                              {index === 0 && item.status !== 'closed' && (
                                <div className="absolute top-0 right-0 w-2 h-2 bg-status-fault rounded-full m-3 animate-pulse" />
                              )}
                              
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span 
                                      className="px-2 py-0.5 rounded text-xs font-medium"
                                      style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                                    >
                                      {FAULT_STATUS_LABELS[item.status]}
                                    </span>
                                    <span className="text-xs text-white/40">{formatDate(item.date)}</span>
                                  </div>
                                  <div className="text-sm text-white/80">{item.description}</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-3 text-xs">
                                <div>
                                  <div className="text-white/40 mb-0.5">负责人</div>
                                  <div className="text-white/70 font-medium">{item.assignee}</div>
                                </div>
                                <div>
                                  <div className="text-white/40 mb-0.5">供应商响应</div>
                                  <div className="text-white/70 font-medium">{item.responseTime}h</div>
                                </div>
                                <div>
                                  <div className="text-white/40 mb-0.5">修复时长</div>
                                  <div className="text-white/70 font-medium">{item.repairTime}h</div>
                                </div>
                                <div>
                                  <div className="text-white/40 mb-0.5">费用</div>
                                  <div className="text-accent-secondary font-medium">{formatCurrency(item.cost)}</div>
                                </div>
                              </div>
                              
                              {item.resolution && (
                                <div className="mt-3 pt-3 border-t border-white/5">
                                  <div className="text-xs text-white/40 mb-0.5">处置方案</div>
                                  <div className="text-xs text-white/60">{item.resolution}</div>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle className="w-12 h-12 text-white/10 mb-3" />
                      <div className="text-lg font-medium text-white/30 mb-1">暂无故障记录</div>
                      <div className="text-sm text-white/20">该设备运行良好，暂无故障历史</div>
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
                  {deviceTasks.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-accent-primary" />
                          <span className="text-sm font-medium text-white/80">维保任务记录</span>
                        </div>
                        <div className="text-xs text-white/50">
                          共 {deviceTasks.length} 条任务
                        </div>
                      </div>
                      
                      {deviceTasks.map((task, index) => {
                        const statusColor = TASK_STATUS_COLORS[task.status];
                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span 
                                    className="px-2 py-0.5 rounded text-xs font-medium"
                                    style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                                  >
                                    {TASK_STATUS_LABELS[task.status]}
                                  </span>
                                  <span className="text-xs text-white/40">{formatDate(task.date)}</span>
                                </div>
                                <div className="text-sm text-white/80">{task.type}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-white/40 mb-0.5">负责人</div>
                                <div className="text-sm text-white/70 font-medium">{task.assignee}</div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-white/40">完成进度</span>
                                <span className="text-white/60">{task.progress}%</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all"
                                  style={{ 
                                    width: `${task.progress}%`,
                                    backgroundColor: statusColor
                                  }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Clock className="w-12 h-12 text-white/10 mb-3" />
                      <div className="text-lg font-medium text-white/30 mb-1">暂无维保任务</div>
                      <div className="text-sm text-white/20">该设备暂无维保任务安排</div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-white/10 bg-bg-secondary/30">
            <div className="flex gap-3">
              <button 
                className="flex-1 btn-primary text-sm"
                onClick={onClose}
              >
                关闭
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeviceModal;
