import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAssetStore, useFilteredDevices } from '../../store/useAssetStore';
import { STATUS_COLORS, STATUS_LABELS } from '../../types';
import FloorSelector from './FloorSelector';
import DevicePoint from './DevicePoint';
import DeviceModal from './DeviceModal';
import FloorLegend from './FloorLegend';

const FloorMap = () => {
  const { selectedFloor, selectedDevice, setSelectedDevice } = useAssetStore();
  const devices = useFilteredDevices();

  const floorDevices = useMemo(() => {
    return devices.filter(d => d.floor === selectedFloor);
  }, [devices, selectedFloor]);

  const statusCounts = useMemo(() => {
    const counts = { normal: 0, fault: 0, pending: 0, scrapped: 0 };
    floorDevices.forEach(d => {
      counts[d.status]++;
    });
    return counts;
  }, [floorDevices]);

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

      <div className="grid grid-cols-4 gap-6" style={{ height: 'calc(100vh - 320px)' }}>
        <div className="col-span-3 glass-card p-6 relative overflow-hidden">
          <h3 className="title-section">
            {selectedFloor}层平面图 - 设备分布
            <span className="ml-2 text-sm font-normal text-white/50">
              共 {floorDevices.length} 台设备
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

            {floorDevices.map((device, index) => (
              <DevicePoint
                key={device.id}
                device={device}
                onClick={() => setSelectedDevice(device)}
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="title-section">本层设备统计</h3>
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => {
                const labels: Record<string, string> = { normal: '正常', fault: '故障', pending: '待修', scrapped: '报废' };
                const colors: Record<string, string> = { normal: '#00c48c', fault: '#ff4d4f', pending: '#faad14', scrapped: '#8c8c8c' };
                const percentage = floorDevices.length > 0 ? (count / floorDevices.length * 100).toFixed(1) : 0;
                
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[status] }}
                    />
                    <span className="text-sm text-white/70 flex-1">{labels[status]}</span>
                    <span className="font-display text-lg font-bold" style={{ color: colors[status] }}>
                      {count}
                    </span>
                    <span className="text-xs text-white/40 w-12 text-right">{percentage}%</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">设备总数</span>
                <span className="font-display text-2xl font-bold text-accent-primary">
                  {floorDevices.length}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="title-section">告警提示</h3>
            <div className="space-y-3">
              {floorDevices.filter(d => d.status === 'fault' || d.status === 'pending').slice(0, 5).map(device => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => setSelectedDevice(device)}
                >
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: STATUS_COLORS[device.status] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white/80 truncate">{device.name}</div>
                    <div className="text-xs text-white/40">{STATUS_LABELS[device.status]}</div>
                  </div>
                </motion.div>
              ))}
              
              {floorDevices.filter(d => d.status === 'fault' || d.status === 'pending').length === 0 && (
                <div className="text-center py-6 text-white/30 text-sm">
                  暂无告警设备
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeviceModal 
        device={selectedDevice} 
        onClose={() => setSelectedDevice(null)} 
      />
    </motion.div>
  );
};

export default FloorMap;
