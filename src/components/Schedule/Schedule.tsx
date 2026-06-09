import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useFilteredTasks } from '../../store/useAssetStore';
import AutoScrollList from './AutoScrollList';
import DayView from './DayView';

const Schedule = () => {
  const tasks = useFilteredTasks();

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    
    return {
      total: tasks.length,
      completed,
      inProgress,
      pending,
      highPriority,
      completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
    };
  }, [tasks]);

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, typeof tasks> = {};
    tasks.forEach(task => {
      if (!grouped[task.date]) {
        grouped[task.date] = [];
      }
      grouped[task.date].push(task);
    });
    return grouped;
  }, [tasks]);

  const dateLabels = [
    { date: '2026-06-10', label: '今天' },
    { date: '2026-06-11', label: '明天' },
    { date: '2026-06-12', label: '周五' },
    { date: '2026-06-13', label: '周六' },
    { date: '2026-06-14', label: '周日' },
    { date: '2026-06-15', label: '下周一' },
    { date: '2026-06-16', label: '下周二' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 h-full"
    >
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <div className="text-xs text-white/50">本周任务</div>
              <div className="font-display text-2xl font-bold text-accent-primary">{stats.total}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-normal/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-status-normal" />
            </div>
            <div>
              <div className="text-xs text-white/50">已完成</div>
              <div className="font-display text-2xl font-bold text-status-normal">{stats.completed}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <div className="text-xs text-white/50">进行中</div>
              <div className="font-display text-2xl font-bold text-accent-primary">{stats.inProgress}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-pending/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-status-pending" />
            </div>
            <div>
              <div className="text-xs text-white/50">待处理</div>
              <div className="font-display text-2xl font-bold text-status-pending">{stats.pending}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-status-fault/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-status-fault" />
            </div>
            <div>
              <div className="text-xs text-white/50">高优先级</div>
              <div className="font-display text-2xl font-bold text-status-fault">{stats.highPriority}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-6">
        {dateLabels.map(({ date, label }) => (
          <DayView 
            key={date} 
            date={date} 
            label={label} 
            tasks={tasksByDate[date] || []} 
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6" style={{ height: 'calc(100vh - 480px)' }}>
        <div className="col-span-2 glass-card p-5 overflow-hidden">
          <h3 className="title-section">任务列表</h3>
          <AutoScrollList tasks={tasks} />
        </div>

        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="title-section">完成进度</h3>
            <div className="relative pt-4">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="12"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${stats.completionRate * 3.52} 352`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00d4ff" />
                        <stop offset="100%" stopColor="#00c48c" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-display text-3xl font-bold text-white">
                        {stats.completionRate}%
                      </div>
                      <div className="text-xs text-white/50">完成率</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">已完成</span>
                  <span className="text-status-normal font-medium">{stats.completed} 项</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">进行中</span>
                  <span className="text-accent-primary font-medium">{stats.inProgress} 项</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">待处理</span>
                  <span className="text-status-pending font-medium">{stats.pending} 项</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 flex-1">
            <h3 className="title-section">负责人任务分布</h3>
            <div className="space-y-3">
              {['张工', '李工', '王工', '赵工'].map((name, index) => {
                const personTasks = tasks.filter(t => t.assignee === name);
                const count = personTasks.length;
                const maxCount = Math.max(...['张工', '李工', '王工', '赵工'].map(n => tasks.filter(t => t.assignee === n).length));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                const colors = ['#00d4ff', '#00c48c', '#faad14', '#a855f7'];
                
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">{name}</span>
                      <span className="font-display font-bold" style={{ color: colors[index] }}>{count} 项</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: colors[index]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Schedule;
