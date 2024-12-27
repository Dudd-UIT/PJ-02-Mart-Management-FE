'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchRevenue = async (searchDate?: string) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    date: searchDate,
  };

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/revenue`,
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
    console.error('Fetch revenue failed:', error);
    throw error;
  }
};

export const fetchOrders = async (searchDate?: string) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    date: searchDate,
  };

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/orders`,
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
    console.error('Fetch orders statistic failed:', error);
    throw error;
  }
};

export const fetchInbounds = async (searchDate?: string) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    date: searchDate,
  };

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/inbound-cost`,
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
    console.error('Fetch inbound statistic failed:', error);
    throw error;
  }
};

export const fetchRevenueDetail = async (
  level: string,
  searchDate?: string,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    level,
    date: searchDate,
  };

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/revenue-detail`,
      method: 'GET',
      queryParams,
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });

    if (res?.data) {
      return res?.data.map((item: any) => ({
        time: item.time,
        income: item.income || 0,
        expense: item.expense || 0,
      }));
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    console.error('Fetch revenue detail failed:', error);
    throw error;
  }
};

export const fetchOrderStatistic = async (
  level: string,
  date: string,
  startDate?: string,
  endDate?: string,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    level,
    date,
  };

  if (startDate) queryParams.startDate = startDate;
  if (endDate) queryParams.endDate = endDate;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/order-statistics`,
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
    console.error('Fetch revenue detail failed:', error);
    throw error;
  }
};

export const fetchOrderValueDistribution = async (
  level: string,
  date: string,
  startDate?: string,
  endDate?: string,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    level,
    date,
  };

  if (startDate) queryParams.startDate = startDate;
  if (endDate) queryParams.endDate = endDate;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/order-value-distribution`,
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
    console.error('Fetch revenue detail failed:', error);
    throw error;
  }
};

export const fetchBestSeller = async (
  level: string,
  searchProductTypeId?: number,
  searchProductLineId?: number,
  startDate?: string,
  endDate?: string,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    level,
    searchProductTypeId,
    searchProductLineId,
    startDate,
    endDate,
  };

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/top-selling-products`,
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
    console.error('Fetch revenue detail failed:', error);
    throw error;
  }
};
