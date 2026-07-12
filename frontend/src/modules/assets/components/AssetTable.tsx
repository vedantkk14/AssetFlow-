import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, MoreVertical, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Asset, AssetStatus, AssetCondition } from '../types/assets.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AssetTableProps {
  assets: Asset[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onDeleteClick: (id: string) => void;
  rolePrefix: string; // e.g. '/admin' or '/asset-manager'
}

export const getStatusBadgeColor = (status: AssetStatus) => {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50';
    case 'ALLOCATED':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50';
    case 'RESERVED':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50';
    case 'UNDER_MAINTENANCE':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50';
    case 'LOST':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50';
    case 'RETIRED':
      return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800';
    case 'DISPOSED':
      return 'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-950/20 dark:text-zinc-400 dark:border-zinc-900/50';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const getConditionBadgeColor = (condition: AssetCondition) => {
  switch (condition) {
    case 'NEW':
      return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/50';
    case 'GOOD':
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50';
    case 'FAIR':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/50';
    case 'DAMAGED':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const AssetTable = ({ assets, pagination, onPageChange, onDeleteClick, rolePrefix }: AssetTableProps) => {
  const { user } = useAuth();
  const canModify = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';

  const formatStatus = (status: string) => status.replace('_', ' ');

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[100px] font-semibold text-xs uppercase">Tag</TableHead>
              <TableHead className="font-semibold text-xs uppercase">Asset Name</TableHead>
              <TableHead className="font-semibold text-xs uppercase">Category</TableHead>
              <TableHead className="font-semibold text-xs uppercase">Department</TableHead>
              <TableHead className="font-semibold text-xs uppercase">Location</TableHead>
              <TableHead className="font-semibold text-xs uppercase">Condition</TableHead>
              <TableHead className="font-semibold text-xs uppercase">Status</TableHead>
              <TableHead className="w-[80px] text-right font-semibold text-xs uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ShieldAlert className="h-6 w-6 text-muted-foreground" />
                    <span>No assets found matching the criteria.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-muted/10">
                  <TableCell className="font-mono text-xs font-bold text-foreground">
                    {asset.assetTag}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-foreground">{asset.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">S/N: {asset.serialNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{asset.category.name}</TableCell>
                  <TableCell className="text-sm">{asset.department.name}</TableCell>
                  <TableCell className="text-sm">{asset.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase border ${getConditionBadgeColor(asset.condition)}`}>
                      {asset.condition}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase border ${getStatusBadgeColor(asset.status)}`}>
                      {formatStatus(asset.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted" />}
                      >
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 p-1">
                        <DropdownMenuItem
                          render={<Link to={`${rolePrefix}/assets/${asset.id}`} className="cursor-pointer flex items-center gap-2" />}
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        {canModify && (
                          <>
                            <DropdownMenuItem
                              render={<Link to={`${rolePrefix}/assets/${asset.id}/edit`} className="cursor-pointer flex items-center gap-2" />}
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>Edit Asset</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDeleteClick(asset.id)}
                              className="cursor-pointer flex items-center gap-2 text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20 focus:text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Archive</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <span className="text-xs text-muted-foreground">
            Showing Page <span className="font-semibold text-foreground">{pagination.page}</span> of{' '}
            <span className="font-semibold text-foreground">{pagination.totalPages}</span> ({pagination.total} total assets)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="h-8 text-xs font-semibold"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="h-8 text-xs font-semibold"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetTable;
