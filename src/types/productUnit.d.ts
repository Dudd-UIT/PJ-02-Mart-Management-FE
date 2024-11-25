import { Column, MetaData } from './commonType';

export type ProductUnitTransform = {
  id: number;
  sellPrice: number;
  conversionRate: number;
  createdAt: string;
  volumne: string;
  productSampleName: string;
  unitName: string;
  image: string;
};

export type ProductUnit = {
  id: number;
  sellPrice: number;
  conversionRate: number;
  createdAt: string;
  volumne: string;
  image: string;
  productSample?: {
    id: number;
    name: string;
  };
  unit?: {
    id: number;
    name: string;
  };
};

export interface ProductUnitTableProps {
  productUnits: ProductUnitTransform[];
  columns: Column<ProductUnitTransform>[];
  // meta: MetaData;
}

export interface ProductSupplierModalProps {
  isProductSupplierModalOpen: boolean;
  setIsProductSupplierModalOpen: (v: boolean) => void;
  onSelectedProductUnitsChange?: (v: number[]) => void;
  selectedProductUnitIds?: number[];
}

export interface SelectedProductUnitTableProps {
  productUnits: ProductUnitTransform[];
  columns: Column<ProductUnitTransform>[];
  // meta: MetaData;
}
