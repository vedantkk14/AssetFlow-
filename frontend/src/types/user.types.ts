import { Role } from './role.types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}
