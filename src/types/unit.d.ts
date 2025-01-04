import { Column, MetaData } from './commonType';

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
