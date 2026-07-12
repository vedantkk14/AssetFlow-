export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DEPARTMENTS: '/departments',
  CATEGORIES: '/categories',
  EMPLOYEES: '/employees',
  DASHBOARD: {
    ADMIN: '/dashboard/admin',
    ASSET_MANAGER: '/dashboard/asset-manager',
    DEPARTMENT_HEAD: '/dashboard/department',
    EMPLOYEE: '/dashboard/employee',
  },
} as const;
