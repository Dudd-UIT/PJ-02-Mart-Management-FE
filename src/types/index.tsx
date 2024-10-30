import { ReactNode } from "react";

export type InputProps = {
    title: string;
    size?: number;
    options?: string[],
    keyObj?: number,
    showObj?: number,
    value?: string;
    required?: boolean;
    readOnly?: boolean;
    valid?: 'default' | 'error' | 'success';
    placeholder?: string;
    suport?: string;
    onChange: (e: any) => void;
    icon?: ReactNode | null;
    onClickIcon?: (e: any) => void;
}