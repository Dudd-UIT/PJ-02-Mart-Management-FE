'use server'

import { ProductSample } from "@/types/productSample";
import { sendRequest } from "@/utils/api";
import { revalidateTag } from "next/cache";


export const fetchProductSamples = async (
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
        next: { tags: ['list-product-samples'] },
      },
    });

    if (res?.data) {
      // console.log("res.data:::", res.data);
      return res.data;
    } else {
      throw new Error("Data format error: 'data' field is missing.");
    }
  } catch (error) {
    console.error('Fetch product samples failed:', error);
    throw error;
  }
};

export const fetchProductSamplesByProductType = async (
  url: string,
  productTypeId: number | null,
  searchName: string = "",
  productLineId: number | null = null,
  searchProductType: number | null = null
) => {
  const params = new URLSearchParams();

  if (productTypeId) {
    params.append('productTypeId', productTypeId.toString());  
  }

  if (searchName) {
    params.append('name', searchName); 
  }

  if (productLineId) {
    params.append('productLineId', productLineId.toString());
  }

  if (searchProductType) {
    params.append('searchProductType', searchProductType.toString());
  }

  const finalUrl = `${url}?${params.toString()}`;
  console.log("Final URL with params:", finalUrl);

  const res = await sendRequest<IBackendRes<{ results: ProductSample[] }>>({
    url: finalUrl,
    method: 'GET',
    queryParams: params,
    nextOption: {
      next: {tags: ['list-product-samples']}
    }
  });

  console.log("response:::", res);

  return res?.data;
};

export const fetchProductSampleUnits = async (
  url: string,
  current: number,
  pageSize: number,
  productUnitIds?: number[],
) => {
  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url,
      method: 'POST',
      queryParams,
      body: { productUnitIds },
      nextOption: {
        next: { tags: ['list-product-sample-units'] },
      },
    });

    if (res?.data) {
      return res.data;
    } else {
      throw new Error("Data format error: 'data' field is missing.");
    }
  } catch (error) {
    console.error('Fetch productSampleUnits failed:', error);
    throw error;
  }
};

export const handleCreateProductSampleAction = async (data: any) => {
  // const session = await auth();
  console.log("data:::", data);
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

export const handleUpdateProductSampleAction = async (data: any) => {

  const { id, ...rest } = data;

  console.log("data update product sample:::", data);

  // Send the PATCH request to update supplier by ID in the URL path
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

export const handleDeleteProductSampleAction = async (id: any) => {
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