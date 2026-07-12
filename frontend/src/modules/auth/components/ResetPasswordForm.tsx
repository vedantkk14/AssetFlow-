import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import PasswordInput from './PasswordInput';
import { resetPasswordRequest } from '../api/auth.api';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../validation/auth.schema';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);

    try {
      await resetPasswordRequest({ token, password: values.password });
      toast.success('Password has been reset. Please log in.');
      navigate('/login', { replace: true });
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message ?? 'Unable to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return <p className="text-sm text-destructive">This reset link is invalid or has expired.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <PasswordInput id="password" placeholder="••••••••" {...register('password')} />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <PasswordInput id="confirmPassword" placeholder="••••••••" {...register('confirmPassword')} />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
