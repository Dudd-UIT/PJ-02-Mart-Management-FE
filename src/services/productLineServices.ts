'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchProductLines = async (
  current: number,
  pageSize: number,
  searchName?: string,
) => {
  const session = await auth();
  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (searchName) {
    queryParams.name = searchName;
  }

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines`,
      method: 'GET',
      queryParams,
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });
    if (res?.data) {
      return res.data;
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    console.error('Fetch product lines failed:', error);
    throw error;
  }
};

export const handleCreaterProductLineAction = async (data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });

  return res;
};

export const handleUpdateProductLineAction = async (data: any) => {
  const { id, ...rest } = data;
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines/${id}`,
    method: 'PATCH',
    body: { ...rest },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};

export const handleDeleteProductLineAction = async (id: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};
