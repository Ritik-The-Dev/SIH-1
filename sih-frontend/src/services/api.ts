import {
  applyForJobApiPath,
  extractTextApiPath,
  getProfileApiPath,
  loginApiPath,
  loginWithGoogleApiPath,
  logoutApiPath,
  myApplicationsApiPath,
  recommendJobApiPath,
  signUpApiPath,
  updateProfileApiPath,
  uploadResumeApiPath,
} from "./apiRoutes";
import { apiCall } from "./axios";

export const loginApi = async (payload: any): Promise<any> => {
  const data = await apiCall<any>("post", `${loginApiPath}`, payload);
  return data;
};

export const loginWithGoogleApi = async (payload: any): Promise<any> => {
  const data = await apiCall<any>("post", `${loginWithGoogleApiPath}`, payload);
  return data;
};

export const logoutApi = async (): Promise<any> => {
  const data = await apiCall<any>("post", `${logoutApiPath}`);
  return data;
};

export const signUpApi = async (payload: any): Promise<any> => {
  const data = await apiCall<any>("post", `${signUpApiPath}`, payload);
  return data;
};

export const updateProfileApi = async (payload: any): Promise<any> => {
  const data = await apiCall<any>("post", `${updateProfileApiPath}`, payload);
  return data;
};

export const getProfileApi = async (): Promise<any> => {
  const data = await apiCall<any>("get", `${getProfileApiPath}`);
  return data;
};

export const recommendApi = async (payload: any): Promise<any> => {
  const data = await apiCall<any>("post", `${recommendJobApiPath}`, payload);
  return data;
};

export const applyForJobApi = async (payload: any): Promise<any> => {
  const data = await apiCall<any>("post", `${applyForJobApiPath}/${payload?.jobId}`, payload);
  return data;
};

export const myApplicationsApi = async (payload: {
  page: number;
  limit: number;
}): Promise<any> => {
  const data = await apiCall<any>("get", `${myApplicationsApiPath}?page=${payload?.page}&limit=${payload?.limit}`);
  return data;
};

export const extractTextApi = async (payload: any): Promise<any> => {
  const data = await apiCall<any>("post", `${extractTextApiPath}`, payload);
  return data;
};

export const uploadResumeApi = async (payload: any): Promise<any> => {
  const data = await apiCall<any>("post", `${uploadResumeApiPath}`, payload);
  return data;
};
