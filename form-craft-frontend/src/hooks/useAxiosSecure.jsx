import axios from "axios";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "https://form-craft-backend.onrender.com/api",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  const logoutUser = async () => {
    await logOut();
  };

  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.log("Axios secure interceptors error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        logoutUser();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
  return axiosSecure;
};

export default useAxiosSecure;
