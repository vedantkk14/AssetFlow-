import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchBar from '@/components/shared/SearchBar';
import { useAuth } from '@/hooks/useAuth';
import AllocationTable from '../components/AllocationTable';
import { useAllocations } from '../hooks/useAllocations';
import type { AllocationStatus } from '../types/allocation.types';

const ALL = '__all__';

const AllocationDashboardPage = () => {
  const { user } = useAuth();
  const canAllocate = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>(ALL);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAllocations({
    page,
    limit: 10,
    search,
    status: status === ALL ? undefined : (status as AllocationStatus),
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Allocation Dashboard</CardTitle>
        {canAllocate && (
          <Link to="/allocation/allocate" className={buttonVariants({ variant: 'default' })}>
            <Plus className="h-4 w-4" />
            Allocate Asset
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by asset or employee..."
          />
          <Select
            value={status}
            onValueChange={(value) => {
              if (!value) return;
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="RETURN_REQUESTED">Return Requested</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
              <SelectItem value="TRANSFER_PENDING">Transfer Pending</SelectItem>
              <SelectItem value="RETURNED">Returned</SelectItem>
              <SelectItem value="TRANSFERRED">Transferred</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AllocationTable
          allocations={data?.items ?? []}
          isLoading={isLoading}
          error={isError ? 'Unable to load allocations.' : null}
          page={data?.page ?? page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
};

export default AllocationDashboardPage;
