'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchOrders = async (
  current: number,
  pageSize: number,
  searchStaffName?: string,
  searchCustomerName?: string,
  searchStartDate?: string,
  searchEndDate?: string,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (searchStaffName) queryParams.staffName = searchStaffName;
  if (searchCustomerName) queryParams.customerName = searchCustomerName;
  if (searchStartDate) queryParams.startDate = searchStartDate;
  if (searchEndDate) queryParams.endDate = searchEndDate;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/orders`,
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
    console.error('Fetch orders failed:', error);
    throw error;
  }
};

export const handleCreatedOrderAction = async (data: any) => {
  const session = await auth();
  const { orderDto, orderDetailsDto } = data;
  const { staffId, ...rest } = orderDto;
  const updatedOrderDto = { staffId: session?.user.id, ...rest };
  const updatedData = {
    orderDto: updatedOrderDto,
    orderDetailsDto,
  };
  console.log('updatedData', updatedData)

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/orders/order-details`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...updatedData },
  });

  return res;
};

export const handleDeletedOrderAction = async (id: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/orders/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};
