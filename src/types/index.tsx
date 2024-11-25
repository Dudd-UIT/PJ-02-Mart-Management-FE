import { ReactNode } from 'react';

type Option = {
  [key: string]: string | number;
};

export type InputProps = {
  title: string;
  size?: number;
  type?: string;
  options?: Option[];
  keyObj?: string;
  showObj?: string;
  disabled?: boolean;
  value?: string | number;
  required?: boolean;
  readOnly?: boolean;
  valid?: 'default' | 'error' | 'success';
  placeholder?: string;
  suport?: string;
  onChange?: (value: string) => void;
  icon?: ReactNode | null;
  onClickIcon?: () => void;
  onSelectedChange?: (value: any) => void;
};
