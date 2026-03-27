// types/role.ts
export type Role = 'KIEM_DINH' | 'LANH_DAO';

export const roleConfig = {
  KIEM_DINH: {
    key: 'KIEM_DINH' as const,
    label: 'Cán bộ kiểm định',
    name: 'Nguyễn Văn Kiểm',
    avatar: 'K',
  },
  LANH_DAO: {
    key: 'LANH_DAO' as const,
    label: 'Lãnh đạo cục ATVSTP',
    name: 'Trần Thị Lãnh Đạo',
    avatar: 'L',
  },
} as const;

export const getRoleLabel = (role: Role) => roleConfig[role].label;