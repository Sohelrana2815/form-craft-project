import { Link } from "react-router";

const SignupPage = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content w-full ">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body">
            <h2 className="text-center text-2xl font-semibold">Sign up</h2>
            <fieldset className="fieldset">
              <label className="fieldset-label">Name</label>
              <input type="text" className="input w-full focus:outline-none focus:border-blue-500" placeholder="Name" />
              <label className="fieldset-label">Email</label>
              <input
                type="email"
                className="input w-full focus:outline-none focus:border-blue-500"
                placeholder="Email"
              />
              <label className="fieldset-label">Password</label>
              <input
                type="password"
                className="input w-full focus:outline-none focus:border-blue-500"
                placeholder="Password"
              />

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
