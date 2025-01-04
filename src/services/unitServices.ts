'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchUnits = async (
  current?: number,
  pageSize?: number,
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
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/units`,
      method: 'GET',
      queryParams,
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    if (res?.data) {
      return res.data;
    } else {
      throw new Error("Data format error: 'data' field is missing.");
    }
  } catch (error) {
    console.error('Fetch units failed:', error);
    throw error;
  }
};

export const handleCreateUnitAction = async (data: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/units`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });

  return res;
};

export const handleUpdateUnitAction = async (data: any) => {
  const { id, ...rest } = data;
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/units/${id}`,
    method: 'PATCH',
    body: { ...rest },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};

export const handleDeleteUnitAction = async (id: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/units/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });
  return res;
};
