export type UserRole = 'user' | 'admin';

export interface User {
  // UUID
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export function getUserDisplayName(user: User): string {
  if (user?.name) {
    return [user.name].filter(Boolean).join(' ');
  }
  return user.name ?? user.email;
}
export function getUserInitial(user: User): string {
  const name = user.name ?? user.email ?? '';
  return name.charAt(0).toUpperCase() || '?';
}
