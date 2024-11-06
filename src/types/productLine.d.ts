import { ProductType } from './productType.d';
import { Column, MetaData } from './commonType';

export type ProductLine = {
  id: number;
  name: string;
  productType: ProductType;
};

export interface ProductLineTableType {
  productLines: ProductLine[];
  columns: RenderableColumn<ProductLine>[];
  onMutate: () => void;
}