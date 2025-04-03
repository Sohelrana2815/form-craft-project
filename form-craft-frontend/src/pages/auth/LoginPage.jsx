import { Link } from "react-router";

const LoginPage = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content w-full ">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body">
            <h2 className="text-center text-2xl font-semibold">Login</h2>
            <fieldset className="fieldset">
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
