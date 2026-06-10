import type { AssetStats, Device, MaintenanceTask, FaultRecord, CostRecord, SupplierData, DeviceType, FaultHistoryItem, FaultStatus } from '../types';

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

  const departmentByFloor: Record<number, string[]> = {
    1: ['行政部', '行政部', '人力资源部', '行政部', '技术部', '行政部', '财务部', '市场部'],
    2: ['技术部', '技术部', '技术部', '市场部', '技术部', '行政部', '技术部', '财务部'],
    3: ['财务部', '财务部', '行政部', '财务部', '市场部', '财务部', '技术部', '人力资源部'],
    4: ['市场部', '市场部', '人力资源部', '市场部', '财务部', '市场部', '技术部', '行政部'],
    5: ['人力资源部', '人力资源部', '行政部', '技术部', '人力资源部', '财务部', '市场部', '行政部']
  };

  let id = 1;
  for (let floor = 1; floor <= 5; floor++) {
    const positions = floorPositions[floor] || [];
    const deptAlloc = departmentByFloor[floor] || [];
    for (let i = 0; i < positions.length; i++) {
      const type = types[i % types.length];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const pos = positions[i];
      const department = deptAlloc[i % deptAlloc.length];
      
      devices.push({
        id: `DEV-${String(id++).padStart(4, '0')}`,
        name: `${floor}楼-${deviceNames[type][i % deviceNames[type].length]}`,
        type,
        floor,
        position: pos,
        status,
        lastMaintenance: `2026-${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        nextMaintenance: `2026-${String(Math.floor(Math.random() * 6) + 6).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        department,
        brand: brands[Math.floor(Math.random() * brands.length)],
        model: models[Math.floor(Math.random() * models.length)],
        installDate: `202${Math.floor(Math.random() * 4) + 1}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      });
    }
  }
  return devices;
};

export const devices: Device[] = generateDevices();

const generateMaintenanceTasks = (devices: Device[]): MaintenanceTask[] => {
  const tasks: MaintenanceTask[] = [];
  const assignees = [
    { name: '张工', avatar: 'Z' },
    { name: '李工', avatar: 'L' },
    { name: '王工', avatar: 'W' },
    { name: '赵工', avatar: 'Z' }
  ];
  const taskTypes = ['季度维保', '月度检查', '耗材更换', '故障报修', '清洗保养', '年度检测', '灯泡更换', '加氟保养'];
  const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const statuses: ('pending' | 'in_progress' | 'completed')[] = ['pending', 'in_progress', 'completed'];
  
  const dates = [
    '2026-06-10', '2026-06-10', '2026-06-10', '2026-06-11', '2026-06-11',
    '2026-06-12', '2026-06-12', '2026-06-13', '2026-06-13', '2026-06-14',
    '2026-06-14', '2026-06-15', '2026-06-15', '2026-06-16', '2026-06-16'
  ];
  
  let taskId = 1;
  devices.forEach((device, index) => {
    if (index % 2 === 0) {
      const dateIndex = index % dates.length;
      const assignee = assignees[index % assignees.length];
      const taskType = taskTypes[index % taskTypes.length];
      const priority = priorities[index % priorities.length];
      const status = statuses[index % statuses.length];
      const progress = status === 'completed' ? 100 : status === 'in_progress' ? Math.floor(Math.random() * 80) + 10 : 0;
      
      tasks.push({
        id: `T${String(taskId++).padStart(3, '0')}`,
        date: dates[dateIndex],
        deviceId: device.id,
        deviceName: device.name,
        deviceType: device.type,
        deviceFloor: device.floor,
        type: taskType,
        assignee: assignee.name,
        assigneeAvatar: assignee.avatar,
        progress,
        status,
        priority
      });
    }
  });
  
  return tasks;
};

export const maintenanceTasks: MaintenanceTask[] = generateMaintenanceTasks(devices);

const generateFaultHistory = (device: Device, count: number, supplier: string): FaultHistoryItem[] => {
  const history: FaultHistoryItem[] = [];
  const assignees = ['张工', '李工', '王工', '赵工'];
  const faultDescriptions = [
    '设备无法启动，电源指示灯不亮',
    '运行时有异常噪音，振动明显',
    '显示面板报错，错误代码E101',
    '制冷/制热效果下降，温度控制不准',
    '按键失灵，操作无响应',
    '连接故障，无法与中控系统通信',
    '耗材用尽，需要更换',
    '传感器数据异常，读数不准'
  ];
  const resolutions = [
    '更换主板组件，系统恢复正常',
    '清洁散热风扇，添加润滑油',
    '更换损坏传感器，重新校准',
    '重新安装驱动程序，配置参数',
    '更换滤芯/耗材，运行自检程序',
    '修复接线端子，重新连接线缆',
    '升级固件版本，优化运行参数',
    '更换易损件，进行全面保养'
  ];
  const statuses: FaultStatus[] = ['reported', 'in_progress', 'resolved', 'closed'];
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90) + 5;
    const date = new Date('2026-06-10');
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];
    
    const status = i === 0 && device.status === 'fault' ? 'in_progress' : statuses[Math.floor(Math.random() * 2) + 2];
    const responseTime = Math.round((Math.random() * 8 + 1) * 10) / 10;
    const repairTime = Math.round((Math.random() * 24 + 2) * 10) / 10;
    const cost = Math.floor(Math.random() * 8000) + 1000;
    
    history.push({
      id: `${device.id}-H${String(i + 1).padStart(2, '0')}`,
      date: dateStr,
      description: faultDescriptions[Math.floor(Math.random() * faultDescriptions.length)],
      status,
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      supplier,
      responseTime,
      repairTime,
      cost,
      resolution: resolutions[Math.floor(Math.random() * resolutions.length)]
    });
  }
  
  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateFaultRecords = (devices: Device[]): FaultRecord[] => {
  const faults: FaultRecord[] = [];
  const suppliers = ['格力售后', '日立电梯', '惠普金牌', '索尼维修', '美的售后', '东芝电梯', '佳能快修', '爱普生服务'];
  
  const faultDevices = devices.filter(d => d.status === 'fault' || d.status === 'pending');
  
  faultDevices.forEach((device, index) => {
    const faultCount = Math.floor(Math.random() * 12) + 3;
    const supplier = suppliers[index % suppliers.length];
    const history = generateFaultHistory(device, faultCount, supplier);
    const totalCost = history.reduce((sum, h) => sum + h.cost, 0);
    const avgRepairTime = history.length > 0 
      ? Math.round(history.reduce((sum, h) => sum + h.repairTime, 0) / history.length * 10) / 10 
      : 0;
    const lastFault = history.length > 0 ? history[0].date : '2026-05-15';
    
    faults.push({
      id: `F${String(index + 1).padStart(3, '0')}`,
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type,
      deviceFloor: device.floor,
      faultCount,
      avgRepairTime,
      lastFault,
      supplier,
      cost: totalCost,
      history
    });
  });
  
  return faults.sort((a, b) => b.faultCount - a.faultCount);
};

export const faultRecords: FaultRecord[] = generateFaultRecords(devices);

export const supplierData: SupplierData[] = [
  { name: '格力售后', responseTime: 85, repairRate: 92, satisfaction: 88, cost: 75, coverage: 90 },
  { name: '日立电梯', responseTime: 78, repairRate: 95, satisfaction: 85, cost: 82, coverage: 85 },
  { name: '惠普金牌', responseTime: 90, repairRate: 88, satisfaction: 92, cost: 68, coverage: 88 },
  { name: '索尼维修', responseTime: 72, repairRate: 85, satisfaction: 80, cost: 78, coverage: 75 },
];

const generateCostRecords = (devices: Device[]): CostRecord[] => {
  const months = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
  
  const records: CostRecord[] = [];
  let id = 1;
  
  months.forEach((month, monthIndex) => {
    devices.forEach((device) => {
      const baseAmount = device.type === 'elevator' ? 8000 : device.type === 'air_conditioner' ? 3000 : device.type === 'projector' ? 1500 : 800;
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
        department: device.department,
        deviceType: device.type,
        deviceId: device.id,
        deviceName: device.name
      });
      id++;
    });
  });
  
  return records;
};

export const costRecords: CostRecord[] = generateCostRecords(devices);
