import { useState, useRef, useEffect } from 'react';
import { Building2, Cpu, Clock, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssetStore } from '../../store/useAssetStore';
import { DEPARTMENTS, DEVICE_TYPE_LABELS } from '../../types';
import type { DeviceType, TimeRange } from '../../types';
import { cn } from '../../utils/helpers';

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '7d', label: '近7天' },
  { value: '30d', label: '近30天' },
  { value: '90d', label: '近90天' },
  { value: 'year', label: '全年' },
];

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  icon: typeof Building2;
}

const Dropdown = ({ label, value, options, onChange, icon: Icon }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300",
          isOpen 
            ? "bg-accent-primary/20 border-accent-primary/50 text-accent-primary" 
            : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
        )}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}:</span>
        <span className="text-sm font-medium">{selectedOption?.label || value}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-48 bg-bg-tertiary border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors",
                  value === option.value 
                    ? "bg-accent-primary/20 text-accent-primary" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {option.label}
                {value === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MultiSelect = ({ 
  label, 
  values, 
  options, 
  onChange, 
  icon: Icon 
}: { 
  label: string; 
  values: DeviceType[]; 
  options: { value: DeviceType; label: string }[]; 
  onChange: (values: DeviceType[]) => void;
  icon: typeof Cpu;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: DeviceType) => {
    if (values.includes(value)) {
      onChange(values.filter(v => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300",
          isOpen 
            ? "bg-accent-primary/20 border-accent-primary/50 text-accent-primary" 
            : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
        )}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}:</span>
        <span className="text-sm font-medium">
          {values.length === 0 ? '全部' : `已选 ${values.length} 项`}
        </span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-48 bg-bg-tertiary border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="p-2">
              <button
                onClick={() => onChange([])}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm rounded transition-colors",
                  values.length === 0 
                    ? "bg-accent-primary/20 text-accent-primary" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                全部
              </button>
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm rounded flex items-center justify-between transition-colors",
                    values.includes(option.value) 
                      ? "bg-accent-primary/20 text-accent-primary" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {option.label}
                  {values.includes(option.value) && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterBar = () => {
  const { filters, setDepartment, setAssetTypes, setTimeRange } = useAssetStore();

  const departmentOptions = DEPARTMENTS.map(d => ({ value: d, label: d }));
  const assetTypeOptions = Object.entries(DEVICE_TYPE_LABELS).map(([value, label]) => ({ 
    value: value as DeviceType, 
    label 
  }));

  return (
    <div className="bg-bg-secondary/30 backdrop-blur-sm border-b border-white/5 px-6 py-3">
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/50">筛选条件：</span>
        
        <Dropdown
          label="部门"
          value={filters.department}
          options={departmentOptions}
          onChange={setDepartment}
          icon={Building2}
        />
        
        <MultiSelect
          label="资产类别"
          values={filters.assetTypes}
          options={assetTypeOptions}
          onChange={setAssetTypes}
          icon={Cpu}
        />
        
        <Dropdown
          label="时间范围"
          value={filters.timeRange}
          options={timeRanges}
          onChange={(v) => setTimeRange(v as TimeRange)}
          icon={Clock}
        />
      </div>
    </div>
  );
};

export default FilterBar;
