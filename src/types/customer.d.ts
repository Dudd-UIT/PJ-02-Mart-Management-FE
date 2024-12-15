import { Column, MetaData } from './commonType';

export type Customer = {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  score: number;
};

export interface CustomerTableType {
  customers: Customer[];
  columns: Column<Customer>[];
  onMutate: () => void;
}
