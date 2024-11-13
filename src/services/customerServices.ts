'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchCustomers = async (
  current: number,
  pageSize: number,
  groupId: number,
  searchName?: string,
  searchPhone?: string,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
    groupId,
  };

  if (searchName) queryParams.name = searchName;
  if (searchPhone) queryParams.phone = searchPhone;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/users`,
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
    console.error('Fetch customers failed:', error);
    throw error;
  }
};

export const handleCreateCustomerAction = async (data: any) => {
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/users/customer`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...data },
  });

  return res;
};

export const handleUpdateCustomerAction = async (data: any) => {
  const session = await auth();
  const { id, ...rest } = data;

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/users/${id}`,
    method: 'PATCH',
    body: { ...rest },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};

export const handleDeleteCustomerAction = async (id: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/users/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });
  return res;
};
