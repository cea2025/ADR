export type UserType = 'manager' | 'representative' | 'website';

export interface Permission {
  component: string;
  manager: boolean;
  representative: boolean;
  website: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  permissions: string[];
}

export const PERMISSIONS: Permission[] = [
  { component: 'actualLE', manager: true, representative: false, website: false },
  { component: 'actualReturns', manager: true, representative: false, website: false },
  { component: 'policyManagement', manager: true, representative: false, website: false },
  { component: 'allCalculations', manager: true, representative: true, website: false },
  { component: 'exchangeRateEdit', manager: true, representative: true, website: false },
  { component: 'pdfExport', manager: true, representative: true, website: true },
  { component: 'savedCalculations', manager: true, representative: true, website: true },
  { component: 'basicCalculator', manager: true, representative: true, website: true },
  { component: 'highestLE', manager: true, representative: true, website: true },
  { component: 'upTo110Age', manager: true, representative: true, website: true }
];

export const hasPermission = (userType: UserType, component: string): boolean => {
  const permission = PERMISSIONS.find(p => p.component === component);
  if (!permission) return false;
  
  switch (userType) {
    case 'manager':
      return permission.manager;
    case 'representative':
      return permission.representative;
    case 'website':
      return permission.website;
    default:
      return false;
  }
};
