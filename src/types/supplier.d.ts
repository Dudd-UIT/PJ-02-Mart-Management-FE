import { Column, MetaData } from './commonType';

export type Supplier = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  supplierProducts: number[];
};

export interface SupplierTableType {
  suppliers: Supplier[];
  columns: Column<Supplier>[];
  onMutate: () => void;
}
