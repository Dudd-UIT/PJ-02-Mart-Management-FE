import { sendRequest } from '@/utils/api';
import { revalidateTag } from 'next/cache';

export const fetchParameters = async (url: string) => {
  try {
    const res = await sendRequest<IBackendRes<any>>({
      url,
      method: 'GET',
      nextOption: {
        next: { tags: ['list-parameters'] },
      },
    });

    if (res?.data) {
      return res.data;
    } else {
      throw new Error("Data format error: 'data' field is missing.");
    }
  } catch (error) {
    console.error('Fetch suppliers failed:', error);
    throw error;
  }
};

export const handleUpdateParameterAction = async (data: any) => {
  const { id, ...rest } = data; // Separate id from the rest of the data

  // Send the PATCH request to update supplier by ID in the URL path
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/parameters/${id}`, // Include ID directly in the path
    method: 'PATCH',
    body: { ...rest },
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`, // Uncomment if authentication is needed
    // },
  });

  // Revalidate to update the list view if necessary
  //   revalidateTag('list-parameters');

  return res;
};
