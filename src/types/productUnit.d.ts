import { Column, MetaData } from './commonType';

export type ProductUnitTransform = {
  id: number;
  sell_price: number;
  conversion_rate: number;
  createdAt: string;
  volumne: string;
  productSampleName: string;
  unitName: string;
};

export type ProductUnit = {
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

export interface ProductUnitTableModalProps {
  productUnits: ProductUnitTransform[];
  columns: Column<ProductUnitTransform>[];
  // meta: MetaData;
}

export interface ProductSupplierModalProps {
  isProductSupplierModalOpen: boolean;
  setIsProductSupplierModalOpen: (v: boolean) => void;
  onSelectedProductUnitsChange: (v: number[]) => void;
}

export interface SelectedProductUnitTableModalProps {
  productUnits: ProductUnitTransform[];
  columns: Column<ProductUnitTransform>[];
  // meta: MetaData;
}
