'use server'

import { sendRequest } from "@/utils/api";
import { revalidateTag } from "next/cache";


export const fetchProductLines = async (
  url: string,
  current: number,
  pageSize: number,
  searchName?: string,
) => {
  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };


  if (searchName) {
    queryParams.name = searchName;
  }

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url,
      method: 'GET',
      queryParams,
      nextOption: {
        next: { tags: ['list-product-lines'] },
      },
    });

    if (res?.data) {
      return res.data;
    } else {
      throw new Error("Data format error: 'data' field is missing.");
    }
  } catch (error) {
    console.error('Fetch product lines failed:', error);
    throw error;
  }
};

export const handleCreaterProductLineAction = async (data: any) => {
  // const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines`,
    method: 'POST',
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`,
    // },
    body: { ...data },
  });
  revalidateTag('list-product-lines');

  return res;
};

export const handleUpdateProductLineAction = async (data: any) => {
  const { id, ...rest } = data;

  // Send the PATCH request to update supplier by ID in the URL path
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines/${id}`, // Include ID directly in the path
    method: 'PATCH',
    body: { ...rest },
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`, // Uncomment if authentication is needed
    // },
  });

  // Revalidate to update the list view if necessary
  revalidateTag('list-product-lines');
  return res;
};

export const handleDeleteProductLineAction = async (id: any) => {
    // const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines/${id}`,
      method: 'DELETE',
      // headers: {
      //   Authorization: `Bearer ${session?.user?.access_token}`,
      // },
    });
    revalidateTag('list-product-lines');
    return res;
  };