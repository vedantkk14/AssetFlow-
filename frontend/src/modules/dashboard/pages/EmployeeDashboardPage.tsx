import { useEmployeeDashboard } from '../api/dashboard.api';
import { SectionHeader } from '../components/SectionHeader';
import { StatsGrid } from '../components/StatsGrid';
import { QuickActions } from '../components/QuickActions';
import { RecentActivity } from '../components/RecentActivity';
import { NotificationPanel } from '../components/NotificationPanel';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useAuth } from '@/hooks/useAuth';

const EmployeeDashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useEmployeeDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Employee Dashboard"
          description={`Welcome back, ${user?.name || 'Employee'}! Loading your dashboard...`}
        />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h3 className="text-lg font-semibold text-rose-600">Error loading dashboard</h3>
        <p className="text-sm text-muted-foreground mt-1">Please try again later or verify your backend connection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Employee Dashboard"
        description={`Welcome back, ${user?.name || 'Employee'}! Request resources, report maintenance, or view your assigned assets.`}
      />

      {/* KPI Stats Grid */}
      <StatsGrid stats={data.stats} />

      {/* Activities and Actions Panel */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RecentActivity activities={data.recentActivity} />
        </div>
        <div className="space-y-6">
          <QuickActions role="EMPLOYEE" />
          <NotificationPanel notifications={data.recentNotifications} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardPage;

