import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useFilteredDevices } from '../../store/useAssetStore';
import { DEVICE_TYPE_LABELS } from '../../types';
import type { DeviceType } from '../../types';

const DeviceTypeChart = () => {
  const devices = useFilteredDevices();

  const typeCounts = useMemo(() => {
    const counts: Record<DeviceType, number> = {
      air_conditioner: 0,
      elevator: 0,
      printer: 0,
      projector: 0,
      other: 0
    };
    
    devices.forEach(device => {
      counts[device.type]++;
    });
    
    return counts;
  }, [devices]);

  const option = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(15, 29, 53, 0.95)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      textStyle: {
        color: '#fff',
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Object.values(DEVICE_TYPE_LABELS),
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        interval: 0,
        rotate: 0
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.05)'
        }
      }
    },
    series: [
      {
        name: '设备数量',
        type: 'bar',
        barWidth: '50%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#00d4ff' },
              { offset: 1, color: 'rgba(0, 212, 255, 0.2)' }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#ff7a45' },
                { offset: 1, color: 'rgba(255, 122, 69, 0.3)' }
              ]
            },
            shadowBlur: 15,
            shadowColor: 'rgba(0, 212, 255, 0.5)'
          }
        },
        data: Object.keys(DEVICE_TYPE_LABELS).map(type => typeCounts[type as DeviceType]),
        animationDuration: 1000,
        animationEasing: 'elasticOut'
      }
    ]
  }), [typeCounts]);

  return (
    <div className="glass-card p-5 h-full">
      <h3 className="title-section">设备类型分布</h3>
      <ReactECharts 
        option={option} 
        style={{ height: '340px' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default DeviceTypeChart;
