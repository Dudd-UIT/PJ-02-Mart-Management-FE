import { Column, MetaData } from './commonType';
import { Group } from './group';

export type Staff = {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  group: Group;
  isActive: number;
};

export interface StaffTableType {
  staffs: Staff[];
  columns: Column<Staff>[];
  onMutate: () => void;
}
