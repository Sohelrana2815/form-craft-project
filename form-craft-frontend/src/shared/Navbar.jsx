import { Link, NavLink } from "react-router";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useTheme } from "../providers/ThemeProvider";
import { IoMdMenu } from "react-icons/io";
import useRole from "../hooks/useRole";
const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logOut, loading: authLoading } = useAuth();
  const { role, isLoading } = useRole();
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
      {role === "admin" && (
        <li>
          <NavLink to="manage-users">Manage users</NavLink>
        </li>
      )}
      {user && (
        <li>
          <NavLink to="personal">Personal Page</NavLink>
        </li>
      )}
    </>
  );
  if (authLoading || isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm dark:bg-gray-800 2xl:px-20">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} className=" mx-3 lg:hidden ">
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
          {/* User profile */}
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-neutral btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  {user?.photoURL ? (
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={user?.photoURL}
                    />
                  ) : (
                    <div className="flex justify-center items-center min-h-full">
                      <p className="font-semibold uppercase">
                        {user?.displayName.charAt(0)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow dark:bg-gray-800 dark:mt-4"
              >
                <Link to="/user-profile">
                  <li className="hover:bg-gray-900">
                    <p className="justify-between">Profile Settings</p>
                  </li>
                </Link>
                <li className="hover:bg-gray-900">
                  {user && <button onClick={handleLogout}>Logout</button>}
                </li>
              </ul>
            </div>
          )}
          {/*  */}
        </div>
      </div>
    </>
  );
};

export default Navbar;
