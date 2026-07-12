import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AssetSearch from './AssetSearch';
import EmployeeSearch from './EmployeeSearch';
import DatePicker from './DatePicker';
import { useCreateAllocation } from '../hooks/useAllocations';
import { allocateAssetSchema, type AllocateAssetFormValues } from '../validation/allocation.schema';

const AllocationForm = () => {
  const navigate = useNavigate();
  const createAllocation = useCreateAllocation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AllocateAssetFormValues>({ resolver: zodResolver(allocateAssetSchema) });

  const onSubmit = async (values: AllocateAssetFormValues) => {
    try {
      await createAllocation.mutateAsync(values);
      toast.success('Asset allocated successfully');
      navigate('/allocation');
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to allocate asset. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Asset</Label>
          <Controller
            control={control}
            name="assetId"
            render={({ field }) => <AssetSearch value={field.value} onChange={field.onChange} />}
          />
          {errors.assetId && <p className="text-sm text-destructive">{errors.assetId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Employee</Label>
          <Controller
            control={control}
            name="employeeId"
            render={({ field }) => <EmployeeSearch value={field.value} onChange={field.onChange} />}
          />
          {errors.employeeId && <p className="text-sm text-destructive">{errors.employeeId.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="allocatedDate">Allocation Date</Label>
          <DatePicker id="allocatedDate" {...register('allocatedDate')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
          <DatePicker id="expectedReturnDate" {...register('expectedReturnDate')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="conditionAtIssue">Condition</Label>
        <Input id="conditionAtIssue" placeholder="e.g. Excellent, Good, Fair" {...register('conditionAtIssue')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Optional notes" {...register('notes')} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Allocating...' : 'Allocate'}
      </Button>
    </form>
  );
};

export default AllocationForm;
