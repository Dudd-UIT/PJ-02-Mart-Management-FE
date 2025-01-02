'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchProductSamples = async (
  current: number,
  pageSize: number,
  searchName?: string,
  searchProductLineId?: number,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (searchName) {
    queryParams.name = searchName;
  }

  if (searchProductLineId) {
    queryParams.productLineId = searchProductLineId;
  }

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-samples`,
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
    console.error('Fetch product samples failed:', error);
    throw error;
  }
};

export const handleCreateProductSampleAction = async (data: any) => {
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-samples`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });
  return res;
};

export const handleUpdateProductSampleAction = async (data: any) => {
  const { id, ...rest } = data;
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-samples/product-units/${id}`,
    method: 'PATCH',
    body: { ...rest },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};

export const handleDeleteProductSampleAction = async (id: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-samples/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });
  return res;
};

export const uploadImageToS3 = async (data: any) => {
  const session = await auth();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
      body: data,
    },
  );

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const result = await response.json();
  return result.data.url;
};
