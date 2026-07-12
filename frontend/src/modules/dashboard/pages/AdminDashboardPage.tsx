import { useAdminDashboard } from '../api/dashboard.api';
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
  LineChart,
  Line,
} from 'recharts';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Admin Dashboard"
          description={`Welcome back, ${user?.name || 'Admin'}! Loading your dashboard...`}
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
        title="Admin Dashboard"
        description={`Welcome back, ${user?.name || 'Admin'}! Here is an overview of the organization.`}
      />

      {/* KPI Stats Grid */}
      <StatsGrid stats={data.stats} />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Department Asset Allocation</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Number of active assets assigned per department</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentUtilization} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="value" fill="oklch(0.439 0 0)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Maintenance Request History</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Volume of maintenance requests filed over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.maintenanceStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Line type="monotone" dataKey="value" stroke="oklch(0.205 0 0)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activities and Actions Panel */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RecentActivity activities={data.recentActivity} />
        </div>
        <div className="space-y-6">
          <QuickActions role="ADMIN" />
          <NotificationPanel notifications={data.recentNotifications} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

