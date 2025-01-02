'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchInboundReceipts = async (
  current: number,
  pageSize: number,
  searchStaffName?: string,
  searchSupplierName?: string,
  searchStartDate?: string,
  searchEndDate?: string,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (searchStaffName) queryParams.staffName = searchStaffName;
  if (searchSupplierName) queryParams.supplierName = searchSupplierName;
  if (searchStartDate) queryParams.startDate = searchStartDate;
  if (searchEndDate) queryParams.endDate = searchEndDate;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/inbound-receipt`,
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
    console.error('Fetch inbound receipt failed:', error);
    throw error;
  }
};

export const handleCreatedInboundReceiptAction = async (data: any) => {
  const session = await auth();
  const { inboundReceiptDto, batchsDto } = data;
  const { staffId, ...rest } = inboundReceiptDto;
  const updatedInboundReceiptDto = { staffId: session?.user.id, ...rest };
  const updatedData = {
    inboundReceiptDto: updatedInboundReceiptDto,
    batchsDto,
  };

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/inbound-receipt/inbound-receipt-batchs`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
    body: { ...updatedData },
  });

  return res;
};

export const handleUpdatedInboundReceiptAction = async (data: any) => {
  const session = await auth();
  const { inboundReceiptId, ...rest } = data;
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/inbound-receipt/inbound-receipt-batchs/${inboundReceiptId}`, // Include ID directly in the path
    method: 'PATCH',
    body: { ...rest },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};

export const handleUpdatedStatusInboundReceiptAction = async (data: any) => {
  const session = await auth();
  const { id, ...rest } = data;

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/inbound-receipt/${id}`,
    method: 'PATCH',
    body: { ...rest },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};

export const handleDeletedInboundReceiptAction = async (id: any) => {
  const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/inbound-receipt/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};
