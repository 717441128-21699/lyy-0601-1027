export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatShortDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  });
};

export const getWeekDay = (dateStr: string): string => {
  const date = new Date(dateStr);
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days[date.getDay()];
};

export const isOverdue = (dateStr: string): boolean => {
  return new Date(dateStr) < new Date();
};

export const getDaysUntil = (dateStr: string): number => {
  const today = new Date();
  const target = new Date(dateStr);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getTrendColor = (trend: number): string => {
  if (trend > 0) return '#00c48c';
  if (trend < 0) return '#ff4d4f';
  return '#8c8c8c';
};

export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  switch (priority) {
    case 'high': return '#ff4d4f';
    case 'medium': return '#faad14';
    case 'low': return '#00c48c';
  }
};

export const getPriorityLabel = (priority: 'low' | 'medium' | 'high'): string => {
  switch (priority) {
    case 'high': return '高';
    case 'medium': return '中';
    case 'low': return '低';
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const getDateRange = (range: string): { start: string; end: string } => {
  const today = new Date('2026-06-10');
  const start = new Date(today);
  
  const daysMap: Record<string, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    'year': 365
  };
  
  const days = daysMap[range] || 30;
  start.setDate(today.getDate() - days);
  
  const format = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return {
    start: format(start),
    end: format(today)
  };
};

export const isDateInRange = (dateStr: string, range: string): boolean => {
  const { start, end } = getDateRange(range);
  return dateStr >= start && dateStr <= end;
};

export const getMonthRange = (range: string): string[] => {
  const months = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
  const rangeMap: Record<string, number> = {
    '7d': 1,
    '30d': 3,
    '90d': 6,
    'year': 12
  };
  const count = rangeMap[range] || 6;
  return months.slice(-count);
};
