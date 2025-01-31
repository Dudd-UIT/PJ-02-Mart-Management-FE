'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchBatches = async (
  current: number,
  pageSize: number,
  showOption?: number,
  searchQuantity?: string,
  searchExpDate?: string,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (showOption === 1) {
    queryParams.nearExpired = 1;
  } else if (showOption === 3) {
    queryParams.createdToday = 1;
  }

  if (searchQuantity?.trim())
    queryParams.inventQuantity = searchQuantity.trim();
  if (searchExpDate?.trim()) queryParams.expiredAt = searchExpDate.trim();

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/batchs`,
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
    console.error('Fetch batches failed:', error);
    throw error;
  }
};

export const handleUpdateWarehouseAction = async (data: any) => {
  const { id, ...rest } = data;
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/batchs/${id}`,
    method: 'PATCH',
    body: { ...rest },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};

export const handleDeleteWarehouseAction = async (id: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/batchs/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};
