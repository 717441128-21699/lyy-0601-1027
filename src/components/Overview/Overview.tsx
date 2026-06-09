import { motion } from 'framer-motion';
import { Package, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { useFilteredAssetStats } from '../../store/useAssetStore';
import StatCard from './StatCard';
import StatusPieChart from './StatusPieChart';
import DeviceTypeChart from './DeviceTypeChart';
import QuickStats from './QuickStats';

const Overview = () => {
  const assetStats = useFilteredAssetStats();

  const statCards = [
    { title: '资产总数', value: assetStats.total, trend: assetStats.trends.total, icon: Package, color: '#00d4ff', delay: 0 },
    { title: '在用', value: assetStats.inUse, trend: assetStats.trends.inUse, icon: CheckCircle, color: '#00c48c', delay: 0.1 },
    { title: '待修', value: assetStats.pendingRepair, trend: assetStats.trends.pendingRepair, icon: AlertTriangle, color: '#faad14', delay: 0.2 },
    { title: '报废', value: assetStats.scrapped, trend: assetStats.trends.scrapped, icon: XCircle, color: '#8c8c8c', delay: 0.3 },
    { title: '超期维保', value: assetStats.overdue, trend: assetStats.trends.overdue, icon: Clock, color: '#ff4d4f', delay: 0.4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      <div className="grid grid-cols-5 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <StatusPieChart />
        </div>
        <div className="col-span-1">
          <DeviceTypeChart />
        </div>
        <div className="col-span-1">
          <QuickStats />
        </div>
      </div>
    </motion.div>
  );
};

export default Overview;
