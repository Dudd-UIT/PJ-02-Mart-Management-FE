import { sendRequest } from "@/utils/api";

export const fetchUnits = async (
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
          next: { tags: ['list-units'] },
        },
      });
  
      if (res?.data) {
        return res.data;
      } else {
        throw new Error("Data format error: 'data' field is missing.");
      }
    } catch (error) {
      console.error('Fetch units failed:', error);
      throw error;
    }
  };