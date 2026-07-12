import { useDepartmentDashboard } from '../api/dashboard.api';
import { SectionHeader } from '../components/SectionHeader';
import { StatsGrid } from '../components/StatsGrid';
import { QuickActions } from '../components/QuickActions';
import { RecentActivity } from '../components/RecentActivity';
import { NotificationPanel } from '../components/NotificationPanel';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const DepartmentHeadDashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useDepartmentDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Department Dashboard"
          description={`Welcome back, ${user?.name || 'Department Head'}! Loading your dashboard...`}
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
        title="Department Dashboard"
        description={`Welcome back, ${user?.name || 'Department Head'}! Overview of department assets and bookings.`}
      />

      {/* KPI Stats Grid */}
      <StatsGrid stats={data.stats} />

      {/* Booking Heatmap chart */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Resource Booking Frequency</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Total booking requests per shared room or equipment</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bookingHeatmap} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--popover-foreground)',
                  }}
                />
                <Bar dataKey="bookings" fill="oklch(0.269 0 0)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <QuickActions role="DEPARTMENT_HEAD" />
        </div>
      </div>

      {/* Activities and Notifications */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RecentActivity activities={data.recentActivity} />
        </div>
        <div>
          <NotificationPanel notifications={data.recentNotifications} />
        </div>
      </div>
    </div>
  );
};

export default DepartmentHeadDashboardPage;

