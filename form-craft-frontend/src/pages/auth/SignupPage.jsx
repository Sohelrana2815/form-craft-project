import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { updateProfile } from "firebase/auth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const SignupPage = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const { createUser, logOut } = useAuth();

  const logOutUser = async () => {
    await logOut();
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
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

      // Step 2: Proceed to create Firebase account ONLY if no conflict
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

  return (
    <div className="hero bg-base-200 min-h-screen dark:bg-[#121212] dark:text-black">
      <div className="hero-content w-full ">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl  ">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <h2 className="text-center text-2xl font-semibold">Sign up</h2>
            <fieldset className="fieldset">
              <label className="fieldset-label">Name</label>
              <input
                {...register("name", { required: true })}
                type="text"
                className="input w-full focus:outline-none focus:border-blue-500"
                placeholder="Name"
              />
              {errors.name && (
                <span className="text-red-600">Name is required</span>
              )}
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

              <button
                type="submit"
                className="btn bg-blue-600 text-white mt-4 border-none"
              >
                Sign Up
              </button>
            </fieldset>
            <p className="text-center text-[14px]">
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
