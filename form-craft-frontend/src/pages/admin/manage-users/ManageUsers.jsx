import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import UsersRow from "../manage-users/UsersRow";
import { FaLock, FaTrash, FaUnlock } from "react-icons/fa";

const ManageUsers = () => {
  const axiosPublic = useAxiosPublic();

  // Define the query function to fetch users

  const fetchUsers = async () => {
    const response = await axiosPublic.get("/users");
    return response.data;
  };

  const {
    isLoading,
    isError,
    data: users = [],
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return <p className="loading loading-dots loading-xl text-blue-700"></p>;
  }

  if (isError) {
    return <p>Error Loading users: {error.message}</p>;
  }

  return (
    <>
      {/* Toolbar */}
      <div className="bg-base-200 max-w-sm m-6">
        <div className="flex items-center gap-4 p-3">
          <button className="flex items-center btn btn-sm bg-warning">
            Block
            <FaLock />
          </button>
          <button className="flex items-center btn btn-sm bg-green-500 text-white">
            <FaUnlock />
          </button>
          <button className="flex items-center btn btn-sm bg-red-600 text-white">
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto 2xl:max-w-[1600px] xl:max-w-7xl lg:max-w-6xl mx-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>
                <label>
                  <input type="checkbox" className="checkbox checkbox-sm" />
                </label>{" "}
                Name
              </th>
              <th>Email</th>
              <th>User since</th>
            </tr>
          </thead>
          <tbody>
            {/* Map and show user data */}
            {users.map((user, idx) => (
              <UsersRow key={user.id} user={user} idx={idx} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageUsers;
