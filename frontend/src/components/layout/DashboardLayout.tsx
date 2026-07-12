import { Outlet } from 'react-router-dom';

// TEMPORARY placeholder: Dashboard module (Sidebar/Navbar/shell) is being
// built on a separate branch. This only renders the Outlet so nested routes
// (e.g. Organization) can compile and render until the real layout merges.
const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-muted/20 p-6">
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
