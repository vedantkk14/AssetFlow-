import { Outlet } from 'react-router-dom';
import { Boxes } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Boxes className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold tracking-tight">AssetFlow</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
