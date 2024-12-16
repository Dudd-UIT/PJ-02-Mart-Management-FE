'use server';

import { sendRequest } from '@/utils/api';
import { revalidateTag } from 'next/cache';

export const fetchProductSamples = async (
  url: string,
  current: number,
  pageSize: number,
  searchName?: string,
  searchPhone?: string,
) => {
  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (searchName) queryParams.name = searchName;
  if (searchPhone) queryParams.phone = searchPhone;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url,
      method: 'GET',
      queryParams,
      nextOption: {
        next: { tags: ['list-product-samples'] },
      },
    });

    if (res?.data) {
      return res.data;
    } else {
      throw new Error("Data format error: 'data' field is missing.");
    }
  } catch (error) {
    console.error('Fetch product-samples failed:', error);
    throw error;
  }
};

export const handleCreateBatchAction = async (data: any) => {
  // const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-samples`,
    method: 'POST',
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`,
    // },
    body: { ...data },
  });
  revalidateTag('list-product-samples');

  return res;
};

export const handleUpdateBatchAction = async (data: any) => {
  const { id, ...rest } = data; // Separate id from the rest of the data

  // Send the PATCH request to update Batch by ID in the URL path
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-samples/${id}`, // Include ID directly in the path
    method: 'PATCH',
    body: { ...rest },
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`, // Uncomment if authentication is needed
    // },
  });

  // Revalidate to update the list view if necessary
  revalidateTag('list-product-samples');

  return res;
};

export const handleDeleteBatchAction = async (id: any) => {
  // const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-samples/${id}`,
    method: 'DELETE',
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`,
    // },
  });
  revalidateTag('list-product-samples');
  return res;
};
