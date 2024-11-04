import { Column, MetaData } from './commonType';

export type Supplier = {
  id: number;
  name: string;
  phone: string;
  address: string;
  country: string;
  supplierProducts: number[];
};

export interface SupplierTableType {
  suppliers: Supplier[];
  columns: Column<Supplier>[];
  onMutate: () => void;
}
