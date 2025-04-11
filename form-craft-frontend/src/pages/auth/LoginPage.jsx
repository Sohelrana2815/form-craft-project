import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const LoginPage = () => {
  const { loginUser } = useAuth();
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const navigate = useNavigate();
  // console.log("location in login page", location);
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;
      if (user) {
        const response = await axiosPublic.patch(`/login/${user?.email}`);
        console.log("login page", response.data.token);
        if (response.data.token) {
          // Set token in LC
          localStorage.setItem("token", response.data.token);
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error("Error login:", error);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content w-full ">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <h2 className="text-center text-2xl font-semibold">Login</h2>
            <fieldset className="fieldset">
              <label className="fieldset-label">Email</label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="input w-full focus:outline-none focus:border-blue-500"
                placeholder="Email"
              />
              {errors.email && (
                <span className="text-red-600">Email is required</span>
              )}
              <label className="fieldset-label">Password</label>
              <input
                {...register("password", { required: true })}
                type="password"
                className="input w-full focus:outline-none focus:border-blue-500"
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-600">Password is required</span>
              )}
              <button type="submit" className="btn bg-blue-600 text-white mt-4">
                Login
              </button>
            </fieldset>
            <p className="text-center text-[14px]">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-blue-600 font-medium">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
