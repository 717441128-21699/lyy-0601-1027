import { create } from 'zustand';
import type { AssetStats, Device, MaintenanceTask, FaultRecord, CostRecord, SupplierData, Filters, ViewType, DeviceType, TimeRange } from '../types';
import { assetStats as initialStats, devices as initialDevices, maintenanceTasks as initialTasks, faultRecords as initialFaults, costRecords as initialCosts, supplierData as initialSuppliers } from '../data/mockData';

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
  
  setCurrentView: (view: ViewType) => void;
  setSelectedFloor: (floor: number) => void;
  setSelectedDevice: (device: Device | null) => void;
  setDepartment: (department: string) => void;
  setAssetTypes: (types: DeviceType[]) => void;
  setTimeRange: (range: TimeRange) => void;
  toggleFullscreen: () => void;
  loadDemoData: () => void;
  resetData: () => void;
}

const initialFilters: Filters = {
  department: '全部部门',
  assetTypes: [],
  timeRange: '30d'
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
    isDemoDataLoaded: true
  })
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
  const { maintenanceTasks, filters } = useAssetStore();
  return maintenanceTasks.filter(task => {
    if (filters.assetTypes.length > 0 && !filters.assetTypes.includes(task.deviceType)) {
      return false;
    }
    return true;
  });
};

export const useFilteredFaults = () => {
  const { faultRecords, filters } = useAssetStore();
  return faultRecords.filter(fault => {
    if (filters.assetTypes.length > 0 && !filters.assetTypes.includes(fault.deviceType)) {
      return false;
    }
    return true;
  });
};

export const useFilteredCosts = () => {
  const { costRecords, filters } = useAssetStore();
  const rangeMap: Record<string, number> = {
    '7d': 1,
    '30d': 3,
    '90d': 6,
    'year': 12
  };
  const months = rangeMap[filters.timeRange] || 6;
  return costRecords.slice(-months);
};
