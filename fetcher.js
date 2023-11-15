import Axios from "axios";

import useSWROrig from "swr";
import useSWRMutationOrig from "swr/mutation";

import { BASE_URL, client_id, client_secret } from "./consts";

export const axios = Axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const ImageAxios = Axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

axios.interceptors.request.use(
  //@ts-ignore
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      return {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${token}` },
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      if (err.response.status === 401) {
        originalConfig._retry = true;

        try {
          const rs = await refreshToken();
          const { access_token, refresh_token } = rs.data;
          window.localStorage.setItem("at", access_token);
          window.localStorage.setItem("rt", refresh_token);

          return axios(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }

      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }

    return Promise.reject(err);
  }
);

const getLocalAccessToken = () => localStorage.getItem("at");

const getLocalRefreshToken = () => localStorage.getItem("rt");

function refreshToken() {
  return axios.post(
    "/o/token/",
    {
      refresh_token: getLocalRefreshToken(),
      client_secret,
      client_id,
      grant_type: "refresh_token",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
}

export const useSWR = (endPoint, options) =>
  useSWROrig(
    endPoint ? [endPoint, options] : null,
    async ([url, options]) =>
      await axios(
        url,
        options
          ? {
              method: options.method || "GET",
              data: options.body,
            }
          : {}
      ).then((res) => res.data)
  );
export const useSWRMutation = (endPoint, method = "POST") =>
  useSWRMutationOrig(
    endPoint,
    async (url, { arg }) =>
      await axios(url, { method, data: arg }).then((r) => r.data)
  );

export const useSWRMutationImage = (endPoint, method = "POST") =>
  useSWRMutationOrig(
    endPoint,
    async (url, { arg }) =>
      await axios(url, { method, data: arg }).then((r) => r)
  );

export const useSWRMutationImageDelete = (endPoint, method = "DELETE") =>
  useSWRMutationOrig(
    endPoint,
    async (url, { arg }) =>
      await axios(url, { method, data: arg }).then((r) => r)
  );
