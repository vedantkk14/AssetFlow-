export interface Activity {
  id: string;
  type: 'allocation' | 'transfer' | 'maintenance' | 'booking' | 'audit' | 'system';
  title: string;
  description: string;
  time: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  read: boolean;
  time: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface KpiCardData {
  title: string;
  value: number;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface AdminDashboardData {
  stats: KpiCardData[];
  recentActivity: Activity[];
  recentNotifications: Notification[];
  departmentUtilization: ChartDataPoint[];
  maintenanceStats: ChartDataPoint[];
}

export interface AssetManagerDashboardData {
  stats: KpiCardData[];
  recentActivity: Activity[];
  recentNotifications: Notification[];
  assetStatusDistribution: ChartDataPoint[];
  maintenanceByStatus: ChartDataPoint[];
}

export interface DepartmentHeadDashboardData {
  stats: KpiCardData[];
  recentActivity: Activity[];
  recentNotifications: Notification[];
  bookingHeatmap: { name: string; bookings: number }[];
}

export interface EmployeeDashboardData {
  stats: KpiCardData[];
  recentActivity: Activity[];
  recentNotifications: Notification[];
}

