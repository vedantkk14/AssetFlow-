import {
  AdminDashboardData,
  AssetManagerDashboardData,
  DepartmentHeadDashboardData,
  EmployeeDashboardData,
  Activity,
  Notification
} from './dashboard.types';

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'allocation',
    title: 'Asset Allocated',
    description: 'Laptop Dell Latitude #AF-0431 allocated to Priya Sharma (IT Dev)',
    time: '10 minutes ago',
  },
  {
    id: '2',
    type: 'maintenance',
    title: 'Maintenance Request',
    description: 'Rahul Verma requested maintenance for Projector #AF-0112 in Conf Room B',
    time: '1 hour ago',
  },
  {
    id: '3',
    type: 'booking',
    title: 'Resource Booked',
    description: 'Conference Room Alpha booked by Amit Patel for 3:00 PM - 4:30 PM today',
    time: '2 hours ago',
  },
  {
    id: '4',
    type: 'audit',
    title: 'Audit Cycle Started',
    description: 'Annual IT Equipment Audit cycle initiated by Super Admin',
    time: 'Yesterday',
  },
  {
    id: '5',
    type: 'transfer',
    title: 'Transfer Requested',
    description: 'Neha Sen requested transfer of Tablet #AF-0891 to Sales Department',
    time: '2 days ago',
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Asset Overdue Return',
    description: 'Vehicle Honda Civic #AF-0099 is overdue for return by 2 hours.',
    type: 'danger',
    read: false,
    time: '5m ago',
  },
  {
    id: 'n2',
    title: 'Maintenance Approved',
    description: 'Your request for iMac #AF-0120 has been approved. A technician has been assigned.',
    type: 'info',
    read: false,
    time: '30m ago',
  },
  {
    id: 'n3',
    title: 'New Booking Confirmed',
    description: 'Meeting Room 2 booking confirmed for tomorrow 10:00 AM.',
    type: 'success',
    read: true,
    time: '1h ago',
  },
  {
    id: 'n4',
    title: 'Audit Discrepancy Alert',
    description: 'Auditor flagged Asset #AF-0250 (Printer) as "Damaged".',
    type: 'warning',
    read: true,
    time: '1 day ago',
  },
];

export class DashboardService {
  static getAdminDashboard(): AdminDashboardData {
    return {
      stats: [
        {
          title: 'Total Departments',
          value: 8,
          change: '+1 this quarter',
          changeType: 'up',
          icon: 'Building2',
        },
        {
          title: 'Total Employees',
          value: 248,
          change: '+12 new joins this month',
          changeType: 'up',
          icon: 'Users',
        },
        {
          title: 'Active Audits',
          value: 2,
          change: 'Ends in 5 days',
          changeType: 'neutral',
          icon: 'ClipboardCheck',
        },
        {
          title: 'Pending Approvals',
          value: 14,
          change: '-4 since yesterday',
          changeType: 'up', // 'up' in performance context (fewer pending)
          icon: 'FileClock',
        },
      ],
      recentActivity: mockActivities,
      recentNotifications: mockNotifications,
      departmentUtilization: [
        { name: 'Engineering', value: 85 },
        { name: 'Marketing', value: 64 },
        { name: 'Sales', value: 78 },
        { name: 'Operations', value: 92 },
        { name: 'HR', value: 50 },
        { name: 'Finance', value: 70 },
      ],
      maintenanceStats: [
        { name: 'Jan', value: 5 },
        { name: 'Feb', value: 8 },
        { name: 'Mar', value: 12 },
        { name: 'Apr', value: 10 },
        { name: 'May', value: 15 },
        { name: 'Jun', value: 9 },
      ],
    };
  }

  static getAssetManagerDashboard(): AssetManagerDashboardData {
    return {
      stats: [
        {
          title: 'Available Assets',
          value: 184,
          change: '32% of total assets',
          changeType: 'neutral',
          icon: 'CheckCircle2',
        },
        {
          title: 'Allocated Assets',
          value: 342,
          change: '+14 this week',
          changeType: 'up',
          icon: 'UserCheck',
        },
        {
          title: 'Under Maintenance',
          value: 12,
          change: '-3 resolved today',
          changeType: 'up',
          icon: 'Wrench',
        },
        {
          title: 'Near Retirement',
          value: 7,
          change: 'Action required',
          changeType: 'down',
          icon: 'AlertTriangle',
        },
      ],
      recentActivity: mockActivities.filter(a => ['allocation', 'transfer', 'maintenance'].includes(a.type)),
      recentNotifications: mockNotifications.filter(n => ['n1', 'n2', 'n4'].includes(n.id)),
      assetStatusDistribution: [
        { name: 'Available', value: 184 },
        { name: 'Allocated', value: 342 },
        { name: 'Under Maintenance', value: 12 },
        { name: 'Retired/Disposed', value: 24 },
      ],
      maintenanceByStatus: [
        { name: 'Requested', value: 4 },
        { name: 'Approved', value: 2 },
        { name: 'In Progress', value: 5 },
        { name: 'Resolved', value: 25 },
      ],
    };
  }

  static getDepartmentHeadDashboard(): DepartmentHeadDashboardData {
    return {
      stats: [
        {
          title: 'Department Assets',
          value: 74,
          change: '+2 this month',
          changeType: 'up',
          icon: 'Laptop',
        },
        {
          title: 'Active Bookings',
          value: 5,
          change: 'Today',
          changeType: 'neutral',
          icon: 'Calendar',
        },
        {
          title: 'Allocation Requests',
          value: 3,
          change: 'Awaiting your review',
          changeType: 'neutral',
          icon: 'FileQuestion',
        },
        {
          title: 'Overdue Returns',
          value: 1,
          change: 'Action required',
          changeType: 'down',
          icon: 'Clock',
        },
      ],
      recentActivity: mockActivities.filter(a => ['allocation', 'booking'].includes(a.type)),
      recentNotifications: mockNotifications.filter(n => ['n1', 'n3'].includes(n.id)),
      bookingHeatmap: [
        { name: 'Conf Room A', bookings: 12 },
        { name: 'Conf Room B', bookings: 18 },
        { name: 'Projector #1', bookings: 8 },
        { name: 'Company Van', bookings: 14 },
        { name: 'Meeting Pod 1', bookings: 22 },
      ],
    };
  }

  static getEmployeeDashboard(): EmployeeDashboardData {
    return {
      stats: [
        {
          title: 'My Assigned Assets',
          value: 3,
          change: 'Dell Laptop, Headset, Monitor',
          changeType: 'neutral',
          icon: 'Laptop',
        },
        {
          title: 'Active Bookings',
          value: 2,
          change: 'Next: Conf Room B at 2 PM',
          changeType: 'neutral',
          icon: 'CalendarDays',
        },
        {
          title: 'Open Maintenance',
          value: 1,
          change: 'iMac screen issue (Assigned)',
          changeType: 'neutral',
          icon: 'Hammer',
        },
        {
          title: 'Recent Notifications',
          value: 2,
          change: 'Unread alerts',
          changeType: 'neutral',
          icon: 'BellRing',
        },
      ],
      recentActivity: mockActivities.filter(a => ['booking', 'maintenance'].includes(a.type)),
      recentNotifications: mockNotifications.filter(n => ['n2', 'n3'].includes(n.id)),
    };
  }
}

