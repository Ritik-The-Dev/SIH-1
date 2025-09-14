import axios, { AxiosError } from "axios";

export const apiCall = async <R, D = {}>(
  method: 'get' | 'post' | 'patch' | 'delete',
  url: string,
  data?: D,
  headers?: Record<string, string>
): Promise<R> => {
  try {
    const config: any = {
      method,
      url,
      data,
      withCredentials: true,
    };

    if (headers) {
      config.headers = headers;
    }

    const response = await axios(config);

    // If backend returns success: false, throw error so React Query onError triggers
    if (response.data.success === true) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Operation failed");
    }
  } catch (err) {
    // Normalize Axios errors
    if (err instanceof AxiosError && err.response) {
      const msg = err.response.data?.message || "Server responded with error";
      throw new Error(msg);
    }
    throw new Error("No Response From Server");
  }
};
