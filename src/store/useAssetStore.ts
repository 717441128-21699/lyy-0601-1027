import { useMemo } from 'react';
import { create } from 'zustand';
import type { AssetStats, Device, MaintenanceTask, FaultRecord, CostRecord, SupplierData, Filters, ViewType, DeviceType, TimeRange } from '../types';
import { assetStats as initialStats, devices as initialDevices, maintenanceTasks as initialTasks, faultRecords as initialFaults, costRecords as initialCosts, supplierData as initialSuppliers } from '../data/mockData';
import { isOverdue, getDaysUntil, getDateRange, getMonthRange } from '../utils/helpers';

interface CarouselState {
  enabled: boolean;
  paused: boolean;
  interval: number;
}

interface AssetState {
  assetStats: AssetStats;
  devices: Device[];
  maintenanceTasks: MaintenanceTask[];
  faultRecords: FaultRecord[];
  costRecords: CostRecord[];
  supplierData: SupplierData[];
  filters: Filters;
  currentView: ViewType;
  selectedFloor: number;
  selectedDevice: Device | null;
  isFullscreen: boolean;
  isDemoDataLoaded: boolean;
  carousel: CarouselState;
  
  setCurrentView: (view: ViewType) => void;
  setSelectedFloor: (floor: number) => void;
  setSelectedDevice: (device: Device | null) => void;
  setDepartment: (department: string) => void;
  setAssetTypes: (types: DeviceType[]) => void;
  setTimeRange: (range: TimeRange) => void;
  toggleFullscreen: () => void;
  loadDemoData: () => void;
  resetData: () => void;
  setCarouselEnabled: (enabled: boolean) => void;
  setCarouselPaused: (paused: boolean) => void;
  setCarouselInterval: (interval: number) => void;
}

const initialFilters: Filters = {
  department: '全部部门',
  assetTypes: [],
  timeRange: '30d'
};

const initialCarousel: CarouselState = {
  enabled: false,
  paused: false,
  interval: 10000
};

export const useAssetStore = create<AssetState>((set) => ({
  assetStats: initialStats,
  devices: initialDevices,
  maintenanceTasks: initialTasks,
  faultRecords: initialFaults,
  costRecords: initialCosts,
  supplierData: initialSuppliers,
  filters: initialFilters,
  currentView: 'overview',
  selectedFloor: 1,
  selectedDevice: null,
  isFullscreen: false,
  isDemoDataLoaded: true,
  carousel: initialCarousel,

  setCurrentView: (view) => set({ currentView: view }),
  setSelectedFloor: (floor) => set({ selectedFloor: floor }),
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  setDepartment: (department) => set((state) => ({
    filters: { ...state.filters, department }
  })),
  setAssetTypes: (types) => set((state) => ({
    filters: { ...state.filters, assetTypes: types }
  })),
  setTimeRange: (range) => set((state) => ({
    filters: { ...state.filters, timeRange: range }
  })),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  loadDemoData: () => set({
    assetStats: initialStats,
    devices: initialDevices,
    maintenanceTasks: initialTasks,
    faultRecords: initialFaults,
    costRecords: initialCosts,
    supplierData: initialSuppliers,
    isDemoDataLoaded: true
  }),
  resetData: () => set({
    assetStats: initialStats,
    devices: initialDevices,
    maintenanceTasks: initialTasks,
    faultRecords: initialFaults,
    costRecords: initialCosts,
    supplierData: initialSuppliers,
    filters: initialFilters,
    currentView: 'overview',
    selectedFloor: 1,
    selectedDevice: null,
    isFullscreen: false,
    isDemoDataLoaded: true,
    carousel: initialCarousel
  }),
  setCarouselEnabled: (enabled) => set((state) => ({ carousel: { ...state.carousel, enabled } })),
  setCarouselPaused: (paused) => set((state) => ({ carousel: { ...state.carousel, paused } })),
  setCarouselInterval: (interval) => set((state) => ({ carousel: { ...state.carousel, interval } }))
}));

export const useFilteredDevices = () => {
  const { devices, filters } = useAssetStore();
  return devices.filter(device => {
    if (filters.department !== '全部部门' && device.department !== filters.department) {
      return false;
    }
    if (filters.assetTypes.length > 0 && !filters.assetTypes.includes(device.type)) {
      return false;
    }
    return true;
  });
};

