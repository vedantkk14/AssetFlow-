import { useAssetManagerDashboard } from '../hooks/useDashboard';
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const AssetManagerDashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useAssetManagerDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Asset Manager Dashboard"
          description={`Welcome back, ${user?.name || 'Asset Manager'}! Loading your dashboard...`}
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

  const PIE_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Asset Manager Dashboard"
        description={`Welcome back, ${user?.name || 'Asset Manager'}! Manage your asset lifecycle here.`}
      />

      {/* KPI Stats Grid */}
      <StatsGrid stats={data.stats} />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Asset Status Distribution</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Proportion of physical assets by status</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.assetStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.assetStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--popover-foreground)',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Maintenance by Ticket Status</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Distribution of active and resolved maintenance tickets</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.maintenanceByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="value" fill="oklch(0.556 0 0)" radius={[4, 4, 0, 0]} />
              </BarChart>
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
          <QuickActions role="ASSET_MANAGER" />
          <NotificationPanel notifications={data.recentNotifications} />
        </div>
      </div>
    </div>
  );
};

export default AssetManagerDashboardPage;

