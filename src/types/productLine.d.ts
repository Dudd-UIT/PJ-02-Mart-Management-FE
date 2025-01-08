import { ProductType } from './productType.d';
import { Column, MetaData } from './commonType';

export type ProductLine = {
  id: number;
  name: string;
  productType: ProductType;
};

export type ProductLineTransform = {
  id: number;
  name: string;
  productTypeName: string;
  productTypeId: number;
};

export interface ProductLineTableType {
  productLines: ProductLineTransform[];
  columns: Column<ProductLineTransform>[];
  onMutate: () => void;
}
