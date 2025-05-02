import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { updateProfile } from "firebase/auth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useState } from "react";
import Swal from "sweetalert2";
import { LuEyeClosed } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa6";

// ----------------------IMPORT--------------------------//

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const { createUser, logOut } = useAuth();

  const logOutUser = async () => {
    await logOut();
  };
  // React hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { name, email, password } = data;

      // Step 1: Check for conflicts in your database
      const checkResponse = await axiosPublic.post("/check-user", {
        name,
        email,
      });
      if (checkResponse.data.error) {
        throw new Error(checkResponse.data.error);
      }

      // Step 2: Proceed to create Firebase account if no existing user in DB.
      const userCredential = await createUser(email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      // Step 3: Save user data to your database

      const userData = {
        name,
        email,
        uid: user.uid,
      };
      // Step 4: Show success and redirect
      const response = await axiosPublic.post("/signup", userData);
      if (response.data.id) {
        Swal.fire({
          title: "Registered successfully!",
          text: `Login please ${name}.`,
          icon: "success",
          draggable: true,
        });
        logOutUser();
        navigate("/login");
      }
      // Add uid as well in data
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
        <div className="card bg-base-100 w-full max-w-xs shrink-0 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body p-4">
            <h2 className="text-center text-2xl font-semibold">Sign up</h2>
            <fieldset className="fieldset space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Name"
                />
                {errors.name && (
                  <span className="text-red-600 text-sm">Name is required</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="Email"
                />
                {errors.email && (
                  <span className="text-red-600 text-sm">
                    Email is required
                  </span>
                )}
              </div>

              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    {...register("password", { required: true })}
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
                    Password is required
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary mt-4 border-none"
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
              </button>
            </fieldset>
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
