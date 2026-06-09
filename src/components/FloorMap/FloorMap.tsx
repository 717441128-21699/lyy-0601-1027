import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, User, CheckCircle, XCircle, ChevronRight, AlertCircle, Wrench, Building2, DollarSign } from 'lucide-react';
import { useAssetStore, useFilteredDevices, useFilteredTasks, useFilteredFaults } from '../../store/useAssetStore';
import { STATUS_COLORS, STATUS_LABELS, TASK_STATUS_COLORS, TASK_STATUS_LABELS, DEVICE_TYPE_LABELS } from '../../types';
import { isOverdue, getDaysUntil, formatDate, formatCurrency } from '../../utils/helpers';
import FloorSelector from './FloorSelector';
import DevicePoint from './DevicePoint';
import DeviceModal from './DeviceModal';
import FloorLegend from './FloorLegend';
import type { Device, MaintenanceTask, FaultRecord } from '../../types';

const FloorMap = () => {
  const { selectedFloor, selectedDevice, setSelectedDevice } = useAssetStore();
  const devices = useFilteredDevices();
  const tasks = useFilteredTasks();
  const faults = useFilteredFaults();

  const floorDevices = useMemo(() => {
    return devices.filter(d => d.floor === selectedFloor);
  }, [devices, selectedFloor]);

  const floorTasks = useMemo(() => {
    return tasks.filter(task => task.deviceFloor === selectedFloor);
  }, [tasks, selectedFloor]);

  const floorFaults = useMemo(() => {
    return faults.filter(fault => fault.deviceFloor === selectedFloor);
  }, [faults, selectedFloor]);

  const statusCounts = useMemo(() => {
    const counts = { normal: 0, fault: 0, pending: 0, scrapped: 0 };
    floorDevices.forEach(d => {
      counts[d.status]++;
    });
    return counts;
  }, [floorDevices]);

  const faultDevices = useMemo(() => {
    return floorDevices.filter(d => d.status === 'fault' || d.status === 'pending');
  }, [floorDevices]);

  const overdueDevices = useMemo(() => {
    return floorDevices.filter(d => isOverdue(d.nextMaintenance));
  }, [floorDevices]);

  const upcomingTasks = useMemo(() => {
    return floorTasks.filter(t => !isOverdue(t.date) && getDaysUntil(t.date) <= 7);
  }, [floorTasks]);

  const floorAssignees = useMemo(() => {
    const assigneeMap = new Map<string, { tasks: MaintenanceTask[]; completed: number; inProgress: number; pending: number }>();
    
    floorTasks.forEach(task => {
      if (!assigneeMap.has(task.assignee)) {
        assigneeMap.set(task.assignee, { tasks: [], completed: 0, inProgress: 0, pending: 0 });
      }
      const data = assigneeMap.get(task.assignee)!;
      data.tasks.push(task);
      if (task.status === 'completed') data.completed++;
      else if (task.status === 'in_progress') data.inProgress++;
      else if (task.status === 'pending') data.pending++;
    });
    
    return Array.from(assigneeMap.entries()).map(([name, data]) => ({
      name,
      total: data.tasks.length,
      completed: data.completed,
      inProgress: data.inProgress,
      pending: data.pending
    }));
  }, [floorTasks]);

  const totalFaultCount = useMemo(() => {
    return floorFaults.reduce((sum, f) => sum + f.faultCount, 0);
  }, [floorFaults]);

  const getDeviceTask = (device: Device): MaintenanceTask | undefined => {
    return floorTasks.find(t => t.deviceId === device.id);
  };

  const getDeviceFault = (device: Device): FaultRecord | undefined => {
    return floorFaults.find(f => f.deviceId === device.id);
  };

  const getAssigneeColor = (name: string): string => {
    const colors = ['#00d4ff', '#00c48c', '#faad14', '#a855f7', '#f97316'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const hasData = floorDevices.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <FloorSelector />
        <FloorLegend counts={statusCounts} total={floorDevices.length} />
      </div>

      {hasData ? (
        <div className="grid grid-cols-4 gap-6" style={{ height: 'calc(100vh - 320px)' }}>
          <div className="col-span-3 glass-card p-6 relative overflow-hidden">
            <h3 className="title-section">
              {selectedFloor}层平面图 - 设备分布
              <span className="ml-2 text-sm font-normal text-white/50">
                共 {floorDevices.length} 台设备 · {floorTasks.length} 项任务 · {totalFaultCount} 次故障
              </span>
            </h3>
            
            <div className="relative w-full h-full mt-4 rounded-xl overflow-hidden border border-white/10 bg-bg-secondary/50">
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 212, 255, 0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect 
                  x="5" y="5" width="90" height="90" 
                  fill="none" 
                  stroke="rgba(0, 212, 255, 0.3)" 
                  strokeWidth="0.5"
                  rx="2"
                />
                
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3" strokeDasharray="1,1" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3" strokeDasharray="1,1" />
                
                <rect x="8" y="8" width="15" height="12" fill="rgba(0, 212, 255, 0.1)" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.3" rx="1" />
                <text x="15.5" y="15" textAnchor="middle" fontSize="2" fill="rgba(255, 255, 255, 0.3)">会议室A</text>
                
                <rect x="28" y="8" width="18" height="12" fill="rgba(0, 212, 255, 0.1)" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.3" rx="1" />
                <text x="37" y="15" textAnchor="middle" fontSize="2" fill="rgba(255, 255, 255, 0.3)">开放区</text>
                
                <rect x="52" y="8" width="15" height="12" fill="rgba(0, 212, 255, 0.1)" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.3" rx="1" />
                <text x="59.5" y="15" textAnchor="middle" fontSize="2" fill="rgba(255, 255, 255, 0.3)">会议室B</text>
                
                <rect x="72" y="8" width="20" height="12" fill="rgba(255, 122, 69, 0.1)" stroke="rgba(255, 122, 69, 0.3)" strokeWidth="0.3" rx="1" />
                <text x="82" y="15" textAnchor="middle" fontSize="2" fill="rgba(255, 255, 255, 0.3)">机房</text>
                
                <rect x="8" y="28" width="20" height="20" fill="rgba(0, 212, 255, 0.1)" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.3" rx="1" />
                <text x="18" y="39" textAnchor="middle" fontSize="2" fill="rgba(255, 255, 255, 0.3)">办公区A</text>
                
                <rect x="34" y="28" width="28" height="20" fill="rgba(0, 212, 255, 0.1)" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.3" rx="1" />
                <text x="48" y="39" textAnchor="middle" fontSize="2" fill="rgba(255, 255, 255, 0.3)">中庭</text>
                
                <rect x="68" y="28" width="24" height="20" fill="rgba(0, 212, 255, 0.1)" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.3" rx="1" />
                <text x="80" y="39" textAnchor="middle" fontSize="2" fill="rgba(255, 255, 255, 0.3)">办公区B</text>
                
                <rect x="8" y="56" width="25" height="15" fill="rgba(0, 212, 255, 0.1)" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.3" rx="1" />
                <text x="20.5" y="64.5" textAnchor="middle" fontSize="2" fill="rgba(255, 255, 255, 0.3)">培训室</text>
                
                <rect x="39" y="56" width="22" height="15" fill="rgba(0, 212, 255, 0.1)" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.3" rx="1" />
                <text x="50" y="64.5" textAnchor="middle" fontSize="2" fill="rgba(255, 255, 255, 0.3)">休息区</text>
                
                <rect x="67" y="56" width="25" height="15" fill="rgba(0, 212, 255, 0.1)" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.3" rx="1" />
                <text x="79.5" y="64.5" textAnchor="middle" fontSize="2" fill="rgba(255, 255, 255, 0.3)">资料室</text>
                
                <rect x="8" y="78" width="84" height="14" fill="rgba(0, 212, 255, 0.05)" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="0.3" rx="1" />
                <text x="50" y="86.5" textAnchor="middle" fontSize="2" fill="rgba(255, 255, 255, 0.3)">走廊</text>
                
                <rect x="45" y="5" width="10" height="6" fill="rgba(255, 122, 69, 0.2)" stroke="rgba(255, 122, 69, 0.5)" strokeWidth="0.3" rx="0.5" />
                <text x="50" y="9" textAnchor="middle" fontSize="1.5" fill="rgba(255, 255, 255, 0.5)">电梯厅</text>
              </svg>

              <AnimatePresence>
                {floorDevices.map((device, index) => (
                  <DevicePoint
                    key={device.id}
                    device={device}
                    onClick={() => setSelectedDevice(device)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="glass-card p-4">
              <h3 className="title-section flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-accent-primary" />
                本层设备统计
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {Object.entries(statusCounts).map(([status, count]) => {
                  const labels: Record<string, string> = { normal: '正常', fault: '故障', pending: '待修', scrapped: '报废' };
                  const colors: Record<string, string> = { normal: '#00c48c', fault: '#ff4d4f', pending: '#faad14', scrapped: '#8c8c8c' };
                  const percentage = floorDevices.length > 0 ? (count / floorDevices.length * 100).toFixed(0) : 0;
                  
                  return (
                    <div key={status} className="text-center p-2 rounded-lg bg-white/5">
                      <div 
                        className="font-display text-xl font-bold mb-1"
                        style={{ color: colors[status] }}
                      >
                        {count}
                      </div>
                      <div className="text-xs text-white/50">{labels[status]}</div>
                      <div className="text-xs text-white/30">{percentage}%</div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">设备总数</span>
                  <span className="font-display text-2xl font-bold text-accent-primary">
                    {floorDevices.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="title-section flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-status-fault" />
                故障设备明细
                <span className="ml-auto text-xs font-normal text-status-fault bg-status-fault/10 px-2 py-0.5 rounded-full">
                  {faultDevices.length}台 · {totalFaultCount}次
                </span>
              </h3>
              
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {floorFaults.length > 0 ? (
                  floorFaults.map((fault) => {
                    const device = floorDevices.find(d => d.id === fault.deviceId);
                    if (!device) return null;
                    const task = getDeviceTask(device);
                    
                    return (
                      <motion.div
                        key={fault.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-status-fault/5 border border-status-fault/20 cursor-pointer hover:bg-status-fault/10 transition-colors group"
                        onClick={() => setSelectedDevice(device)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ backgroundColor: STATUS_COLORS[device.status] }}
                            />
                            <span className="text-sm font-medium text-white/90 truncate">{device.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div>
                            <div className="text-white/40">故障次数</div>
                            <div className="font-bold text-status-fault">{fault.faultCount}次</div>
                          </div>
                          <div>
                            <div className="text-white/40">平均修复</div>
                            <div className="font-medium text-accent-primary">{fault.avgRepairTime}h</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-white/40">供应商:</span>
                            <span className="text-white/70">{fault.supplier}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-accent-secondary" />
                            <span className="text-accent-secondary font-medium">¥{fault.cost.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                          <div className="text-xs text-white/40">
                            最近故障: <span className="text-white/60">{formatDate(fault.lastFault)}</span>
                          </div>
                          {task && (
                            <span 
                              className="text-xs px-2 py-0.5 rounded"
                              style={{ 
                                backgroundColor: `${TASK_STATUS_COLORS[task.status]}20`,
                                color: TASK_STATUS_COLORS[task.status]
                              }}
                            >
                              {TASK_STATUS_LABELS[task.status]}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-white/30 text-sm">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    本层无故障记录
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="title-section flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-status-pending" />
                超期维保设备
                <span className="ml-auto text-xs font-normal text-status-pending bg-status-pending/10 px-2 py-0.5 rounded-full">
                  {overdueDevices.length}台
                </span>
              </h3>
              
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {overdueDevices.length > 0 ? (
                  overdueDevices.map((device) => {
                    const overdueDays = Math.abs(getDaysUntil(device.nextMaintenance));
                    return (
                      <motion.div
                        key={device.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-status-pending/5 border border-status-pending/20 cursor-pointer hover:bg-status-pending/10 transition-colors group"
                        onClick={() => setSelectedDevice(device)}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-medium text-white/90 truncate">{device.name}</span>
                          <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">下次维保: {formatDate(device.nextMaintenance)}</span>
                          <span className="text-status-fault font-medium">
                            超期 {overdueDays} 天
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-white/30 text-sm">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    本层无超期设备
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="title-section flex items-center gap-2 mb-3">
                <Wrench className="w-4 h-4 text-accent-primary" />
                近期维保任务
                <span className="ml-auto text-xs font-normal text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-full">
                  {upcomingTasks.length}项
                </span>
              </h3>
              
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => {
                    const daysUntil = getDaysUntil(task.date);
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-medium text-white/90 truncate">{task.deviceName}</span>
                          <span 
                            className="text-xs px-2 py-0.5 rounded flex-shrink-0 ml-2"
                            style={{ 
                              backgroundColor: `${TASK_STATUS_COLORS[task.status]}20`,
                              color: TASK_STATUS_COLORS[task.status]
                            }}
                          >
                            {TASK_STATUS_LABELS[task.status]}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ backgroundColor: getAssigneeColor(task.assignee) }}
                            >
                              {task.assigneeAvatar}
                            </div>
                            <span className="text-white/60">{task.assignee}</span>
                          </div>
                          <span className="text-white/50">
                            {daysUntil === 0 ? '今天' : daysUntil === 1 ? '明天' : `${daysUntil}天后`}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/40">{task.type}</span>
                            <span className="text-white/40">{task.progress}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${task.progress}%`,
                                backgroundColor: TASK_STATUS_COLORS[task.status]
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-white/30 text-sm">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    近期无维保任务
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="title-section flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-accent-secondary" />
                负责人工作状态
              </h3>
              
              <div className="space-y-2">
                {floorAssignees.length > 0 ? (
                  floorAssignees.map((person) => (
                    <div key={person.name} className="p-2 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            style={{ backgroundColor: getAssigneeColor(person.name) }}
                          >
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white/80">{person.name}</div>
                            <div className="text-xs text-white/40">{person.total} 项任务</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {person.inProgress > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-accent-primary/20 text-accent-primary">
                              进行中 {person.inProgress}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div 
                          className="h-1.5 rounded-full bg-status-normal"
                          style={{ width: person.total > 0 ? `${(person.completed / person.total) * 100}%` : '0%' }}
                        />
                        <div 
                          className="h-1.5 rounded-full bg-accent-primary"
                          style={{ width: person.total > 0 ? `${(person.inProgress / person.total) * 100}%` : '0%' }}
                        />
                        <div 
                          className="h-1.5 rounded-full bg-status-pending"
                          style={{ width: person.total > 0 ? `${(person.pending / person.total) * 100}%` : '0%' }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1 text-white/40">
                        <span>已完成 {person.completed}</span>
                        <span>待处理 {person.pending}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-white/30 text-sm">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    本层暂无任务负责人
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 320px)' }}>
          <XCircle className="w-16 h-16 text-white/10 mb-4" />
          <div className="text-xl font-medium text-white/30 mb-2">该楼层无设备</div>
          <div className="text-sm text-white/20">当前筛选条件下{selectedFloor}层没有设备，请调整筛选条件</div>
        </div>
      )}

      <DeviceModal 
        device={selectedDevice} 
        onClose={() => setSelectedDevice(null)} 
      />
    </motion.div>
  );
};

export default FloorMap;
