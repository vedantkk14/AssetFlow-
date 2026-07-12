import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Pencil, Landmark, Tag, Calendar, AlertTriangle, FileText, BadgeDollarSign, ShieldAlert, Wrench } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAssetDetails } from '../api/assets.api';
import QRCodeComponent from '../components/QRCodeComponent';
import AssetTimeline from '../components/AssetTimeline';
import { getStatusBadgeColor, getConditionBadgeColor } from '../components/AssetTable';
import { SectionHeader } from '@/modules/dashboard/components/SectionHeader';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AssetDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  const canModify = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';

  const { data: asset, isLoading, error } = useAssetDetails(id || '');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Asset Details" description="Loading asset details..." />
        <div className="h-64 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Loading asset details...</span>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h3 className="text-lg font-semibold text-rose-600">Error loading asset details</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">The asset might have been archived or deleted.</p>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    );
  }

  const formatStatus = (status: string) => status.replace('_', ' ');

  return (
    <div className="space-y-6">
      {/* Back navigation and Edit Action Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            to={`${rolePrefix}/assets`}
            className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'h-9 w-9 rounded-full hover:bg-muted' })}
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-foreground">{asset.name}</h2>
              <span className="font-mono text-xs font-bold text-muted-foreground bg-muted/40 px-2 py-0.5 rounded">
                {asset.assetTag}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">S/N: {asset.serialNumber}</p>
          </div>
        </div>
        {canModify && (
          <Link
            to={`${rolePrefix}/assets/${asset.id}/edit`}
            className={buttonVariants({ className: 'gap-2 font-medium self-end sm:self-auto' })}
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Asset</span>
          </Link>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left main area (2/3 width) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-border shadow-xs overflow-hidden">
            {/* Aspect image placeholder or main image banner */}
            <div className="aspect-video w-full overflow-hidden bg-muted/40 border-b border-border relative">
              {asset.imageUrl ? (
                <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground">
                  <Landmark className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
            </div>
            
            <CardContent className="p-5 space-y-6">
              {/* Description */}
              {asset.description && (
                <div className="space-y-1.5 border-b border-border pb-4">
                  <h4 className="text-xs uppercase font-bold text-muted-foreground">Description / Notes</h4>
                  <p className="text-sm text-foreground leading-relaxed">{asset.description}</p>
                </div>
              )}

              {/* Core Information Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex gap-2.5 items-start">
                    <Landmark className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="text-muted-foreground block">Department</span>
                      <span className="font-semibold text-foreground">{asset.department.name}</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="text-muted-foreground block">Category</span>
                      <span className="font-semibold text-foreground">{asset.category.name}</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="text-muted-foreground block">Physical Location</span>
                      <span className="font-semibold text-foreground">{asset.location}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2.5 items-start">
                    <Wrench className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="text-muted-foreground block">Manufacturer / Model</span>
                      <span className="font-semibold text-foreground">
                        {asset.manufacturer || 'N/A'} {asset.model ? `/ ${asset.model}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="text-muted-foreground block">Vendor Partner</span>
                      <span className="font-semibold text-foreground">{asset.vendor || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="text-muted-foreground block">Registered By</span>
                      <span className="font-semibold text-foreground">{asset.creator?.name || 'System Admin'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Allocation/Maintenance/Audit History Timelines */}
          <AssetTimeline asset={asset} />
        </div>

        {/* Right side widgets (1/3 width) */}
        <div className="space-y-6">
          {/* Status and Condition Summary */}
          <Card className="border border-border shadow-xs bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Status Summary</h3>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Asset Status:</span>
              <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getStatusBadgeColor(asset.status)}`}>
                {formatStatus(asset.status)}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Condition Flag:</span>
              <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase border ${getConditionBadgeColor(asset.condition)}`}>
                {asset.condition}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-border pt-3">
              <span className="text-muted-foreground">Bookable Resource:</span>
              <Badge variant={asset.isBookable ? 'default' : 'secondary'} className="text-[10px] px-2 py-0.5">
                {asset.isBookable ? 'Yes' : 'No'}
              </Badge>
            </div>
          </Card>

          {/* Financials & Warranties Summary */}
          <Card className="border border-border shadow-xs bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Financial Records</h3>
            
            <div className="flex gap-3 items-start text-xs">
              <BadgeDollarSign className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-muted-foreground block">Purchase Cost</span>
                <span className="font-semibold text-foreground text-sm">${asset.purchaseCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3 items-start text-xs">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-muted-foreground block">Purchase Date</span>
                <span className="font-semibold text-foreground">{asset.purchaseDate ? asset.purchaseDate.split('T')[0] : 'N/A'}</span>
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Warranty Start:</span>
                <span className="font-semibold text-foreground">{asset.warrantyStart ? asset.warrantyStart.split('T')[0] : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Warranty End:</span>
                <span className="font-semibold text-foreground">{asset.warrantyEnd ? asset.warrantyEnd.split('T')[0] : 'N/A'}</span>
              </div>
            </div>
          </Card>

          {/* QR Code label */}
          <QRCodeComponent assetTag={asset.assetTag} assetName={asset.name} qrCodeUrl={asset.qrCode || undefined} />
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsPage;
