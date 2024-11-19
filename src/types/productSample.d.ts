import { ProductLine } from "./productLine";

export type ProductSample = {
    id: number;
    name: string;
    description: string;
    volumne: string;
    createAt: string;
    deleteAt: string;
    productLine: ProductLine;
}