import { getCurrentUser } from './auth';

export async function requireRole(roles: string[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.roles.some((r) => roles.includes(r));
}


