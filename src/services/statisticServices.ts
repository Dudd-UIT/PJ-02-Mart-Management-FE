'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchRevenue = async (searchDate?: string) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    date: searchDate,
  };

  console.log('queryParams', queryParams);

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/revenue`,
      method: 'GET',
      queryParams,
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });
    console.log('res', res);

    if (res?.data) {
      return res.data;
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    console.error('Fetch units failed:', error);
    throw error;
  }
};

export const fetchOrders = async (searchDate?: string) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    date: searchDate,
  };

  console.log('queryParams', queryParams);

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/orders`,
      method: 'GET',
      queryParams,
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });
    console.log('res', res);

    if (res?.data) {
      return res.data;
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    console.error('Fetch units failed:', error);
    throw error;
  }
};

export const fetchInbounds = async (searchDate?: string) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    date: searchDate,
  };

  console.log('queryParams', queryParams);

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/inbound-cost`,
      method: 'GET',
      queryParams,
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });
    console.log('res', res);

    if (res?.data) {
      return res.data;
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    console.error('Fetch units failed:', error);
    throw error;
  }
};
