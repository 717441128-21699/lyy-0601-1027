import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useAssetStore, useFilteredDevices } from '../../store/useAssetStore';
import { STATUS_LABELS, STATUS_COLORS } from '../../types';
import type { DeviceStatus } from '../../types';

const StatusPieChart = () => {
  const { assetStats } = useAssetStore();
  const devices = useFilteredDevices();

  const statusCounts = useMemo(() => {
    const counts: Record<DeviceStatus, number> = {
      normal: 0,
      fault: 0,
      pending: 0,
      scrapped: 0
    };
    
    devices.forEach(device => {
      counts[device.status]++;
    });
    
    return counts;
  }, [devices]);

  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 29, 53, 0.95)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      formatter: (params: any) => {
        return `${params.name}<br/>数量: ${params.value}<br/>占比: ${params.percent}%`;
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
      textStyle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12
      },
      formatter: (name: string) => {
        const count = statusCounts[name as DeviceStatus] || 0;
        const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
        const percent = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
        return `${name}  ${count} (${percent}%)`;
      }
    },
    series: [
      {
        name: '设备状态',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#0a1628',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff'
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 212, 255, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: statusCounts.normal, name: STATUS_LABELS.normal, itemStyle: { color: STATUS_COLORS.normal } },
          { value: statusCounts.fault, name: STATUS_LABELS.fault, itemStyle: { color: STATUS_COLORS.fault } },
          { value: statusCounts.pending, name: STATUS_LABELS.pending, itemStyle: { color: STATUS_COLORS.pending } },
          { value: statusCounts.scrapped, name: STATUS_LABELS.scrapped, itemStyle: { color: STATUS_COLORS.scrapped } }
        ],
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: () => Math.random() * 200
      }
    ]
  }), [statusCounts]);

  return (
    <div className="glass-card p-5 h-full">
      <h3 className="title-section">设备状态分布</h3>
      <ReactECharts 
        option={option} 
        style={{ height: '280px' }}
        opts={{ renderer: 'canvas' }}
      />
      
      <div className="grid grid-cols-4 gap-3 mt-4">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className="text-center p-2 rounded-lg bg-white/5">
            <div 
              className="font-display text-xl font-bold mb-1"
              style={{ color: STATUS_COLORS[status as DeviceStatus] }}
            >
              {statusCounts[status as DeviceStatus]}
            </div>
            <div className="text-xs text-white/50">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusPieChart;
