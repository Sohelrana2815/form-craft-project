import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000/api",
});

const useAxiosSecure = () => {
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
      console.log("AxiosSecure interceptors error:", error);
    }
  );
};

export default useAxiosSecure;
