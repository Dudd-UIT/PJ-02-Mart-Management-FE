import { Batch } from './batch';
import { Column, MetaData } from './commonType';
import { ProductSample } from './productSample';

export type ProductUnitTransform = {
  id: number;
  sellPrice: number;
  conversionRate: number;
  compareUnitName?: string;
  compareUnitId?: number;
  createdAt?: string;
  volumne: string;
  productSampleName?: string;
  productSampleId?: number;
  unitName: string;
  unitId: number;
  image: string | File;
  batches: Batch[];
};

export type ProductUnit = {
  id: number;
  sellPrice: number;
  conversionRate: number;
  createdAt: string;
  volumne: string;
  image: string;
  productSample?: ProductSample;
  unit?: Unit;
  compareUnit?: Unit;
  batches: Batch[];
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
  supplierId?: number;
}

export interface SelectedProductUnitTableProps {
  productUnits: ProductUnitTransform[];
  columns: Column<ProductUnitTransform>[];
  // meta: MetaData;
}

interface Unit {
  id: number;
  name: string;
}

interface Product {
  id: number;
  sellPrice: number;
  conversionRate: number;
  image: string;
  volumne: string;
  productSample: ProductSample;
  unit: Unit;
}
