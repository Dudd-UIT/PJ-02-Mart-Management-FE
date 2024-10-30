import { ReactNode } from 'react';

export type InputProps = {
  title: string;
  size?: number;
  options?: string[];
  keyObj?: number;
  showObj?: number;
  value?: string;
  required?: boolean;
  readOnly?: boolean;
  valid?: 'default' | 'error' | 'success';
  placeholder?: string;
  suport?: string;
  onChange: (value: string) => void; // Change to accept string
  icon?: ReactNode | null;
  onClickIcon?: (value: string) => void; // Change to accept string
};
