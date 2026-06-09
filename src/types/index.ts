export interface AssetStats {
  total: number;
  inUse: number;
  pendingRepair: number;
  scrapped: number;
  overdue: number;
  trends: {
    total: number;
    inUse: number;
    pendingRepair: number;
    scrapped: number;
    overdue: number;
  };
}

export type DeviceType = 'air_conditioner' | 'elevator' | 'printer' | 'projector' | 'other';
export type DeviceStatus = 'normal' | 'fault' | 'pending' | 'scrapped';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  floor: number;
  position: { x: number; y: number };
  status: DeviceStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  department: string;
  brand: string;
  model: string;
  installDate: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface MaintenanceTask {
  id: string;
  date: string;
  deviceName: string;
  deviceType: DeviceType;
  type: string;
  assignee: string;
  assigneeAvatar: string;
  progress: number;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
}

export interface FaultRecord {
  id: string;
  deviceName: string;
  deviceType: DeviceType;
  faultCount: number;
  avgRepairTime: number;
  lastFault: string;
  supplier: string;
  cost: number;
}

export interface SupplierData {
  name: string;
  responseTime: number;
  repairRate: number;
  satisfaction: number;
  cost: number;
  coverage: number;
}

export interface CostRecord {
  month: string;
  total: number;
  breakdown: {
    parts: number;
    labor: number;
    outsourcing: number;
  };
}

export type TimeRange = '7d' | '30d' | '90d' | 'year';

export interface Filters {
  department: string;
  assetTypes: DeviceType[];
  timeRange: TimeRange;
}

export type ViewType = 'overview' | 'floorMap' | 'schedule' | 'faultRanking' | 'costTrend';

export const DEPARTMENTS = ['全部部门', '行政部', '技术部', '财务部', '市场部', '人力资源部'];

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  air_conditioner: '空调',
  elevator: '电梯',
  printer: '打印机',
  projector: '投影仪',
  other: '其他设备'
};

export const STATUS_LABELS: Record<DeviceStatus, string> = {
  normal: '正常',
  fault: '故障',
  pending: '待修',
  scrapped: '报废'
};

export const STATUS_COLORS: Record<DeviceStatus, string> = {
  normal: '#00c48c',
  fault: '#ff4d4f',
  pending: '#faad14',
  scrapped: '#8c8c8c'
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: '待处理',
  in_progress: '进行中',
  completed: '已完成'
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  pending: '#faad14',
  in_progress: '#00d4ff',
  completed: '#00c48c'
};
