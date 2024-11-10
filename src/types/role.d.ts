import { Column, MetaData } from './commonType';
import { Group } from './group';

export type Role = {
  id: number;
  url: string;
  description: string;
};

export interface RoleTableProps {
  roles: Role[];
  columns: Column<Role>[];
}

export interface AssignRoleModalProps {
  data?: Group;
  setData?: (v: Group | undefined) => void;
  isAssignRoleModalOpen: boolean;
  setIsAssignRoleModalOpen: (v: boolean) => void;
  onMutate: () => void;
}
