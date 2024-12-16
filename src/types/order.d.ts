import { User } from './auth';
import { Batch } from './batch';
import { Column, MetaData } from './commonType';
import { ProductUnit } from './productUnit';

export type OrderTransform = {
  id: number;
  totalPrice: number;
  paymentMethod: string;
  paymentTime: string;
  orderType: string;
  isReceived: number;
  isPaid: number;
  createdAt: string;
  customerName: string;
  customerId: number;
  staffName: string;
  staffId: number;
  orderDetails: OrderDetail[];
};

export type OrderDetailTransform = {
  id: number;
  quantity: number;
  currentPrice: number;
  productSampleName: string;
  unitName: string;
};

export type OrderDetail = {
  id: number;
  quantity: number;
  currentPrice: number;
  productUnit: ProductUnit;
};

export type Order = {
  id: number;
  totalPrice: number;
  paymentMethod: string;
  paymentTime: string;
  orderType: string;
  isReceived: number;
  isPaid: number;
  createdAt: string;
  customer: User;
  staff: User;
  orderDetails: OrderDetail[];
};

export interface OrderTableModalProps {
  orders: OrderTransform[];
  columns: Column<OrderTransform>[];
  onMutate: () => void;
}

// export interface ProductSupplierModalProps {
//   isProductSupplierModalOpen: boolean;
//   setIsProductSupplierModalOpen: (v: boolean) => void;
//   onSelectedOrdersChange: (v: number[]) => void;
// }

// export interface SelectedOrderTableModalProps {
//   Orders: OrderTransform[];
//   columns: Column<OrderTransform>[];
//   // meta: MetaData;
// }
