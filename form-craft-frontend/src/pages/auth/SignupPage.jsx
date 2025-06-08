import { Link } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { updateProfile } from "firebase/auth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useState } from "react";
import Swal from "sweetalert2";
import { LuEyeClosed } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa6";
import GoogleSignIn from "./GoogleSignIn";

// ----------------------IMPORT--------------------------//

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const axiosPublic = useAxiosPublic();
  const { createUser } = useAuth();
  // Navigate user to the desire page

  // React hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { fullName, username, email, password } = data;
      console.log("User info:", username, email, password);

      // Step 1: Check for conflicts in your database

      const userCredential = await createUser(email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName });

      // Step 3: Save user data to your database
      const userData = {
        username,
        email,
        uid: user.uid,
      };

      const newUserRes = await axiosPublic.post("/signup", userData);
      console.log(newUserRes.data.user);
      if (newUserRes.data.user) {
        Swal.fire({
          title: "Registered successfully!",
          text: `${username} login please.`,
          icon: "success",
          draggable: true,
        });
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Swal.fire(
          "Email already exist",
          "Use different email address.",
          "error"
        );
        // Backend Errors (Email/Name Conflict)
      } else if (error.response?.data?.error) {
        Swal.fire("Error", error.response.data.error, "error");
      }
      // Generic error
      else {
        Swal.fire("Error", "Something went wrong. Try again.", "error");
      }
      console.error("Error creating user:", error.response.data);
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
            <h2 className="text-center text-2xl font-semibold">Sign up</h2>
            <fieldset className="fieldset space-y-3">
              <div className="form-control">
                <label className="label block my-1">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  {...register("fullName", { required: true })}
                  type="text"
                  className="input input-bordered w-full pr-10 focus:border-blue-700 focus:outline-none"
                  placeholder="Enter your fullname"
                />
                {errors.name && (
                  <span className="text-red-600 text-sm">Name is required</span>
                )}
              </div>

              <div className="form-control">
                <label className="label block my-1">
                  <span className="label-text">Username</span>
                </label>
                <input
                  {...register("username", { required: true })}
                  type="text"
                  className="input input-bordered w-full pr-10 focus:border-blue-700 focus:outline-none"
                  placeholder="Username must be unique"
                />
                {errors.name && (
                  <span className="text-red-600 text-sm">
                    Username is required
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label block my-1">
                  <span className="label-text">Email</span>
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="input w-full pr-10 focus:border-blue-700 focus:outline-none"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <span className="text-red-600 text-sm">
                    Email is required
                  </span>
                )}
              </div>

              <div className="form-control relative">
                <label className="label block my-1">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    {...register("password", { required: true })}
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pr-10 focus:border-blue-700 focus:outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-200 cursor-pointer p-1 rounded-full"
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
                    Password is required
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary mt-4 border-none"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-lg"></span>
                ) : (
                  "Sign up"
                )}
              </button>
            </fieldset>
            {/* Google signIng button */}
            <GoogleSignIn />
            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
