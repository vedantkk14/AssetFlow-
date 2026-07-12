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
  ALLOCATIONS: '/allocations',
  TRANSFERS: '/transfers',
  ASSETS: {
    BASE: '/assets',
    DETAILS: (id: string) => `/assets/${id}`,
    STATUS: (id: string) => `/assets/${id}/status`,
    SEARCH: '/assets/search',
    CATEGORIES: (categoryId: string) => `/assets/categories/${categoryId}`,
    DEPARTMENTS: (departmentId: string) => `/assets/departments/${departmentId}`,
  },
} as const;
