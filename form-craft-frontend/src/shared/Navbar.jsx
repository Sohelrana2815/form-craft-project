import { Link, NavLink } from "react-router";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
const Navbar = () => {
  const { user, loading: authLoading, logOut } = useAuth();

  const handleLogout = () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await logOut();
          Swal.fire({
            title: "Logged out!",
            text: "You have successfully logout!",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.error("Error logout:", error);
    }
  };

  const navLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {user ? (
        ""
      ) : (
        <li>
          <NavLink to="sign-up">Sign up</NavLink>
        </li>
      )}
      {user ? (
        ""
      ) : (
        <li>
          <NavLink to="login">Login</NavLink>
        </li>
      )}
      <li>
        <NavLink to="manage-users">Manage users</NavLink>
      </li>
    </>
  );

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navLinks}
            </ul>
          </div>
          <Link to="/">
            <p className="btn btn-ghost text-xl">Form Craft</p>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navLinks}</ul>
        </div>
        <div className="navbar-end">
          {user && (
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
