import { Link, Navigate, useNavigate } from "react-router";
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
      const userCredential = await createUser(email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      // Ready data to send to the backend
      // Add uid as well in data

      const userData = {
        ...data,
        uid: user.uid,
      };

      if (user) {
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
        console.log(response.data);
        console.log("Current user:", userCredential);
        console.log("User created successfully:", user);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content w-full ">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
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

              <button type="submit" className="btn bg-blue-600 text-white mt-4">
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
