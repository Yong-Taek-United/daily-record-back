import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export const api = () => {
    const BASE_URL = process.env.REACT_APP_API_URL;

    const axiosInstance: AxiosInstance = Axios.create({
        baseURL: BASE_URL
    });

    // let access_token = localStorage.getItem('access_token');
    
    // const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    //     config.headers = {
    //       Authorization: !!access_token ? `Bearer ${access_token}` : '',
    //     };
    //     return config;
    // };
    // const onErrorRequest = (err: AxiosError | Error): Promise<AxiosError> => {
    //     return Promise.reject(err);
    // };
    
    // axiosInstance.interceptors.request.use(onRequest, onErrorRequest);

    return axiosInstance;
};