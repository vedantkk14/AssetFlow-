import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Tag, Package } from 'lucide-react';
import { Asset } from '../types/assets.types';
import { getStatusBadgeColor, getConditionBadgeColor } from './AssetTable';

interface AssetCardProps {
  asset: Asset;
  rolePrefix: string;
}

export const AssetCard = ({ asset, rolePrefix }: AssetCardProps) => {
  const formatStatus = (status: string) => status.replace('_', ' ');

  return (
    <Link to={`${rolePrefix}/assets/${asset.id}`} className="block group">
      <Card className="overflow-hidden border border-border group-hover:shadow-md transition-all duration-300 bg-card h-full flex flex-col">
        {/* Asset Image / Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted/40 border-b border-border">
          {asset.imageUrl ? (
            <img
              src={asset.imageUrl}
              alt={asset.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/20">
              <Package className="h-10 w-10 text-muted-foreground/50" />
            </div>
          )}
          
          {/* Status Badge Over Image */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border shadow-xs bg-background/90 backdrop-blur-xs ${getStatusBadgeColor(asset.status)}`}>
              {formatStatus(asset.status)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                {asset.category.name}
              </span>
              <span className="font-mono text-[10px] font-bold text-muted-foreground">{asset.assetTag}</span>
            </div>
            <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
              {asset.name}
            </h4>
          </div>

          <div className="space-y-2 pt-3 border-t border-border mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{asset.location}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Tag className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate font-mono">S/N: {asset.serialNumber}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-medium">Condition:</span>
              <Badge variant="outline" className={`text-[9px] px-1.5 py-0 rounded-full font-semibold uppercase border ${getConditionBadgeColor(asset.condition)}`}>
                {asset.condition}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AssetCard;
