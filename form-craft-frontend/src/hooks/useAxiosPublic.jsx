import axios from "axios";
const axiosPublic = axios.create({
  baseURL: "https://form-craft-project.vercel.app/api",
});
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
