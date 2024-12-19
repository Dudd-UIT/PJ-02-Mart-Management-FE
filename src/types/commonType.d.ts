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
      id: number;
      email: string;
      name: string;
      phone: string;
      address: string;
      groupName: string;
    };
    access_token: string;
  }

  interface InfoModalProps {
    isInfoModalOpen: boolean;
    setIsInfoModalOpen: (v: boolean) => void;
    data: User;
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
    setData?: (v: T | undefined) => void;
    onMutate: () => void;
  }

  export interface DeleteModalProps<T> {
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (v: boolean) => void;
    data?: T;
    onMutate: () => void;
  }
}

interface GroupedProductData {
  [typeName: string]: {
      [lineName: string]: Product[];
  };
}

export type StatisticsCardProps = {
  title: string;
  data?: string|number;
  unit?: string;
  onClick?: () => void;
}