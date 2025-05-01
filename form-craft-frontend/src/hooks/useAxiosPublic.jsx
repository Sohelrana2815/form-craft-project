import axios from "axios";
const axiosPublic = axios.create({
  baseURL: "https://form-craft-backend.onrender.com/api",
});
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
