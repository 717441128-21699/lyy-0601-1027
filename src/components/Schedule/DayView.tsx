import { motion } from 'framer-motion';
import type { MaintenanceTask } from '../../types';
import { TASK_STATUS_COLORS } from '../../types';
import { getWeekDay, formatShortDate } from '../../utils/helpers';

interface DayViewProps {
  date: string;
  label: string;
  tasks: MaintenanceTask[];
}

const DayView = ({ date, label, tasks }: DayViewProps) => {
  const isToday = label === '今天';
  
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-4 ${isToday ? 'border-accent-primary/50 shadow-glow' : ''}`}
    >
      <div className="text-center mb-3">
        <div className={`text-sm font-medium ${isToday ? 'text-accent-primary' : 'text-white/80'}`}>
          {label}
        </div>
        <div className="text-xs text-white/50">
          {formatShortDate(date)} {getWeekDay(date)}
        </div>
      </div>
      
      <div className="flex justify-center items-end gap-1 h-12 mb-3">
        {Object.entries(statusCounts).map(([status, count], index) => {
          const maxCount = Math.max(...Object.values(statusCounts));
          const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <motion.div
              key={status}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-6 rounded-t-sm min-h-[4px]"
              style={{ backgroundColor: TASK_STATUS_COLORS[status as keyof typeof TASK_STATUS_COLORS] }}
              title={`${status}: ${count}`}
            />
          );
        })}
      </div>
      
      <div className="text-center">
        <span className="font-display text-2xl font-bold text-white">
          {tasks.length}
        </span>
        <span className="text-xs text-white/50 ml-1">项任务</span>
      </div>
      
      {tasks.length > 0 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-1">
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: TASK_STATUS_COLORS[status as keyof typeof TASK_STATUS_COLORS] }}
              />
              <span className="text-xs text-white/40">{count}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DayView;
