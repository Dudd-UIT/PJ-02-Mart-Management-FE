'use server';

import { sendRequest } from '@/utils/api';
import { revalidateTag } from 'next/cache';

export const fetchInboundReceipts = async (
  url: string,
  current: number,
  pageSize: number,
  searchStaffName?: string,
  searchSupplierName?: string,
  searchStartDate?: string,
  searchEndDate?: string,
) => {
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
      url,
      method: 'GET',
      queryParams,
      nextOption: {
        next: { tags: ['list-inbound-receipts'] },
      },
    });

    if (res?.data) {
      return res.data;
    } else {
      throw new Error("Data format error: 'data' field is missing.");
    }
  } catch (error) {
    console.error('Fetch inbound receipt failed:', error);
    throw error;
  }
};

export const handleCreatedInboundReceiptAction = async (data: any) => {
  // const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/inbound-receipt/inbound-receipt-batchs`,
    method: 'POST',
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`,
    // },
    body: { ...data },
  });
  revalidateTag('list-inbound-receipts');

  return res;
};

export const handleUpdatedInboundReceiptAction = async (data: any) => {
  const { inboundReceiptId, ...rest } = data; // Separate id from the rest of the data

  // Send the PATCH request to update dInboundReceipt by ID in the URL path
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/inbound-receipt/inbound-receipt-batchs/${inboundReceiptId}`, // Include ID directly in the path
    method: 'PATCH',
    body: { ...rest },
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`, // Uncomment if authentication is needed
    // },
  });

  // Revalidate to update the list view if necessary
  revalidateTag('list-inbound-receipts');

  return res;
};

export const handleUpdatedStatusInboundReceiptAction = async (data: any) => {
  const { id, ...rest } = data; // Separate id from the rest of the data

  // Send the PATCH request to update dInboundReceipt by ID in the URL path
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/inbound-receipt/${id}`, // Include ID directly in the path
    method: 'PATCH',
    body: { ...rest },
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`, // Uncomment if authentication is needed
    // },
  });

  // Revalidate to update the list view if necessary
  revalidateTag('list-inbound-receipts');

  return res;
};

export const handleDeletedInboundReceiptAction = async (id: any) => {
  // const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/inbound-receipt/${id}`,
    method: 'DELETE',
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`,
    // },
  });
  revalidateTag('list-inbound-receipts');
  return res;
};
