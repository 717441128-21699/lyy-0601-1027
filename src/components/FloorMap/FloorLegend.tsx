import { STATUS_LABELS, STATUS_COLORS } from '../../types';
import type { DeviceStatus } from '../../types';

interface FloorLegendProps {
  counts: Record<DeviceStatus, number>;
  total: number;
}

const FloorLegend = ({ counts, total }: FloorLegendProps) => {
  const statuses: DeviceStatus[] = ['normal', 'fault', 'pending', 'scrapped'];

  return (
    <div className="flex items-center gap-6">
      {statuses.map((status) => (
        <div key={status} className="flex items-center gap-2">
          <span 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[status] }}
          />
          <span className="text-sm text-white/60">{STATUS_LABELS[status]}</span>
          <span 
            className="font-display text-sm font-bold"
            style={{ color: STATUS_COLORS[status] }}
          >
            {counts[status]}
          </span>
        </div>
      ))}
      
      <div className="h-6 w-px bg-white/10" />
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-white/50">总计</span>
        <span className="font-display text-lg font-bold text-accent-primary">{total}</span>
        <span className="text-sm text-white/50">台</span>
      </div>
    </div>
  );
};

export default FloorLegend;
