import { UserAccount } from '../types';

/**
 * Permissions Logic:
 * As requested by the user:
 * "صلاحية التغيير والتعديل تكون عن طريقي أنا بس، بشمهندس عمر فريد العزب، والتيم ليدر بشمهندس أحمد نبيه."
 */

export function isSuperAdmin(user: UserAccount | null): boolean {
  if (!user) return false;
  return user.role === 'ADMIN' || user.name.includes('عمر فريد');
}

export function isTeamLeader(user: UserAccount | null): boolean {
  if (!user) return false;
  return user.role === 'TEAM_LEADER' || user.name.includes('أحمد نبيه');
}

export function canModifyMasterConfig(user: UserAccount | null): boolean {
  if (!user) return false;
  return isSuperAdmin(user) || isTeamLeader(user);
}

export function canDeleteRecord(user: UserAccount | null, recordCreatedBy?: string): boolean {
  if (!user) return false;
  // Admin and Team leader can delete any record
  if (canModifyMasterConfig(user)) return true;
  // Normal inspectors cannot delete
  return false;
}

export function canEditRecord(user: UserAccount | null, recordCreatedBy?: string): boolean {
  if (!user) return false;
  // Admin and Team leader can edit any record
  if (canModifyMasterConfig(user)) return true;
  // Inspectors can only edit their own newly created records if needed
  return !!recordCreatedBy && recordCreatedBy === user.name;
}
