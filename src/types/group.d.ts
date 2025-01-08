import { Column, MetaData } from './commonType';
import { Role } from './role';

export type Group = {
  id: number;
  name: string;
  description: string;
  roles?: Role[];
};

export interface UserGroupTableType {
  groups: Group[];
  columns: Column<Group>[];
  onMutate: () => void;
}
