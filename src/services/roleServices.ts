'use server';

import { sendRequest } from '@/utils/api';
import { revalidateTag } from 'next/cache';

export const fetchRoles = async (
  url: string,
  current: number,
  pageSize: number,
  searchDescription?: string,
) => {
  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (searchDescription) queryParams.description = searchDescription;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url,
      method: 'GET',
      queryParams,
      nextOption: {
        next: { tags: ['list-roles'] },
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

export const handleAssignRoleToGroupAction = async (data: any) => {
  const { groupId, ...rest } = data; // Separate id from the rest of the data

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/groups/assign-roles/${groupId}`, // Include ID directly in the path
    method: 'PATCH',
    body: { ...rest },
    // headers: {
    //   Authorization: `Bearer ${session?.user?.access_token}`, // Uncomment if authentication is needed
    // },
  });

  // Revalidate to update the list view if necessary
  revalidateTag('list-roles');

  return res;
};
