import { ProductSample } from './productSample';

declare global {
  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface ILogin {
    user: {
      _id: string;
      name: string;
      email: string;
    };
    access_token: string;
  }

  export type Column<T> = {
    title: string;
    key: keyof T;
  };

  export type RenderableColumn<T> = Column<T> & {
    render?: (record: T) => React.ReactNode;
  };

  export interface MetaData {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  }

  export interface CreateModalProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    onMutate: () => void;
  }

  export interface UpdateModalProps<T> {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    data?: T;
    onMutate: () => void;
  }

  export interface DeleteModalProps<T> {
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (v: boolean) => void;
    data?: T;
    onMutate: () => void;
  }
}
