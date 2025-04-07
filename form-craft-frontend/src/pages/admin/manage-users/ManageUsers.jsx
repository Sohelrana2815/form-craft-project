import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import UsersRow from "../manage-users/UsersRow";

import Toolbar from "./Toolbar";
import { useState } from "react";

const ManageUsers = () => {
  const axiosPublic = useAxiosPublic();
  const [selectedIds, setSelectedIds] = useState([]);
  const queryClient = useQueryClient();

  console.log(selectedIds);

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

  // mutation function
  const deleteMutation = useMutation({
    mutationFn: (userIds) =>
      axiosPublic.delete("/users", { data: { ids: userIds } }), // Send array of IDs
    onSuccess: () => {
      // Invalidate the query to remove user from the UI
      queryClient.invalidateQueries(["users"]);
      setSelectedIds([]); // Reset selection
    },
  });

  // Disabled delete btn

  const deleteDisabled = selectedIds.length === 0;

  // delete event handler
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      console.log("No user selected");
      return;
    }
    deleteMutation.mutate(selectedIds);
  };

  // Checkbox select handler
  const handleSelect = (userId, isSelected) => {
    console.log(userId, isSelected);

    setSelectedIds((prevId) =>
      isSelected ? [...prevId, userId] : prevId.filter((id) => id !== userId)
    );
  };

  if (isLoading) {
    return <p className="loading loading-dots loading-xl text-blue-700"></p>;
  }

  if (isError) {
    return <p>Error Loading users: {error.message}</p>;
  }

  return (
    <>
      <Toolbar onDelete={handleDelete} deleteDisabled={deleteDisabled} />
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
              <UsersRow
                key={user.id}
                user={user}
                idx={idx}
                onSelect={(isSelected) => handleSelect(user.id, isSelected)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageUsers;
