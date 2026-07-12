// TEMPORARY: reads from data/temp-assets.mock.ts since the Asset Management
// module isn't merged yet. Once it is, swap TEMP_ASSETS for a real
// useAssets({ status: 'AVAILABLE' }) query and delete the mock import.
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEMP_ASSETS } from '../data/temp-assets.mock';

interface AssetSearchProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const AssetSearch = ({ value, onChange, placeholder = 'Select asset' }: AssetSearchProps) => {
  return (
    <Select value={value} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {TEMP_ASSETS.map((asset) => (
          <SelectItem key={asset.id} value={asset.id}>
            {asset.name} ({asset.assetTag})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AssetSearch;
