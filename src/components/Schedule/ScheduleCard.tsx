import { motion } from 'framer-motion';
import { User, Clock, AlertCircle } from 'lucide-react';
import type { MaintenanceTask } from '../../types';
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS, DEVICE_TYPE_LABELS } from '../../types';
import { getPriorityColor, getPriorityLabel, formatShortDate, getWeekDay } from '../../utils/helpers';

interface ScheduleCardProps {
  task: MaintenanceTask;
  index: number;
}

const ScheduleCard = ({ task, index }: ScheduleCardProps) => {
  const statusColor = TASK_STATUS_COLORS[task.status];
  const priorityColor = getPriorityColor(task.priority);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-card-hover p-4 mb-3"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white"
            style={{ backgroundColor: `${statusColor}30`, color: statusColor }}
          >
            {task.assigneeAvatar}
          </div>
          <div>
            <div className="font-medium text-white">{task.deviceName}</div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span>{DEVICE_TYPE_LABELS[task.deviceType]}</span>
              <span>·</span>
              <span>{task.type}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span 
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
          >
            {TASK_STATUS_LABELS[task.status]}
          </span>
          <span 
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${priorityColor}20`, color: priorityColor }}
          >
            {getPriorityLabel(task.priority)}优先级
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatShortDate(task.date)}</span>
            <span className="text-white/40">({getWeekDay(task.date)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{task.assignee}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-white/50">进度</span>
          <span className="font-display text-sm font-bold" style={{ color: statusColor }}>
            {task.progress}%
          </span>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${task.progress}%`,
            backgroundColor: statusColor
          }}
        />
      </div>

      {task.status === 'in_progress' && (
        <div className="mt-3 flex items-center gap-2 text-xs text-accent-primary">
          <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
          <span>正在进行中</span>
        </div>
      )}
    </motion.div>
  );
};

export default ScheduleCard;
