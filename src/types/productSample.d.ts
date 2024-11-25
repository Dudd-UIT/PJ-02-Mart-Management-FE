import { ProductType } from './productType.d';
import { Column, MetaData } from './commonType';
import { ProductUnit } from './productUnit';


export type ProductSampleTransform = {
    id: number;
    name: string;
    volumne: string;
    unitName: string;
    productLineName: string;
    productSampleUnits: number[];
};

export type ProductSample = {
  id: number;
  name: string;
  productLine?: {
    id: number;
    name: string;
    productType?: {
      id: number;
      name: string;
    }
  };
  productUnits?: [{
    id: number;
    sell_price: number;
    conversion_rate: number;
    image: string;
    unit?: {
      id: number;
      name: string;
    }
    volumne: string;
    average_inbound_price?: number;
    latest_inbound_price?: number;
  }];
  productSampleUnits: number[];
};

export interface ProductSampleTableType {
  productSamples: ProductSampleTransform[];
  columns: Column<ProductSampleTransform>[];
  onMutate: () => void;
}

export type ProductSampleHeaderType = {
  productTypeName: string;
}



// Table Product Sample Unit
export type ProductSampleUnitTransform = {
  id: number;
  sell_price: number;
  conversion_rate: number;
  avg_inbound_price: number;
  latest_inbound_price: string;
  unitName: string;
};

export type ProductSampleUnit = {
  id: number;
  description: string;
  name: string;
  productUnits: [{
    id: number;
    average_inbound_price: number;
    conversion_rate: number;
    image: string;
    latest_inbound_price: number;
    sell_price: number;
    volumne: string;
    unit: {
      id: number;
      name: string;
    }
  }]
};

export interface SelectedProductSampleUnitTableModalProps {
  productSampleUnits: ProductSampleUnitTransform[];
  columns: Column<ProductSampleUnitTransform>[];
  // meta: MetaData;
}