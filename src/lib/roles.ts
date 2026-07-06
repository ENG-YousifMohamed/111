import type { UserRole } from '@prisma/client';

export const ADMIN_ROLES: UserRole[] = ['ADMIN', 'SUPER_ADMIN'];
export const CUSTOMER_ROLES: UserRole[] = ['USER', 'CUSTOMER'];

export function isAdminRole(role: UserRole | null | undefined) {
  return Boolean(role && ADMIN_ROLES.includes(role));
}

export function isSuperAdminRole(role: UserRole | null | undefined) {
  return role === 'SUPER_ADMIN';
}

export function roleLabel(role: UserRole | 'GUEST') {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Admin';
    case 'ADMIN':
      return 'Admin';
    case 'CUSTOMER':
    case 'USER':
      return 'Customer';
    default:
      return 'Guest';
  }
}
