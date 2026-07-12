import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Loader2, Calendar } from 'lucide-react';
import { useCategories, useDepartments } from '../api/assets.api';
import { Asset, AssetCondition, AssetStatus } from '../types/assets.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Zod validation matching the backend validation criteria
const formSchema = z.object({
  name: z.string().min(1, 'Asset Name is required'),
  description: z.string().optional(),
  serialNumber: z.string().min(1, 'Serial Number is required'),
  categoryId: z.string().min(1, 'Category is required'),
  departmentId: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  purchaseDate: z.string().min(1, 'Purchase Date is required'),
  purchaseCost: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ required_error: 'Purchase Cost is required' }).nonnegative('Cost must be positive')
  ),
  condition: z.string().default('NEW'),
  status: z.string().default('AVAILABLE'),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  vendor: z.string().optional(),
  warrantyStart: z.string().optional(),
  warrantyEnd: z.string().optional(),
  isBookable: z.boolean().default(false),
}).refine(
  (data) => {
    if (data.warrantyStart && data.warrantyEnd) {
      return new Date(data.warrantyEnd) >= new Date(data.warrantyStart);
    }
    return true;
  },
  {
    message: 'Warranty end date must be after warranty start date',
    path: ['warrantyEnd'],
  }
).refine(
  (data) => {
    if (data.warrantyStart && data.purchaseDate) {
      return new Date(data.warrantyStart) >= new Date(data.purchaseDate);
    }
    return true;
  },
  {
    message: 'Warranty start must be after or equal to purchase date',
    path: ['warrantyStart'],
  }
);

type FormValues = z.infer<typeof formSchema>;

interface AssetFormProps {
  initialData?: Asset;
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
}