export const useFilteredTasks = () => {
  const { maintenanceTasks, filters, devices } = useAssetStore();
  return maintenanceTasks.filter(task => {
    if (filters.assetTypes.length > 0 && !filters.assetTypes.includes(task.deviceType)) {
      return false;
    }
    if (filters.department !== '全部部门') {
      const device = devices.find(d => d.name === task.deviceName);
      if (device && device.department !== filters.department) {
        return false;
      }
    }
    if (filters.timeRange !== 'year') {
      const { start } = getDateRange(filters.timeRange);
      if (task.date < start) {
        return false;
      }
    }
    return true;
  });
};

export const useFilteredFaults = () => {
  const { faultRecords, filters, devices } = useAssetStore();
  return faultRecords.filter(fault => {
    if (filters.assetTypes.length > 0 && !filters.assetTypes.includes(fault.deviceType)) {
      return false;
    }
    if (filters.department !== '全部部门') {
      const device = devices.find(d => d.name === fault.deviceName);
      if (device && device.department !== filters.department) {
        return false;
      }
    }
    if (filters.timeRange !== 'year') {
      const { start } = getDateRange(filters.timeRange);
      if (fault.lastFault < start) {
        return false;
      }
    }
    return true;
  });
};

export const useFilteredCosts = () => {
  const { costRecords, filters } = useAssetStore();
  const months = getMonthRange(filters.timeRange);
  return costRecords.filter(record => {
    if (!months.includes(record.month)) {
      return false;
    }
    if (filters.department !== '全部部门' && record.department !== filters.department) {
      return false;
    }
    if (filters.assetTypes.length > 0 && !filters.assetTypes.includes(record.deviceType)) {
      return false;
    }
    return true;
  });
};

export const useAggregatedCosts = () => {
  const filteredCosts = useFilteredCosts();
  
  return useMemo(() => {
    const byMonth: Record<string, CostRecord[]> = {};
    const byDepartment: Record<string, CostRecord[]> = {};
    const byType: Record<string, CostRecord[]> = {};
    
    filteredCosts.forEach(record => {
      if (!byMonth[record.month]) byMonth[record.month] = [];
      byMonth[record.month].push(record);
      
      if (!byDepartment[record.department]) byDepartment[record.department] = [];
      byDepartment[record.department].push(record);
      
      if (!byType[record.deviceType]) byType[record.deviceType] = [];
      byType[record.deviceType].push(record);
    });
    
    const aggregate = (records: CostRecord[]): { total: number; breakdown: { parts: number; labor: number; outsourcing: number } } => {
      return records.reduce((acc, r) => ({
        total: acc.total + r.total,
        breakdown: {
          parts: acc.breakdown.parts + r.breakdown.parts,
          labor: acc.breakdown.labor + r.breakdown.labor,
          outsourcing: acc.breakdown.outsourcing + r.breakdown.outsourcing
        }
      }), { total: 0, breakdown: { parts: 0, labor: 0, outsourcing: 0 } });
    };
    
    return {
      byMonth: Object.entries(byMonth).map(([month, records]) => ({ month, ...aggregate(records) })),
      byDepartment: Object.entries(byDepartment).map(([department, records]) => ({ department, ...aggregate(records) })),
      byType: Object.entries(byType).map(([deviceType, records]) => ({ deviceType, ...aggregate(records) })),
      raw: filteredCosts
    };
  }, [filteredCosts]);
};

export const useFilteredAssetStats = () => {
  const devices = useFilteredDevices();
  const tasks = useFilteredTasks();
  
  return {
    total: devices.length,
    inUse: devices.filter(d => d.status === 'normal').length,
    pendingRepair: devices.filter(d => d.status === 'pending').length,
    scrapped: devices.filter(d => d.status === 'scrapped').length,
    overdue: devices.filter(d => isOverdue(d.nextMaintenance)).length,
    trends: {
      total: 0,
      inUse: 0,
      pendingRepair: 0,
      scrapped: 0,
      overdue: 0
    }
  };
};

export const useUpcomingMaintenance = () => {
  const tasks = useFilteredTasks();
  return tasks.filter(t => !isOverdue(t.date) && getDaysUntil(t.date) <= 7);
};
