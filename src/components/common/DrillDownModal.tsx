import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, AlertTriangle, Clock, CheckCircle, AlertCircle, Wrench, Building2 } from 'lucide-react';
import { useFilteredDevices, useFilteredTasks, useFilteredFaults, useAssetStore } from '../../store/useAssetStore';
import { STATUS_LABELS, STATUS_COLORS, DEVICE_TYPE_LABELS, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../types';
import { formatDate, isOverdue } from '../../utils/helpers';
import type { Device, MaintenanceTask, FaultRecord } from '../../types';

export type DrillDownType = 'total' | 'inUse' | 'pending' | 'fault' | 'overdue' | 'totalFaults' | 'tasks';

interface DrillDownModalProps {
  type: DrillDownType;
  isOpen: boolean;
  onClose: () => void;
}

const typeConfig: Record<DrillDownType, { title: string; icon: any; color: string }> = {
  total: { title: '全部设备', icon: Package, color: '#00d4ff' },
  inUse: { title: '正常设备', icon: CheckCircle, color: '#00c48c' },
  pending: { title: '待修设备', icon: AlertTriangle, color: '#faad14' },
  fault: { title: '故障设备', icon: AlertCircle, color: '#ff4d4f' },
  overdue: { title: '超期维保设备', icon: Clock, color: '#ff4d4f' },
  totalFaults: { title: '故障记录明细', icon: Wrench, color: '#ff4d4f' },
  tasks: { title: '维保任务明细', icon: Building2, color: '#00d4ff' },
};

const DrillDownModal = ({ type, isOpen, onClose }: DrillDownModalProps) => {
  const { filters } = useAssetStore();
  const devices = useFilteredDevices();
  const tasks = useFilteredTasks();
  const faults = useFilteredFaults();

  const data = useMemo(() => {
    switch (type) {
      case 'total':
        return { devices, tasks, faults: [] as FaultRecord[] };
      case 'inUse':
        return { devices: devices.filter(d => d.status === 'normal'), tasks, faults: [] as FaultRecord[] };
      case 'pending':
        return { devices: devices.filter(d => d.status === 'pending'), tasks, faults: [] as FaultRecord[] };
      case 'fault':
        return { devices: devices.filter(d => d.status === 'fault'), tasks, faults: [] as FaultRecord[] };
      case 'overdue':
        return { devices: devices.filter(d => isOverdue(d.nextMaintenance)), tasks, faults: [] as FaultRecord[] };
      case 'totalFaults':
        return { devices: [], tasks, faults };
      case 'tasks':
        return { devices: [], tasks, faults: [] as FaultRecord[] };
      default:
        return { devices: [], tasks: [], faults: [] as FaultRecord[] };
    }
  }, [type, devices, tasks, faults]);

  const config = typeConfig[type];
  const Icon = config.icon;

  const getDeviceTask = (device: Device): MaintenanceTask | undefined => {
    return tasks.find(t => t.deviceId === device.id);
  };

  const renderDeviceRow = (device: Device) => {
    const task = getDeviceTask(device);
    return (
      <motion.tr
        key={device.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/5 hover:bg-white/5 transition-colors"
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[device.status] }}
            />
            <span className="font-medium text-white/90">{device.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-white/60">{DEVICE_TYPE_LABELS[device.type]}</td>
        <td className="px-4 py-3 text-sm text-white/60">{device.department}</td>
        <td className="px-4 py-3 text-sm text-white/60">{device.floor}层</td>
        <td className="px-4 py-3">
          <span 
            className="px-2 py-1 rounded text-xs font-medium"
            style={{ 
              backgroundColor: `${STATUS_COLORS[device.status]}20`,
              color: STATUS_COLORS[device.status]
            }}
          >
            {STATUS_LABELS[device.status]}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-white/60">{formatDate(device.lastMaintenance)}</td>
        <td className="px-4 py-3">
          <span className={`text-sm ${isOverdue(device.nextMaintenance) ? 'text-status-fault font-medium' : 'text-white/60'}`}>
            {formatDate(device.nextMaintenance)}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-white/60">
          {task ? (
            <span 
              className="px-2 py-1 rounded text-xs"
              style={{ 
                backgroundColor: `${TASK_STATUS_COLORS[task.status]}20`,
                color: TASK_STATUS_COLORS[task.status]
              }}
            >
              {TASK_STATUS_LABELS[task.status]}
            </span>
          ) : '-'}
        </td>
      </motion.tr>
    );
  };

  const renderTaskRow = (task: MaintenanceTask) => {
    const device = devices.find(d => d.id === task.deviceId);
    return (
      <motion.tr
        key={task.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/5 hover:bg-white/5 transition-colors"
      >
        <td className="px-4 py-3 font-mono text-xs text-white/40">{task.id}</td>
        <td className="px-4 py-3 font-medium text-white/90">{task.deviceName}</td>
        <td className="px-4 py-3 text-sm text-white/60">{DEVICE_TYPE_LABELS[task.deviceType]}</td>
        <td className="px-4 py-3 text-sm text-white/60">{task.type}</td>
        <td className="px-4 py-3 text-sm text-white/60">{task.assignee}</td>
        <td className="px-4 py-3 text-sm text-white/60">{formatDate(task.date)}</td>
        <td className="px-4 py-3">
          <span 
            className="px-2 py-1 rounded text-xs font-medium"
            style={{ 
              backgroundColor: `${TASK_STATUS_COLORS[task.status]}20`,
              color: TASK_STATUS_COLORS[task.status]
            }}
          >
            {TASK_STATUS_LABELS[task.status]}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${task.progress}%`,
                  backgroundColor: TASK_STATUS_COLORS[task.status]
                }}
              />
            </div>
            <span className="text-xs text-white/60 w-10 text-right">{task.progress}%</span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-white/60">{device ? `${device.floor}层` : '-'}</td>
      </motion.tr>
    );
  };

  const renderFaultRow = (fault: FaultRecord) => {
    const device = devices.find(d => d.id === fault.deviceId);
    return (
      <motion.tr
        key={fault.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/5 hover:bg-white/5 transition-colors"
      >
        <td className="px-4 py-3 font-mono text-xs text-white/40">{fault.id}</td>
        <td className="px-4 py-3 font-medium text-white/90">{fault.deviceName}</td>
        <td className="px-4 py-3 text-sm text-white/60">{DEVICE_TYPE_LABELS[fault.deviceType]}</td>
        <td className="px-4 py-3 text-sm text-white/60">{fault.supplier}</td>
        <td className="px-4 py-3 text-center">
          <span className="font-display font-bold text-status-fault">{fault.faultCount}</span>
        </td>
        <td className="px-4 py-3 text-center">
          <span className="font-display font-bold text-accent-primary">{fault.avgRepairTime.toFixed(1)}h</span>
        </td>
        <td className="px-4 py-3 text-sm text-white/60">{formatDate(fault.lastFault)}</td>
        <td className="px-4 py-3 text-sm text-accent-secondary font-medium">¥{fault.cost.toLocaleString()}</td>
        <td className="px-4 py-3 text-sm text-white/60">{device ? `${device.floor}层` : '-'}</td>
      </motion.tr>
    );
  };

  const hasData = type === 'totalFaults' ? data.faults.length > 0 : type === 'tasks' ? data.tasks.length > 0 : data.devices.length > 0;

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
            className="relative bg-glass-card border border-white/10 rounded-2xl w-full max-w-7xl max-h-[85vh] overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{config.title}</h2>
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

            {hasData ? (
              <div className="overflow-auto max-h-[calc(85vh-80px)]">
                {(type === 'totalFaults' ? data.faults.length > 0 : type === 'tasks' ? data.tasks.length > 0 : data.devices.length > 0) && (
                  <table className="w-full">
                    <thead className="sticky top-0 bg-bg-secondary/95 backdrop-blur-sm">
                      <tr className="border-b border-white/10">
                        {type === 'totalFaults' ? (
                          <>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">编号</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">设备名称</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">类型</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">供应商</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">故障次数</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">平均修复时长</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">最近故障</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">累计成本</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">位置</th>
                          </>
                        ) : type === 'tasks' ? (
                          <>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">编号</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">设备名称</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">类型</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">维保类型</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">负责人</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">计划日期</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">状态</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider w-32">进度</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">位置</th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">设备名称</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">类型</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">所属部门</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">位置</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">状态</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">上次维保</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">下次维保</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">任务状态</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {type === 'totalFaults' 
                        ? data.faults.map(renderFaultRow)
                        : type === 'tasks'
                        ? data.tasks.map(renderTaskRow)
                        : data.devices.map(renderDeviceRow)
                      }
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${config.color}10` }}
                >
                  <Icon className="w-8 h-8" style={{ color: `${config.color}40` }} />
                </div>
                <div className="text-xl font-medium text-white/40 mb-2">暂无数据</div>
                <div className="text-sm text-white/30">当前筛选条件下没有{config.title}</div>
              </div>
            )}

            <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-bg-secondary/50">
              <div className="text-sm text-white/50">
                共 <span className="font-display font-bold text-white/80">
                  {type === 'totalFaults' ? data.faults.length : type === 'tasks' ? data.tasks.length : data.devices.length}
                </span> 条记录
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

export default DrillDownModal;
