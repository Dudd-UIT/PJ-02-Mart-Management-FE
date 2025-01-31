// import { ProductLine } from "./productLine";

// export type ProductSample = {
//     id: number;
//     name: string;
//     description: string;
//     volumne: string;
//     createAt: string;
//     deleteAt: string;
//     productLine: ProductLine;
// }
import { ProductType } from './productType.d';
import { Column, MetaData } from './commonType';
import { ProductUnit } from './productUnit';
import { ProductLine } from './productLine';

export interface SelectedProductSampleUnitTableProps {
  productSampleUnits: ProductUnitTransform[];
  columns: Column<ProductUnitTransform>[];
  onDeleteUnit: (unitId: number) => void;
  onUpdateUnit?: (productUnit: any) => void;
  productSampleData?: ProductSampleTransform;
}

export interface ProductSample {
  id: number;
  name: string;
  description: string;
  minUnitName: number;
  productLineId: number;
  productLine: ProductLine;
  productUnits: ProductUnit[];
}

export interface ProductSampleTransform {
  id: number;
  name: string;
  description: string;
}

export interface ProductSampleUnitTableType {
  productUnits: ProductSample[];
  columns: Column<ProductSample>[];
  onMutate: () => void;
}

export interface ProductSampleShoping {
  id: number;
  name: string;
  description: string;
  sellPrice: number;
  image: string;
  discount: number;
  productLineId: number;
  productLine: ProductLine;
  productUnits: ProductUnit[];
  available: number;
}
