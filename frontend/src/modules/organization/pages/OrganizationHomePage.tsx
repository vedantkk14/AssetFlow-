import { Link } from 'react-router-dom';
import { Building2, ChevronRight, Tags, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDepartments } from '../hooks/useDepartments';
import { useCategories } from '../hooks/useCategories';
import { useEmployees } from '../hooks/useEmployees';

const OrganizationHomePage = () => {
  const { data: departments } = useDepartments({ limit: 1 });
  const { data: categories } = useCategories({ limit: 1 });
  const { data: employees } = useEmployees({ limit: 1 });

  const sections = [
    {
      title: 'Department Management',
      description: 'Create departments, assign heads, and manage hierarchy.',
      icon: Building2,
      to: '/organization/departments',
      count: departments?.total,
      countLabel: 'departments',
    },
    {
      title: 'Asset Category Management',
      description: 'Define categories assets will be registered under.',
      icon: Tags,
      to: '/organization/categories',
      count: categories?.total,
      countLabel: 'categories',
    },
    {
      title: 'Employee Directory',
      description: 'View employees, promote roles, and manage status.',
      icon: Users,
      to: '/organization/employees',
      count: employees?.total,
      countLabel: 'employees',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Organization Setup</h1>
        <p className="text-sm text-muted-foreground">
          Configure your organization before assets can be registered.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.to} to={section.to}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader className="flex-row items-start justify-between">
                <div className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{section.title}</CardTitle>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>{section.description}</CardDescription>
                {typeof section.count === 'number' && (
                  <p className="mt-3 text-2xl font-semibold">
                    {section.count} <span className="text-sm font-normal text-muted-foreground">{section.countLabel}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrganizationHomePage;
