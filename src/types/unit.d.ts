import { Column, MetaData } from './commonType';
import { ProductUnitTransform } from './productUnit';

export type Unit = {
  id: number;
  name: string;
};

export interface UnitTableType {
  units: Unit[];
  columns: Column<Unit>[];
  onMutate: () => void;
}

export interface ProductSampleUnitModalProps {
  isProductSampleUnitsModalOpen: boolean;
  setIsProductSampleUnitsModalOpen: (v: boolean) => void;
  productSampleData?: ProductSampleTransform;
  onAddUnit: (ProductUnitTransform) => void;
}

export interface UpdateProductSampleUnitModalProps {
  isProductSampleUnitsModalOpen: boolean;
  setIsProductSampleUnitsModalOpen: (v: boolean) => void;
  productSampleData?: ProductSampleTransform;
  productUnitData?: ProductUnitTransform;
  onUpdateUnit: (ProductUnitTransform) => void;
  setData?: (any) => void;
}
