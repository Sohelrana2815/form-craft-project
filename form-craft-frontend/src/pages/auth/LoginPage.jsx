import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { LuEyeClosed } from "react-icons/lu";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
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
    formState: { errors, isSubmitting },
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
        console.log("login page:", response.data);

        if (response.data) {
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

  // Password visibility handler

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="hero bg-base-200 min-h-screen dark:bg-[#121212] dark:text-black">
      <div className="hero-content w-full px-4">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body p-4">
            <h2 className="text-center text-2xl font-semibold">Login</h2>
            <fieldset className="fieldset space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="Email"
                />
                {errors.email && (
                  <span className="text-red-600 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                    })}
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pr-10"
                    placeholder="Password"
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    type="button"
                  >
                    {showPassword ? (
                      <FaRegEye className="text-lg" />
                    ) : (
                      <LuEyeClosed className="text-lg" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-600 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button type="submit" className="btn btn-primary mt-4">
                {isSubmitting ? "Login..." : "Login"}
              </button>
            </fieldset>
            <p className="text-center text-sm mt-4">
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
