import axios from 'axios';
import Cookies from 'js-cookie';
import { store } from '../../redux/store'; 
import { logout } from '../../redux/slice/AuthSlice'; 

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9080/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Before removing cookie:", Cookies.get("token"));
      Cookies.remove("token", { path: "/", domain: "localhost" });
      console.log("After removing cookie:", Cookies.get("token"));
      store.dispatch(logout());
      console.log("Token expired or unauthorized, logging out...");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

