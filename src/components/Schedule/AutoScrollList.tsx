import { useRef, useEffect, useState } from 'react';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import type { MaintenanceTask } from '../../types';
import ScheduleCard from './ScheduleCard';

interface AutoScrollListProps {
  tasks: MaintenanceTask[];
}

const AutoScrollList = ({ tasks }: AutoScrollListProps) => {
  const { containerRef, pause, resume } = useAutoScroll({ speed: 0.5 });
  const [isPaused, setIsPaused] = useState(false);

  const handleMouseEnter = () => {
    pause();
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    resume();
    setIsPaused(false);
  };

  return (
    <div className="relative">
      <div 
        className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-bg-secondary to-transparent z-10 pointer-events-none"
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg-secondary to-transparent z-10 pointer-events-none"
      />
      
      <div
        ref={containerRef}
        className="h-[calc(100vh-380px)] overflow-hidden pr-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="pb-8">
          {tasks.map((task, index) => (
            <ScheduleCard key={task.id} task={task} index={index} />
          ))}
        </div>
        
        <div className="pb-8 opacity-50">
          {tasks.map((task, index) => (
            <ScheduleCard key={`duplicate-${task.id}`} task={task} index={index + tasks.length} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          isPaused 
            ? 'bg-white/20 text-white/80' 
            : 'bg-accent-primary/20 text-accent-primary'
        }`}>
          {isPaused ? '已暂停' : '自动滚动中'}
        </div>
      </div>
    </div>
  );
};

export default AutoScrollList;
