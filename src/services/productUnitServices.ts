'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchProductUnits = async (
  current: number,
  pageSize: number,
  searchName?: string,
  searchCategory?: string,
  searchLine?: string,
  searchType?: string,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (searchName) queryParams.name = searchName;
  if (searchLine) queryParams.productLineName = searchLine;
  if (searchType) queryParams.productTypeName = searchType;
  if (searchCategory) queryParams.productLine = searchCategory;

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