const AssetForm = ({ initialData, onSubmit, isLoading }: AssetFormProps) => {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: departments, isLoading: loadingDepartments } = useDepartments();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      serialNumber: initialData?.serialNumber || '',
      categoryId: initialData?.categoryId || '',
      departmentId: initialData?.departmentId || '',
      location: initialData?.location || '',
      purchaseDate: initialData?.purchaseDate ? initialData.purchaseDate.split('T')[0] : '',
      purchaseCost: initialData?.purchaseCost || undefined,
      condition: initialData?.condition || 'NEW',
      status: initialData?.status || 'AVAILABLE',
      manufacturer: initialData?.manufacturer || '',
      model: initialData?.model || '',
      vendor: initialData?.vendor || '',
      warrantyStart: initialData?.warrantyStart ? initialData.warrantyStart.split('T')[0] : '',
      warrantyEnd: initialData?.warrantyEnd ? initialData.warrantyEnd.split('T')[0] : '',
      isBookable: initialData?.isBookable || false,
    },
  });

  const watchIsBookable = watch('isBookable');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (data: FormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* 2-Column layout */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: General Info & Specifications (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-border rounded-xl p-5 bg-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">General Asset Information</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Asset Name *</Label>
                <Input id="name" {...register('name')} placeholder="e.g. MacBook Pro M2 Max" />
                {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input id="serialNumber" {...register('serialNumber')} placeholder="e.g. SN-MBP-987123" />
                {errors.serialNumber && <p className="text-xs text-rose-500 font-medium">{errors.serialNumber.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Enter additional asset specifications, notes or identifiers..."
                className="w-full min-h-20 border border-input rounded-lg bg-transparent px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="categoryId">Category *</Label>
                {loadingCategories ? (
                  <div className="h-10 w-full border border-input bg-muted/40 rounded-lg flex items-center px-3 text-xs text-muted-foreground">Loading categories...</div>
                ) : (
                  <select
                    id="categoryId"
                    {...register('categoryId')}
                    className="w-full h-10 border border-input rounded-lg bg-background px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.categoryId && <p className="text-xs text-rose-500 font-medium">{errors.categoryId.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="departmentId">Department *</Label>
                {loadingDepartments ? (
                  <div className="h-10 w-full border border-input bg-muted/40 rounded-lg flex items-center px-3 text-xs text-muted-foreground">Loading departments...</div>
                ) : (
                  <select
                    id="departmentId"
                    {...register('departmentId')}
                    className="w-full h-10 border border-input rounded-lg bg-background px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select Department</option>
                    {departments?.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.departmentId && <p className="text-xs text-rose-500 font-medium">{errors.departmentId.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="location">Physical Location *</Label>
                <Input id="location" {...register('location')} placeholder="e.g. IT Rack B1, Floor 3" />
                {errors.location && <p className="text-xs text-rose-500 font-medium">{errors.location.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="condition">Asset Condition *</Label>
                <select
                  id="condition"
                  {...register('condition')}
                  className="w-full h-10 border border-input rounded-lg bg-background px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="NEW">New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="DAMAGED">Damaged</option>
                </select>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="border border-border rounded-xl p-5 bg-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Manufacturer & Specifications</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input id="manufacturer" {...register('manufacturer')} placeholder="e.g. Apple" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="model">Model</Label>
                <Input id="model" {...register('model')} placeholder="e.g. MacBook Pro 16" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor">Vendor</Label>
                <Input id="vendor" {...register('vendor')} placeholder="e.g. Apple Store Business" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Financial Details, Image, Bookable Switch (1 col) */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="border border-border rounded-xl p-5 bg-card flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 w-full text-left mb-4">Asset Image</h3>
            
            {imagePreview ? (
              <div className="relative group w-40 h-40 rounded-xl border border-border overflow-hidden mb-3">
                <img src={imagePreview} alt="Asset Preview" className="w-full h-full object-cover" />
                <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-xs font-semibold gap-1">
                  <Upload className="h-4 w-4" />
                  <span>Change Image</span>
                  <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                </label>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border hover:border-primary/50 transition-colors w-40 h-40 rounded-xl flex flex-col items-center justify-center cursor-pointer gap-2 mb-3 bg-muted/20 text-muted-foreground hover:text-foreground">
                <Upload className="h-8 w-8" />
                <span className="text-xs font-medium">Upload Image</span>
                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
              </label>
            )}
            <p className="text-[10px] text-muted-foreground">Supported format: PNG, JPG, JPEG (Max 5MB)</p>
          </div>

          {/* Pricing & Warranties */}
          <div className="border border-border rounded-xl p-5 bg-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Financials & Warranty</h3>
            
            <div className="space-y-1.5">
              <Label htmlFor="purchaseCost">Purchase Cost ($) *</Label>
              <Input type="number" step="0.01" id="purchaseCost" {...register('purchaseCost')} placeholder="0.00" />
              {errors.purchaseCost && <p className="text-xs text-rose-500 font-medium">{errors.purchaseCost.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <div className="relative">
                <Input type="date" id="purchaseDate" {...register('purchaseDate')} className="pr-10" />
              </div>
              {errors.purchaseDate && <p className="text-xs text-rose-500 font-medium">{errors.purchaseDate.message}</p>}
            </div>

            <div className="grid gap-2 grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="warrantyStart">Warranty Start</Label>
                <Input type="date" id="warrantyStart" {...register('warrantyStart')} />
                {errors.warrantyStart && <p className="text-xs text-rose-500 font-medium">{errors.warrantyStart.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="warrantyEnd">Warranty End</Label>
                <Input type="date" id="warrantyEnd" {...register('warrantyEnd')} />
                {errors.warrantyEnd && <p className="text-xs text-rose-500 font-medium">{errors.warrantyEnd.message}</p>}
              </div>
            </div>

            {/* Bookable switch */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="isBookable" className="font-semibold text-sm cursor-pointer">Bookable Resource</Label>
                <span className="text-[10px] text-muted-foreground">Allow employees to book this resource</span>
              </div>
              <input
                type="checkbox"
                id="isBookable"
                checked={watchIsBookable}
                onChange={(e) => setValue('isBookable', e.target.checked)}
                className="h-5 w-10 cursor-pointer rounded-full bg-muted border-none checked:bg-primary transition-all duration-200"
              />
            </div>

            {/* Status Selector (Only shown if editing asset) */}
            {initialData && (
              <div className="border-t border-border pt-4 space-y-1.5">
                <Label htmlFor="status">Asset Status</Label>
                <select
                  id="status"
                  {...register('status')}
                  className="w-full h-10 border border-input rounded-lg bg-background px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="ALLOCATED">Allocated</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  <option value="LOST">Lost</option>
                  <option value="RETIRED">Retired</option>
                  <option value="DISPOSED">Disposed</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" className="font-medium px-5" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="font-medium px-6 gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{initialData ? 'Save Changes' : 'Register Asset'}</span>
        </Button>
      </div>
    </form>
  );
};

export default AssetForm;
