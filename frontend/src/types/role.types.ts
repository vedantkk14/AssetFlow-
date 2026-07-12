export const ROLES = {
  ADMIN: 'ADMIN',
  ASSET_MANAGER: 'ASSET_MANAGER',
  DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
  EMPLOYEE: 'EMPLOYEE',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  ADMIN: '/admin/dashboard',
  ASSET_MANAGER: '/asset-manager/dashboard',
  DEPARTMENT_HEAD: '/department/dashboard',
  EMPLOYEE: '/employee/dashboard',
};
