import type { Access, FieldAccess, Where } from 'payload'

export type StaffRole = 'admin' | 'editor' | 'reviewer' | 'sales'
export function hasRole(user: unknown, roles: StaffRole[]) {
  return (
    !!user && typeof user === 'object' && 'role' in user && roles.includes(user.role as StaffRole)
  )
}
export const adminOnly: Access = ({ req }) => hasRole(req.user, ['admin'])
export const editorial: Access = ({ req }) => hasRole(req.user, ['admin', 'editor', 'reviewer'])
export const adminField: FieldAccess = ({ req }) => hasRole(req.user, ['admin'])
export const publicWhere = (): Where => ({
  and: [
    { _status: { equals: 'published' } },
    { approval: { equals: 'approved' } },
    {
      or: [
        { expiresAt: { exists: false } },
        { expiresAt: { greater_than: new Date().toISOString() } },
      ],
    },
  ],
})
export const readContent: Access = ({ req }) => (editorial({ req }) ? true : publicWhere())
