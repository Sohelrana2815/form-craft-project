import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const LoginPage = () => {
  const { loginUser } = useAuth();
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigate user to the desire page

  const from = location.state?.from?.pathname || "/";

  // React hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Destructured
      const { email, password } = data;
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;

      // if login success & got user (update lastLogin)
      if (user) {
        const response = await axiosPublic.patch(`/login/${user?.email}`);
        console.log("login page:", response.data.updateUser);

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      if (error.status === 403) {
        Swal.fire("Blocked", "Your account has been blocked.", "error");
      }
      console.error("Error login:", error);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen dark:bg-[#121212] dark:text-black">
      <div className="hero-content w-full ">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <h2 className="text-center text-2xl font-semibold">Login</h2>
            <fieldset className="fieldset">
              <label className="fieldset-label">Email</label>
              <input
                {...register("email", { required: "Password is required" })}
                type="email"
                className="input w-full focus:outline-none focus:border-blue-500"
                placeholder="Email"
              />
              {errors.email && (
                <span className="text-red-600">{errors.email.message}</span>
              )}
              <label className="fieldset-label">Password</label>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                className="input w-full focus:outline-none focus:border-blue-500"
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-600">{errors.password.message}</span>
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
