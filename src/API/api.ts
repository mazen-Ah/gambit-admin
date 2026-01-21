import { axiosInstance } from '../config/axiosConfig';

export const generalDelete = async (route: string) => {
  const response = await axiosInstance.delete(route);
  return response;
};

export const generalCreate = async (props: any) => {
  const { route, values, method } = props;

  const response = await (method === 'put'
    ? axiosInstance.put(route, values)
    : method === 'patch'
      ? axiosInstance.patch(route, values)
      : axiosInstance.post(route, values));
  return response;
};

export const generalGet = async (route: string): Promise<any> => {
  const response = await axiosInstance.get(route);
  return response;
};

export const generalToggleStatus = async (route: string, post?: boolean) => {
  let response = post ? await axiosInstance.post(route, {}) : await axiosInstance.patch(route, {});
  return response;
};

export const generalPut = async (route: string, data: any): Promise<any> => {
  const response = await axiosInstance.put(route, data);
  return response;
};
