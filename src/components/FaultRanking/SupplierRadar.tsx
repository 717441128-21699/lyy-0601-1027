import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { SupplierData } from '../../types';

interface SupplierRadarProps {
  suppliers: SupplierData[];
}

const SupplierRadar = ({ suppliers }: SupplierRadarProps) => {
  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 29, 53, 0.95)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      textStyle: {
        color: '#fff',
        fontSize: 12
      }
    },
    legend: {
      data: suppliers.map(s => s.name),
      bottom: 0,
      textStyle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 11
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 12
    },
    radar: {
      indicator: [
        { name: '响应速度', max: 100 },
        { name: '修复率', max: 100 },
        { name: '满意度', max: 100 },
        { name: '成本控制', max: 100 },
        { name: '服务覆盖', max: 100 }
      ],
      radius: '60%',
      center: ['50%', '45%'],
      splitNumber: 5,
      axisName: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(0, 212, 255, 0.02)', 'rgba(0, 212, 255, 0.05)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.15)'
        }
      }
    },
    series: [
      {
        name: '供应商评估',
        type: 'radar',
        data: suppliers.map((supplier, index) => {
          const colors = ['#00d4ff', '#00c48c', '#faad14', '#a855f7'];
          return {
            value: [
              supplier.responseTime,
              supplier.repairRate,
              supplier.satisfaction,
              100 - supplier.cost,
              supplier.coverage
            ],
            name: supplier.name,
            areaStyle: {
              color: `${colors[index]}20`
            },
            lineStyle: {
              color: colors[index],
              width: 2
            },
            itemStyle: {
              color: colors[index]
            },
            emphasis: {
              areaStyle: {
                color: `${colors[index]}40`
              }
            }
          };
        }),
        animationDuration: 1500,
        animationEasing: 'elasticOut'
      }
    ]
  }), [suppliers]);

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '300px' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default SupplierRadar;
