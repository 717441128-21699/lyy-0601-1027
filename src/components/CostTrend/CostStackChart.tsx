import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { DEVICE_TYPE_LABELS } from '../../types';

type ViewMode = 'month' | 'department' | 'type';

interface CostStackChartProps {
  data: {
    byMonth: { month: string; total: number; breakdown: { parts: number; labor: number; outsourcing: number } }[];
    byDepartment: { department: string; total: number; breakdown: { parts: number; labor: number; outsourcing: number } }[];
    byType: { deviceType: string; total: number; breakdown: { parts: number; labor: number; outsourcing: number } }[];
  };
  mode: ViewMode;
}

const CostStackChart = ({ data, mode }: CostStackChartProps) => {
  const option = useMemo(() => {
    let categories: string[] = [];
    let partsData: number[] = [];
    let laborData: number[] = [];
    let outsourcingData: number[] = [];

    if (mode === 'month') {
      categories = data.byMonth.map(d => d.month.slice(5) + '月');
      partsData = data.byMonth.map(d => d.breakdown.parts);
      laborData = data.byMonth.map(d => d.breakdown.labor);
      outsourcingData = data.byMonth.map(d => d.breakdown.outsourcing);
    } else if (mode === 'department') {
      categories = data.byDepartment.map(d => d.department);
      partsData = data.byDepartment.map(d => d.breakdown.parts);
      laborData = data.byDepartment.map(d => d.breakdown.labor);
      outsourcingData = data.byDepartment.map(d => d.breakdown.outsourcing);
    } else {
      categories = data.byType.map(d => DEVICE_TYPE_LABELS[d.deviceType as keyof typeof DEVICE_TYPE_LABELS] || d.deviceType);
      partsData = data.byType.map(d => d.breakdown.parts);
      laborData = data.byType.map(d => d.breakdown.labor);
      outsourcingData = data.byType.map(d => d.breakdown.outsourcing);
    }

    const hasData = partsData.length > 0 && partsData.some(t => t > 0);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: 'rgba(20, 30, 48, 0.95)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontFamily: 'Noto Sans SC'
        }
      },
      legend: {
        data: ['零配件', '人工费', '外包服务'],
        textStyle: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 11
        },
        top: 0,
        right: 0,
        itemWidth: 12,
        itemHeight: 12
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '18%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 11,
          rotate: mode !== 'month' ? 15 : 0
        }
      },
      yAxis: {
        type: 'value',
        stack: 'total',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.05)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 11,
          formatter: (value: number) => (value / 10000).toFixed(1) + '万'
        }
      },
      series: hasData ? [
        {
          name: '零配件',
          type: 'bar',
          stack: 'total',
          barWidth: mode === 'month' ? '50%' : '60%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#00c48c' },
                { offset: 1, color: 'rgba(0, 196, 140, 0.6)' }
              ]
            },
            borderRadius: [0, 0, 0, 0]
          },
          data: partsData
        },
        {
          name: '人工费',
          type: 'bar',
          stack: 'total',
          barWidth: mode === 'month' ? '50%' : '60%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#faad14' },
                { offset: 1, color: 'rgba(250, 173, 20, 0.6)' }
              ]
            }
          },
          data: laborData
        },
        {
          name: '外包服务',
          type: 'bar',
          stack: 'total',
          barWidth: mode === 'month' ? '50%' : '60%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#a855f7' },
                { offset: 1, color: 'rgba(168, 85, 247, 0.6)' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          data: outsourcingData
        }
      ] : []
    };
  }, [data, mode]);

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default CostStackChart;
