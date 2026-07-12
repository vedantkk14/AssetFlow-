import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// Temporary test affordance for the auth module. Remove once the real
// Dashboard module ships with its own Navbar/logout UI.
const TempLogoutButton = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex items-center justify-between border-b p-4">
      <span className="text-sm text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{user?.name}</span> ({user?.role})
      </span>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default TempLogoutButton;
