import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { DEVICE_TYPE_LABELS } from '../../types';

type ViewMode = 'month' | 'department' | 'type';

interface TrendLineChartProps {
  data: {
    byMonth: { month: string; total: number; breakdown: { parts: number; labor: number; outsourcing: number } }[];
    byDepartment: { department: string; total: number; breakdown: { parts: number; labor: number; outsourcing: number } }[];
    byType: { deviceType: string; total: number; breakdown: { parts: number; labor: number; outsourcing: number } }[];
  };
  mode: ViewMode;
}

const TrendLineChart = ({ data, mode }: TrendLineChartProps) => {
  const option = useMemo(() => {
    let categories: string[] = [];
    let totals: number[] = [];
    let unitLabel = '';

    if (mode === 'month') {
      categories = data.byMonth.map(d => d.month.slice(5) + '月');
      totals = data.byMonth.map(d => d.total);
      unitLabel = '月份';
    } else if (mode === 'department') {
      categories = data.byDepartment.map(d => d.department);
      totals = data.byDepartment.map(d => d.total);
      unitLabel = '部门';
    } else {
      categories = data.byType.map(d => DEVICE_TYPE_LABELS[d.deviceType as keyof typeof DEVICE_TYPE_LABELS] || d.deviceType);
      totals = data.byType.map(d => d.total);
      unitLabel = '资产类别';
    }

    const hasData = totals.length > 0 && totals.some(t => t > 0);

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(20, 30, 48, 0.95)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontFamily: 'Noto Sans SC'
        },
        formatter: (params: any) => {
          if (!hasData) return '暂无数据';
          const item = params[0];
          let record: any;
          
          if (mode === 'month') {
            record = data.byMonth[item.dataIndex];
          } else if (mode === 'department') {
            record = data.byDepartment[item.dataIndex];
          } else {
            record = data.byType[item.dataIndex];
          }
          
          if (!record) return '暂无数据';
          
          const categoryName = mode === 'type' 
            ? DEVICE_TYPE_LABELS[(record.deviceType || '') as keyof typeof DEVICE_TYPE_LABELS] || record.deviceType
            : mode === 'month' 
            ? record.month.replace('-', '年') + '月'
            : record.department;
          
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${categoryName}</div>
              <div style="color: #00d4ff;">总费用: ¥${record.total.toLocaleString()}</div>
              <div style="color: #00c48c;">零配件: ¥${record.breakdown.parts.toLocaleString()}</div>
              <div style="color: #faad14;">人工费: ¥${record.breakdown.labor.toLocaleString()}</div>
              <div style="color: #a855f7;">外包: ¥${record.breakdown.outsourcing.toLocaleString()}</div>
            </div>
          `;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
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
          name: '总费用',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#00d4ff' },
                { offset: 1, color: '#a855f7' }
              ]
            }
          },
          itemStyle: {
            color: '#00d4ff',
            borderColor: '#fff',
            borderWidth: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
                { offset: 1, color: 'rgba(0, 212, 255, 0)' }
              ]
            }
          },
          data: totals
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

export default TrendLineChart;
