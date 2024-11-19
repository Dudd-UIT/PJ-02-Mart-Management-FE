import { ProductSample } from './productSample.d';
import { Column, MetaData } from './commonType';
import { ProductUnit } from './productUnit';


export type BatchGrouped = {
  id: number;
  inbound_price: number;
  sell_price: number;
  discount: number;
  quantity: number;
  inbound_quantity: number;
  expiredAt: number; 
  inboundReceiptId: number; 
  unit: string;
  productSample: string;
};

export interface BatchTableType {
  batches: BatchGrouped[];
  columns: Column<BatchGrouped>[];
  onMutate: () => void;
}

export type Batch = {
  id: number;
  inbound_price: number;
  sell_price: number;
  discount: number;
  quantity: number;
  inbound_quantity: number;
  expiredAt: string;
  inboundReceipt: {
      id: number;
  };
  productUnit: ProductUnit;
}