import { ProductType } from './productType.d';
export type ProductLine = {
    id: number;
    name: string;
    createAt: string;
    deleteAt: string;
    productType: ProductType;
}