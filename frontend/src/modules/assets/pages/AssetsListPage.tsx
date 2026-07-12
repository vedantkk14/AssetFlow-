import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Grid, List, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAssets, useDeleteAsset, useCategories, useDepartments } from '../api/assets.api';
import AssetTable from '../components/AssetTable';
import AssetCard from '../components/AssetCard';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';
import { SectionHeader } from '@/modules/dashboard/components/SectionHeader';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSkeleton from '@/modules/dashboard/components/LoadingSkeleton';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AssetsListPage = () => {
  const { user } = useAuth();
  const getRolePrefix = () => {
    switch (user?.role) {
      case 'ADMIN':
        return '/admin';
      case 'ASSET_MANAGER':
        return '/asset-manager';
      case 'DEPARTMENT_HEAD':
        return '/department';
      case 'EMPLOYEE':
      default:
        return '/employee';
    }
  };

  const rolePrefix = getRolePrefix();
  const canCreate = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';

  // Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [condition, setCondition] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [isBookable, setIsBookable] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Archive Confirmation States
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Dropdowns data
  const { data: categories } = useCategories();
  const { data: departments } = useDepartments();

  // Queries & Mutations
  const { data, isLoading, error, refetch } = useAssets({
    search: search || undefined,
    status: status || undefined,
    condition: condition || undefined,
    categoryId: categoryId || undefined,
    departmentId: departmentId || undefined,
    isBookable: isBookable,
    sortBy,
    sortOrder,
    page,
    limit: 12,
  });

  const deleteAssetMutation = useDeleteAsset();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleArchiveClick = (id: string) => {
    setArchiveId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmArchive = async () => {
    if (archiveId) {
      await deleteAssetMutation.mutateAsync(archiveId);
      setIsConfirmOpen(false);
      setArchiveId(null);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setCondition('');
    setCategoryId('');
    setDepartmentId('');
    setIsBookable(undefined);
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Asset Management" description="Inventory and physical asset directory." />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h3 className="text-lg font-semibold text-rose-600 font-sans">Error loading assets directory</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">Please make sure the database is running and migrated.</p>
        <Button onClick={() => refetch()} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={user?.role === 'EMPLOYEE' ? 'My Assigned Assets' : 'Asset Directory'}
        description={
          user?.role === 'EMPLOYEE'
            ? 'List of physical assets allocated to your account.'
            : 'Register, edit, organize, and track all physical assets.'
        }
        actions={
          canCreate ? (
            <Link to={`${rolePrefix}/assets/new`} className={buttonVariants({ className: 'gap-2 font-medium' })}>
              <PlusCircle className="h-4 w-4" />
              <span>Register Asset</span>
            </Link>
          ) : undefined
        }
      />

      {/* Search and Filters Card */}
      <div className="border border-border rounded-xl p-4 bg-card space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by tag, serial, manufacturer, model, location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 bg-muted/20 focus:bg-background border-border"
            />
          </div>

          {/* View Toggles & Actions */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('list')}
              className={`h-10 w-10 ${viewMode === 'list' ? 'bg-muted' : ''}`}
              title="List View"
            >
              <List className="h-4 w-4 text-foreground" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={`h-10 w-10 ${viewMode === 'grid' ? 'bg-muted' : ''}`}
              title="Grid View"
            >
              <Grid className="h-4 w-4 text-foreground" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-2 h-10 font-medium"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            {(search || status || condition || categoryId || departmentId || isBookable !== undefined) && (
              <Button variant="ghost" onClick={handleResetFilters} className="h-10 text-rose-600 gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-medium">
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 border-t border-border pt-4 animate-in fade-in duration-200">
            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setPage(1);
                }}
                className="w-full h-9 border border-input rounded-lg bg-background px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                value={departmentId}
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  setPage(1);
                }}
                className="w-full h-9 border border-input rounded-lg bg-background px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="">All Departments</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full h-9 border border-input rounded-lg bg-background px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="ALLOCATED">Allocated</option>
                <option value="RESERVED">Reserved</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="LOST">Lost</option>
                <option value="RETIRED">Retired</option>
                <option value="DISPOSED">Disposed</option>
              </select>
            </div>

            {/* Condition */}
            <div className="space-y-1.5">
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value);
                  setPage(1);
                }}
                className="w-full h-9 border border-input rounded-lg bg-background px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="">All Conditions</option>
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="DAMAGED">Damaged</option>
              </select>
            </div>

            {/* Bookable Toggle */}
            <div className="space-y-1.5">
              <Label htmlFor="isBookable">Bookable Resource</Label>
              <select
                id="isBookable"
                value={isBookable === undefined ? '' : String(isBookable)}
                onChange={(e) => {
                  const val = e.target.value;
                  setIsBookable(val === '' ? undefined : val === 'true');
                  setPage(1);
                }}
                className="w-full h-9 border border-input rounded-lg bg-background px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="">All Assets</option>
                <option value="true">Bookable Only</option>
                <option value="false">Non-Bookable Only</option>
              </select>
            </div>

            {/* Sort Field */}
            <div className="space-y-1.5">
              <Label htmlFor="sortBy">Sort By</Label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-9 border border-input rounded-lg bg-background px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="createdAt">Date Created</option>
                <option value="name">Name</option>
                <option value="purchaseDate">Purchase Date</option>
                <option value="purchaseCost">Cost</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full h-9 border border-input rounded-lg bg-background px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Asset Listing Panel */}
      {data?.assets.length === 0 ? (
        <EmptyState
          title="No Assets Found"
          description="We couldn't find any physical assets matching your filters. Try adjusting your query or filters."
          iconName="Package"
          actionLabel={canCreate ? "Register New Asset" : undefined}
          onActionClick={canCreate ? () => window.location.href = `${rolePrefix}/assets/new` : undefined}
        />
      ) : viewMode === 'list' ? (
        <AssetTable
          assets={data?.assets || []}
          pagination={data?.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 }}
          onPageChange={handlePageChange}
          onDeleteClick={handleArchiveClick}
          rolePrefix={rolePrefix}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} rolePrefix={rolePrefix} />
            ))}
          </div>
          {/* Grid View Simple Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between py-2 border-t border-border mt-4">
              <span className="text-xs text-muted-foreground">
                Showing Page <span className="font-semibold text-foreground">{data.pagination.page}</span> of{' '}
                <span className="font-semibold text-foreground">{data.pagination.totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.pagination.page - 1)}
                  disabled={data.pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.pagination.page + 1)}
                  disabled={data.pagination.page >= data.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deletion / Archive Confirmation Modal */}
      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Archive Asset"
        description="Are you sure you want to archive this asset? This will change its status to RETIRED and make it unavailable for active allocations."
        confirmLabel="Archive Asset"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={deleteAssetMutation.isPending}
        onConfirm={handleConfirmArchive}
      />
    </div>
  );
};

export default AssetsListPage;
