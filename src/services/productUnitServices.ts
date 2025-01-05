'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchProductUnits = async (
  current: number,
  pageSize: number,
  searchName?: string,
  searchId?: number,
  searchLineId?: number,
  searchTypeId?: number,
  showOption?: number,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (showOption === 2) {
    queryParams.outOfStock = 1;
  }

  if (searchName) queryParams.name = searchName;
  if (searchLineId) queryParams.productLineId = searchLineId;
  if (searchTypeId) queryParams.productTypeId = searchTypeId;
  if (searchId) queryParams.id = searchId;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-units`,
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
    console.error('loi');
    throw error;
  }
};

export const fetchProductUnitsBySupplier = async (
  current: number,
  pageSize: number,
  searchName?: string,
  id?: number,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (searchName) queryParams.name = searchName;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-units/supplier/${id}`,
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
    console.error('loi');
    throw error;
  }
};

export const fetchProductUnitByIds = async (
  ids: number[],
  current?: number,
  pageSize?: number,
) => {
  const session = await auth();
  const queryParams: { [key: string]: any } = {};

  if (current !== null) queryParams.current = current;
  if (pageSize !== null) queryParams.pageSize = pageSize;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-units/find-by-ids`,
      method: 'POST',
      queryParams,
      body: { ids },
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
    console.error('Fetch productUnit by ids failed:', error);
    throw error;
  }
};

export const handleCreateProductUnitAction = async (data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-units`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });

  return res;
};

export const handleDeleteProductUnitAction = async (id: any) => {
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-units/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });
  return res;
};
