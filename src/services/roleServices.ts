'use server';

import { auth } from '@/auth';
import { sendRequest } from '@/utils/api';

export const fetchRoles = async (
  current: number,
  pageSize: number,
  searchDescription?: string,
) => {
  const session = await auth();

  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (searchDescription) queryParams.description = searchDescription;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/roles`,
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
    console.error('Fetch suppliers failed:', error);
    throw error;
  }
};

export const handleAssignRoleToGroupAction = async (data: any) => {
  const { groupId, ...rest } = data;
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/groups/assign-roles/${groupId}`,
    method: 'PATCH',
    body: { ...rest },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });

  return res;
};
