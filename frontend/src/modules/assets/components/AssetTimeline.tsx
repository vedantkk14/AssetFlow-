import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, UserCheck, Wrench, ShieldCheck, UserMinus, Plus } from 'lucide-react';
import { Asset } from '../types/assets.types';

interface AssetTimelineProps {
  asset: Asset;
}

export const AssetTimeline = ({ asset }: AssetTimelineProps) => {
  // High-fidelity mock allocation history based on the asset details
  const mockAllocations = [
    {
      id: 'a1',
      employeeName: 'Priya Sharma',
      department: 'IT Support',
      allocatedBy: 'Super Admin',
      allocatedDate: '2026-06-10',
      expectedReturnDate: '2027-06-10',
      status: asset.status === 'ALLOCATED' ? 'ACTIVE' : 'RETURNED',
      actualReturnDate: asset.status === 'ALLOCATED' ? null : '2026-07-01',
    },
    {
      id: 'a2',
      employeeName: 'Rahul Verma',
      department: 'Sales & Marketing',
      allocatedBy: 'Super Admin',
      allocatedDate: '2025-06-01',
      expectedReturnDate: '2026-06-01',
      status: 'RETURNED',
      actualReturnDate: '2026-06-01',
    },
  ];

  // High-fidelity mock maintenance logs
  const mockMaintenance = [
    {
      id: 'm1',
      title: 'Operating System Reinstallation',
      description: 'Slow performance reported. OS reinstalled and security updates applied.',
      cost: 0,
      status: 'RESOLVED',
      technician: 'Vikram Singh (IT Analyst)',
      date: '2026-04-12',
    },
    {
      id: 'm2',
      title: 'RAM Upgrade (8GB to 16GB)',
      description: 'Upgraded system memory for software development requirements.',
      cost: 75.0,
      status: 'RESOLVED',
      technician: 'Vikram Singh (IT Analyst)',
      date: '2025-09-18',
    },
  ];

  // High-fidelity mock audits
  const mockAudits = [
    {
      id: 'au1',
      cycleName: 'Annual Asset Verification 2026',
      auditor: 'Auditor Rohit Mehta',
      condition: 'GOOD',
      verificationDate: '2026-05-15',
      status: 'VERIFIED',
      notes: 'Asset physically verified at location. Serial number matches records.',
    },
    {
      id: 'au2',
      cycleName: 'Mid-Year Equipment Audit 2025',
      auditor: 'Auditor Sneha Rao',
      condition: 'GOOD',
      verificationDate: '2025-11-20',
      status: 'VERIFIED',
      notes: 'Verified in cabinet. Excellent condition.',
    },
  ];

  return (
    <Card className="border border-border shadow-xs">
      <CardContent className="p-5">
        <Tabs defaultValue="allocations">
          <TabsList className="border-b border-border w-full justify-start pb-0 h-10 gap-6">
            <TabsTrigger value="allocations" className="gap-2 pb-2 text-xs font-semibold uppercase">
              <UserCheck className="h-4 w-4" />
              <span>Allocations</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="gap-2 pb-2 text-xs font-semibold uppercase">
              <Wrench className="h-4 w-4" />
              <span>Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="audits" className="gap-2 pb-2 text-xs font-semibold uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>Audits</span>
            </TabsTrigger>
          </TabsList>

          {/* Allocation History Panel */}
          <TabsContent value="allocations" className="pt-4 space-y-4">
            <div className="relative pl-6 border-l border-border space-y-6">
              {/* If allocated, show current allocation first */}
              {mockAllocations.map((alloc) => (
                <div key={alloc.id} className="relative group">
                  <span className={`absolute -left-[37px] top-0.5 p-1.5 rounded-full ring-4 ring-background ${
                    alloc.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {alloc.status === 'ACTIVE' ? <UserCheck className="h-3 w-3" /> : <UserMinus className="h-3 w-3" />}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {alloc.status === 'ACTIVE' ? 'Active Assignment' : 'Returned Assignment'}
                      </span>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full border ${
                        alloc.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-900/50'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {alloc.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Assigned to <span className="font-semibold text-foreground">{alloc.employeeName}</span> ({alloc.department})
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                      <span>Issued: {alloc.allocatedDate} by {alloc.allocatedBy}</span>
                      {alloc.actualReturnDate ? (
                        <span>Returned: {alloc.actualReturnDate}</span>
                      ) : (
                        <span>Expected Return: {alloc.expectedReturnDate}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Initial Registration log */}
              <div className="relative group">
                <span className="absolute -left-[37px] top-0.5 p-1.5 rounded-full ring-4 ring-background bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                  <Plus className="h-3 w-3" />
                </span>
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground">Asset Registered</span>
                  <p className="text-xs text-muted-foreground">Registered in inventory database by Admin.</p>
                  <span className="text-[10px] text-muted-foreground block">{asset.createdAt ? asset.createdAt.split('T')[0] : 'N/A'}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Maintenance Logs Panel */}
          <TabsContent value="maintenance" className="pt-4">
            {mockMaintenance.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">No maintenance records found for this asset.</div>
            ) : (
              <div className="relative pl-6 border-l border-border space-y-6">
                {mockMaintenance.map((maint) => (
                  <div key={maint.id} className="relative group">
                    <span className="absolute -left-[37px] top-0.5 p-1.5 rounded-full ring-4 ring-background bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
                      <Wrench className="h-3 w-3" />
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{maint.title}</span>
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/10">
                          {maint.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{maint.description}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                        <span>Resolved Date: {maint.date}</span>
                        <span>Tech: {maint.technician}</span>
                        {maint.cost > 0 && <span className="font-semibold text-foreground">Cost: ${maint.cost.toFixed(2)}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Audit Logs Panel */}
          <TabsContent value="audits" className="pt-4">
            {mockAudits.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">No audit checks performed on this asset.</div>
            ) : (
              <div className="relative pl-6 border-l border-border space-y-6">
                {mockAudits.map((audit) => (
                  <div key={audit.id} className="relative group">
                    <span className="absolute -left-[37px] top-0.5 p-1.5 rounded-full ring-4 ring-background bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400">
                      <ShieldCheck className="h-3 w-3" />
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{audit.cycleName}</span>
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full border bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/10">
                          {audit.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{audit.notes}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                        <span>Date: {audit.verificationDate}</span>
                        <span>Audited By: {audit.auditor}</span>
                        <span>Condition Flag: <span className="font-semibold text-foreground">{audit.condition}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssetTimeline;
