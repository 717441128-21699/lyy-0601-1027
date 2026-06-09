import { motion } from 'framer-motion';
import { Wind, ArrowUpDown, Printer, Projector, Box } from 'lucide-react';
import type { Device } from '../../types';
import { STATUS_COLORS, DEVICE_TYPE_LABELS } from '../../types';
import { cn } from '../../utils/helpers';

interface DevicePointProps {
  device: Device;
  onClick: () => void;
  style?: React.CSSProperties;
}

const DeviceIcon = ({ type }: { type: Device['type'] }) => {
  const iconProps = { className: 'w-4 h-4' };
  switch (type) {
    case 'air_conditioner': return <Wind {...iconProps} />;
    case 'elevator': return <ArrowUpDown {...iconProps} />;
    case 'printer': return <Printer {...iconProps} />;
    case 'projector': return <Projector {...iconProps} />;
    default: return <Box {...iconProps} />;
  }
};

const DevicePoint = ({ device, onClick, style }: DevicePointProps) => {
  const color = STATUS_COLORS[device.status];
  const isFault = device.status === 'fault';
  const isPending = device.status === 'pending';

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.2, zIndex: 10 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        "absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all",
        isFault && "pulse-glow",
        isPending && "animate-pulse"
      )}
      style={{
        left: `${device.position.x}%`,
        top: `${device.position.y}%`,
        transform: 'translate(-50%, -50%)',
        backgroundColor: `${color}20`,
        border: `2px solid ${color}`,
        color: color,
        boxShadow: `0 0 10px ${color}40`,
        ...style
      }}
      title={`${device.name} - ${DEVICE_TYPE_LABELS[device.type]}`}
    >
      <DeviceIcon type={device.type} />
      
      {(isFault || isPending) && (
        <span 
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-bg-primary"
          style={{ backgroundColor: color }}
        />
      )}
    </motion.button>
  );
};

export default DevicePoint;
