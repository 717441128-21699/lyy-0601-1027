import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Building, Tag, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Device } from '../../types';
import { STATUS_LABELS, STATUS_COLORS, DEVICE_TYPE_LABELS } from '../../types';
import { formatDate, getDaysUntil, isOverdue, cn } from '../../utils/helpers';

interface DeviceModalProps {
  device: Device | null;
  onClose: () => void;
}

const DeviceModal = ({ device, onClose }: DeviceModalProps) => {
  if (!device) return null;

  const statusColor = STATUS_COLORS[device.status];
  const daysUntil = getDaysUntil(device.nextMaintenance);
  const isMaintenanceOverdue = isOverdue(device.nextMaintenance);

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
          className="glass-card w-full max-w-lg p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>

          <div className="flex items-start gap-4 mb-6">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${statusColor}20`, border: `2px solid ${statusColor}` }}
            >
              <CheckCircle className="w-7 h-7" style={{ color: statusColor }} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{device.name}</h3>
              <div className="flex items-center gap-2">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                >
                  {STATUS_LABELS[device.status]}
                </span>
                <span className="text-sm text-white/50">{DEVICE_TYPE_LABELS[device.type]}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
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

          <div className="space-y-3 mb-6">
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

          <div className="flex gap-3">
            <button 
              className="flex-1 btn-primary text-sm"
              onClick={onClose}
            >
              关闭
            </button>
            <button 
              className="flex-1 btn-secondary text-sm"
            >
              查看维保记录
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeviceModal;
