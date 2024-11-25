import { Column, MetaData } from './commonType';

export type UnitTransform = {
  id: number;
  sell_price: number;
  conversion_rate: number;
  createdAt: string;
  volumne: string;
  productSampleName: string;
  unitName: string;
};

export type Unit = {
  id: number;
  sell_price: number;
  conversion_rate: number;
  createdAt: string;
  volumne: string;
  productSample?: {
    name: string;
  };
  unit?: {
    name: string;
  };
};

export interface UnitTableModalProps {
  productUnits: ProductUnitTransform[];
  columns: Column<ProductUnitTransform>[];
  // meta: MetaData;
}

export interface ProductSampleUnitModalProps {
  isProductSampleUnitsModalOpen: boolean;
  setIsProductSampleUnitsModalOpen: (v: boolean) => void;
  onSelectedProductUnitsChange: (v: number[]) => void;
  productSampleData?: ProductSampleTransform;
  onMutate: () => void
}

export interface SelectedProductUnitTableModalProps {
  productUnits: ProductUnitTransform[];
  columns: Column<ProductUnitTransform>[];
  // meta: MetaData;
}
