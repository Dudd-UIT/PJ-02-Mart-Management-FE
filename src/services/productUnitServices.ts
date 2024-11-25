'use server';

import { sendRequest } from "@/utils/api";
import { revalidateTag } from "next/cache";

export const handleCreateProductUnitAction = async (data: any) => {
    // const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-units`,
      method: 'POST',
      // headers: {
      //   Authorization: `Bearer ${session?.user?.access_token}`,
      // },
      body: { ...data },
    });
    revalidateTag('list-product-units');
  
    return res;
  };