import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AllocationForm from '../components/AllocationForm';

const AllocateAssetPage = () => {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Allocate Asset</CardTitle>
        <CardDescription>Assign an available asset to an employee.</CardDescription>
      </CardHeader>
      <CardContent>
        <AllocationForm />
      </CardContent>
    </Card>
  );
};

export default AllocateAssetPage;
