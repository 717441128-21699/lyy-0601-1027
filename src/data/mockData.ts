import type { AssetStats, Device, MaintenanceTask, FaultRecord, CostRecord, SupplierData, DeviceType } from '../types';

export const assetStats: AssetStats = {
  total: 1256,
  inUse: 1089,
  pendingRepair: 87,
  scrapped: 42,
  overdue: 38,
  trends: {
    total: 5.2,
    inUse: 4.8,
    pendingRepair: -12.3,
    scrapped: 8.5,
    overdue: -8.2
  }
};

const generateDevices = (): Device[] => {
  const devices: Device[] = [];
  const departments = ['行政部', '技术部', '财务部', '市场部', '人力资源部'];
  const types = ['air_conditioner', 'elevator', 'printer', 'projector', 'other'] as const;
  const statuses = ['normal', 'normal', 'normal', 'normal', 'fault', 'pending', 'scrapped'] as const;
  const brands = ['格力', '美的', '日立', '东芝', '惠普', '佳能', '爱普生', '索尼', '松下'];
  const models = ['Pro X1', 'Elite 2000', 'Smart 300', 'Ultra 500', 'Basic 100'];
  
  const deviceNames: Record<string, string[]> = {
    air_conditioner: ['中央空调A1', '中央空调B2', '中央空调C3', '分体空调D4', '精密空调E5'],
    elevator: ['客梯1号', '客梯2号', '货梯3号', '观光梯4号', '消防梯5号'],
    printer: ['激光打印机A', '彩色打印机B', '多功能一体机C', '高速打印机D', '大幅面打印机E'],
    projector: ['会议室投影1', '培训室投影2', '展厅投影3', '报告厅投影4', '多功能厅投影5'],
    other: ['门禁系统', '监控主机', 'UPS电源', '消防报警', '门禁控制器']
  };

  const floorPositions: Record<number, Array<{x: number, y: number}>> = {
    1: [{x: 15, y: 25}, {x: 45, y: 35}, {x: 75, y: 25}, {x: 25, y: 65}, {x: 55, y: 75}, {x: 85, y: 65}, {x: 35, y: 45}, {x: 65, y: 55}],
    2: [{x: 20, y: 30}, {x: 50, y: 20}, {x: 80, y: 35}, {x: 30, y: 70}, {x: 60, y: 60}, {x: 90, y: 75}, {x: 45, y: 45}, {x: 70, y: 55}],
    3: [{x: 18, y: 28}, {x: 48, y: 38}, {x: 78, y: 28}, {x: 28, y: 68}, {x: 58, y: 78}, {x: 88, y: 68}, {x: 38, y: 48}, {x: 68, y: 58}],
    4: [{x: 22, y: 32}, {x: 52, y: 22}, {x: 82, y: 32}, {x: 32, y: 72}, {x: 62, y: 62}, {x: 92, y: 72}, {x: 42, y: 42}, {x: 72, y: 52}],
    5: [{x: 16, y: 26}, {x: 46, y: 36}, {x: 76, y: 26}, {x: 26, y: 66}, {x: 56, y: 76}, {x: 86, y: 66}, {x: 36, y: 46}, {x: 66, y: 56}]
  };

  let id = 1;
  for (let floor = 1; floor <= 5; floor++) {
    const positions = floorPositions[floor] || [];
    for (let i = 0; i < positions.length; i++) {
      const type = types[i % types.length];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const pos = positions[i];
      
      devices.push({
        id: `DEV-${String(id++).padStart(4, '0')}`,
        name: deviceNames[type][i % deviceNames[type].length],
        type,
        floor,
        position: pos,
        status,
        lastMaintenance: `2026-${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        nextMaintenance: `2026-${String(Math.floor(Math.random() * 6) + 6).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        department: departments[Math.floor(Math.random() * departments.length)],
        brand: brands[Math.floor(Math.random() * brands.length)],
        model: models[Math.floor(Math.random() * models.length)],
        installDate: `202${Math.floor(Math.random() * 4) + 1}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      });
    }
  }
  return devices;
};

export const devices: Device[] = generateDevices();

export const maintenanceTasks: MaintenanceTask[] = [
  { id: 'T001', date: '2026-06-10', deviceName: '中央空调A1', deviceType: 'air_conditioner', type: '季度维保', assignee: '张工', assigneeAvatar: 'Z', progress: 75, status: 'in_progress', priority: 'high' },
  { id: 'T002', date: '2026-06-10', deviceName: '客梯1号', deviceType: 'elevator', type: '月度检查', assignee: '李工', assigneeAvatar: 'L', progress: 100, status: 'completed', priority: 'medium' },
  { id: 'T003', date: '2026-06-10', deviceName: '激光打印机A', deviceType: 'printer', type: '耗材更换', assignee: '王工', assigneeAvatar: 'W', progress: 0, status: 'pending', priority: 'low' },
  { id: 'T004', date: '2026-06-11', deviceName: '会议室投影1', deviceType: 'projector', type: '故障报修', assignee: '张工', assigneeAvatar: 'Z', progress: 30, status: 'in_progress', priority: 'high' },
  { id: 'T005', date: '2026-06-11', deviceName: '中央空调B2', deviceType: 'air_conditioner', type: '清洗保养', assignee: '赵工', assigneeAvatar: 'Z', progress: 0, status: 'pending', priority: 'medium' },
  { id: 'T006', date: '2026-06-12', deviceName: '货梯3号', deviceType: 'elevator', type: '年度检测', assignee: '李工', assigneeAvatar: 'L', progress: 0, status: 'pending', priority: 'high' },
  { id: 'T007', date: '2026-06-12', deviceName: '彩色打印机B', deviceType: 'printer', type: '故障维修', assignee: '王工', assigneeAvatar: 'W', progress: 50, status: 'in_progress', priority: 'medium' },
  { id: 'T008', date: '2026-06-13', deviceName: '培训室投影2', deviceType: 'projector', type: '灯泡更换', assignee: '赵工', assigneeAvatar: 'Z', progress: 0, status: 'pending', priority: 'low' },
  { id: 'T009', date: '2026-06-13', deviceName: '中央空调C3', deviceType: 'air_conditioner', type: '季度维保', assignee: '张工', assigneeAvatar: 'Z', progress: 0, status: 'pending', priority: 'high' },
  { id: 'T010', date: '2026-06-14', deviceName: '客梯2号', deviceType: 'elevator', type: '月度检查', assignee: '李工', assigneeAvatar: 'L', progress: 0, status: 'pending', priority: 'medium' },
  { id: 'T011', date: '2026-06-14', deviceName: '多功能一体机C', deviceType: 'printer', type: '维护保养', assignee: '王工', assigneeAvatar: 'W', progress: 0, status: 'pending', priority: 'low' },
  { id: 'T012', date: '2026-06-15', deviceName: '展厅投影3', deviceType: 'projector', type: '季度巡检', assignee: '赵工', assigneeAvatar: 'Z', progress: 0, status: 'pending', priority: 'medium' },
  { id: 'T013', date: '2026-06-15', deviceName: '分体空调D4', deviceType: 'air_conditioner', type: '加氟保养', assignee: '张工', assigneeAvatar: 'Z', progress: 0, status: 'pending', priority: 'low' },
  { id: 'T014', date: '2026-06-16', deviceName: '消防梯5号', deviceType: 'elevator', type: '季度检测', assignee: '李工', assigneeAvatar: 'L', progress: 0, status: 'pending', priority: 'high' },
];

export const faultRecords: FaultRecord[] = [
  { id: 'F001', deviceName: '中央空调A1', deviceType: 'air_conditioner', faultCount: 12, avgRepairTime: 4.5, lastFault: '2026-06-05', supplier: '格力售后', cost: 28500 },
  { id: 'F002', deviceName: '客梯1号', deviceType: 'elevator', faultCount: 9, avgRepairTime: 8.2, lastFault: '2026-06-08', supplier: '日立电梯', cost: 45200 },
  { id: 'F003', deviceName: '激光打印机A', deviceType: 'printer', faultCount: 8, avgRepairTime: 2.1, lastFault: '2026-06-07', supplier: '惠普金牌', cost: 12800 },
  { id: 'F004', deviceName: '会议室投影1', deviceType: 'projector', faultCount: 7, avgRepairTime: 3.8, lastFault: '2026-06-01', supplier: '索尼维修', cost: 18600 },
  { id: 'F005', deviceName: '中央空调B2', deviceType: 'air_conditioner', faultCount: 6, avgRepairTime: 5.2, lastFault: '2026-05-28', supplier: '美的售后', cost: 21300 },
  { id: 'F006', deviceName: '货梯3号', deviceType: 'elevator', faultCount: 5, avgRepairTime: 12.5, lastFault: '2026-05-25', supplier: '东芝电梯', cost: 52800 },
  { id: 'F007', deviceName: '彩色打印机B', deviceType: 'printer', faultCount: 5, avgRepairTime: 1.8, lastFault: '2026-06-03', supplier: '佳能快修', cost: 9800 },
  { id: 'F008', deviceName: '培训室投影2', deviceType: 'projector', faultCount: 4, avgRepairTime: 4.1, lastFault: '2026-05-20', supplier: '爱普生服务', cost: 15200 },
  { id: 'F009', deviceName: '中央空调C3', deviceType: 'air_conditioner', faultCount: 4, avgRepairTime: 3.9, lastFault: '2026-05-15', supplier: '格力售后', cost: 16500 },
  { id: 'F010', deviceName: '观光梯4号', deviceType: 'elevator', faultCount: 3, avgRepairTime: 6.8, lastFault: '2026-05-10', supplier: '日立电梯', cost: 38600 },
];

export const supplierData: SupplierData[] = [
  { name: '格力售后', responseTime: 85, repairRate: 92, satisfaction: 88, cost: 75, coverage: 90 },
  { name: '日立电梯', responseTime: 78, repairRate: 95, satisfaction: 85, cost: 82, coverage: 85 },
  { name: '惠普金牌', responseTime: 90, repairRate: 88, satisfaction: 92, cost: 68, coverage: 88 },
  { name: '索尼维修', responseTime: 72, repairRate: 85, satisfaction: 80, cost: 78, coverage: 75 },
];

const generateCostRecords = (): CostRecord[] => {
  const months = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
  const departments = ['行政部', '技术部', '财务部', '市场部', '人力资源部'];
  const deviceTypes: DeviceType[] = ['air_conditioner', 'elevator', 'printer', 'projector'];
  const deviceNames: Record<string, string[]> = {
    air_conditioner: ['中央空调A1', '中央空调B2', '中央空调C3', '分体空调D4'],
    elevator: ['客梯1号', '货梯3号', '客梯2号', '观光梯4号', '消防梯5号'],
    printer: ['激光打印机A', '彩色打印机B', '多功能一体机C'],
    projector: ['会议室投影1', '培训室投影2', '展厅投影3']
  };
  const departmentsByDevice: Record<string, string> = {
    '中央空调A1': '行政部',
    '中央空调B2': '技术部',
    '中央空调C3': '财务部',
    '分体空调D4': '市场部',
    '客梯1号': '行政部',
    '货梯3号': '技术部',
    '客梯2号': '市场部',
    '观光梯4号': '人力资源部',
    '消防梯5号': '行政部',
    '激光打印机A': '技术部',
    '彩色打印机B': '市场部',
    '多功能一体机C': '财务部',
    '会议室投影1': '行政部',
    '培训室投影2': '人力资源部',
    '展厅投影3': '市场部'
  };
  
  const records: CostRecord[] = [];
  let id = 1;
  
  months.forEach((month, monthIndex) => {
    Object.entries(deviceNames).forEach(([type, names]) => {
      names.forEach((deviceName) => {
        const department = departmentsByDevice[deviceName];
        const baseAmount = type === 'elevator' ? 8000 : type === 'air_conditioner' ? 3000 : type === 'projector' ? 1500 : 800;
        const variation = 0.7 + Math.random() * 0.6;
        const total = Math.round(baseAmount * variation * (1 + monthIndex * 0.03));
        
        const parts = Math.round(total * (0.35 + Math.random() * 0.15));
        const labor = Math.round(total * (0.45 + Math.random() * 0.1));
        const outsourcing = total - parts - labor;
        
        records.push({
          id: `C${id.toString().padStart(4, '0')}`,
          month,
          total,
          breakdown: { parts, labor, outsourcing },
          department,
          deviceType: type as DeviceType,
          deviceName
        });
        id++;
      });
    });
  });
  
  return records;
};

export const costRecords: CostRecord[] = generateCostRecords();
