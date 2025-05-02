import { Link, NavLink } from "react-router";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useTheme } from "../providers/ThemeProvider";
import { IoMdMenu } from "react-icons/io";
const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, loading: authLoading, logOut } = useAuth();
  const { userRole } = useAuth();

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
      {userRole === "admin" && (
        <li>
          <NavLink to="manage-users">Manage users</NavLink>
        </li>
      )}
      <li>
        <NavLink to="personal">Personal Page</NavLink>
      </li>
    </>
  );

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm dark:bg-gray-800">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} className=" mx-3 lg:hidden">
              <IoMdMenu className="text-2xl cursor-pointer" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow dark:bg-gray-800"
            >
              {navLinks}
            </ul>
          </div>
          <Link to="/">
            <p className="text-xl">Form Craft</p>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navLinks}</ul>
        </div>
        <div className="navbar-end space-x-4">
          <button
            className="btn btn-xs dark:bg-gray-800 dark:text-white"
            onClick={toggleTheme}
          >
            {isDark ? "🔆 Light" : "🌙 Dark"}
          </button>
          {user && (
            <button
              className="btn dark:bg-primary btn-sm btn-neutral dark:btn-primary dark:text-white border-none"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
