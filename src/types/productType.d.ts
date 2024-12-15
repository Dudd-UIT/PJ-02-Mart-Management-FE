import { Column, MetaData } from './commonType';

export type ProductType = {
  id: number;
  name: string;
};

export interface ProductTypeTableType {
  productTypes: ProductType[];
  columns: Column<ProductType>[];
  onMutate: () => void;
}
