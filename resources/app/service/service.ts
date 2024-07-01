import axios from "axios";

export const BASE_URL = "/api/v1";

const instance = axios.create();

instance.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("userToken");

instance.interceptors.response.use(
  function (response) {
    // Do something with the response data
    // For example, you can modify the response data or handle errors globally
    if(response.status == 401) window.location.href = "/signin"
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default instance;
