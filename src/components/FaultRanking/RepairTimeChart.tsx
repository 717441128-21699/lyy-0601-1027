import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { FaultRecord } from '../../types';

interface RepairTimeChartProps {
  faults: FaultRecord[];
}

const RepairTimeChart = ({ faults }: RepairTimeChartProps) => {
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
      },
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}<br/>平均修复时长: ${data.value} 小时`;
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
      data: faults.map(f => f.deviceName),
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
        interval: 0,
        rotate: 30
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: '小时',
      nameTextStyle: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10
      },
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
        name: '平均修复时长',
        type: 'bar',
        barWidth: '50%',
        data: faults.map(f => f.avgRepairTime),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: (params: any) => {
            const value = params.value;
            if (value >= 8) return {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#ff4d4f' },
                { offset: 1, color: 'rgba(255, 77, 79, 0.3)' }
              ]
            };
            if (value >= 5) return {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#faad14' },
                { offset: 1, color: 'rgba(250, 173, 20, 0.3)' }
              ]
            };
            return {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#00d4ff' },
                { offset: 1, color: 'rgba(0, 212, 255, 0.3)' }
              ]
            };
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(0, 212, 255, 0.5)'
          }
        },
        label: {
          show: true,
          position: 'top',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 10,
          formatter: '{c}h'
        },
        animationDuration: 1000,
        animationEasing: 'elasticOut'
      }
    ]
  }), [faults]);

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '280px' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default RepairTimeChart;
