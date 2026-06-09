import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { CostRecord } from '../../types';

interface TrendLineChartProps {
  data: CostRecord[];
}

const TrendLineChart = ({ data }: TrendLineChartProps) => {
  const option = useMemo(() => {
    const months = data.map(d => d.month.slice(5) + '月');
    const totals = data.map(d => d.total);

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
          const item = params[0];
          const record = data[item.dataIndex];
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${item.name}</div>
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
        data: months,
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 11
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
      series: [
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
      ]
    };
  }, [data]);

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default TrendLineChart;
