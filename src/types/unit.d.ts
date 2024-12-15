import { Column, MetaData } from './commonType';

export type UnitTransform = {
  id: number;
  sellPrice: number;
  conversionRate: number;
  createdAt: string;
  volumne: string;
  productSampleName: string;
  unitName: string;
};

export type Unit = {
  id: number;
  name: string;
};

export interface UnitTableModalProps {
  productUnits: ProductUnitTransform[];
  columns: Column<ProductUnitTransform>[];
  // meta: MetaData;
}

export interface ProductSampleUnitModalProps {
  isProductSampleUnitsModalOpen: boolean;
  setIsProductSampleUnitsModalOpen: (v: boolean) => void;
  productSampleData?: ProductSampleTransform;
  onAddUnit: (ProductUnitTransform) => void;
}

export interface SelectedProductUnitTableModalProps {
  productUnits: ProductUnitTransform[];
  columns: Column<ProductUnitTransform>[];
  // meta: MetaData;
}
