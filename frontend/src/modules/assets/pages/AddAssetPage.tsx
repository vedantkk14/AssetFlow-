import { useParams, useNavigate } from 'react-router-dom';
import { useAssetDetails, useCreateAsset, useUpdateAsset } from '../api/assets.api';
import AssetForm from '../components/AssetForm';
import { SectionHeader } from '@/modules/dashboard/components/SectionHeader';
import { useAuth } from '@/hooks/useAuth';

const AddAssetPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getRolePrefix = () => {
    switch (user?.role) {
      case 'ADMIN':
        return '/admin';
      case 'ASSET_MANAGER':
        return '/asset-manager';
      default:
        return '/employee';
    }
  };
  const rolePrefix = getRolePrefix();

  const isEditMode = !!id;

  const { data: asset, isLoading: isLoadingAsset } = useAssetDetails(id || '');
  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();

  const handleSubmit = async (formData: FormData) => {
    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      navigate(`${rolePrefix}/assets`);
    } catch (err) {
      console.error(err);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && isLoadingAsset) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Edit Asset" description="Loading asset details..." />
        <div className="h-64 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Loading asset details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={isEditMode ? 'Edit Asset' : 'Register New Asset'}
        description={isEditMode ? `Edit properties for asset: ${asset?.assetTag}` : 'Add a new physical asset to the inventory.'}
      />
      <div className="max-w-4xl">
        <AssetForm
          initialData={asset}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </div>
    </div>
  );
};

export default AddAssetPage;
