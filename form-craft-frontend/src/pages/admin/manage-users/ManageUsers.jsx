import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

import Toolbar from "./Toolbar";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

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
      queryClient.invalidateQueries(["users"]); // Refresh data
      setSelectedIds([]); // Clear selection
    },
  });

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "created_at",
      headerName: "User Since",
      width: 250,
    },
    {
      field: "last_login",
      headerName: "Last seen",
      width: 250,
    },
    {
      field: "role",
      headerName: "Role",
      width: 200,
    },
    {
      field: "is_blocked",
      headerName: "Blok status",
      width: 200,
    },
  ];

  // Delete selected users
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      console.log("No user selected");
      return;
    }
    deleteMutation.mutate(selectedIds);
  };

  if (isLoading) {
    return <p className="loading loading-dots loading-xl text-blue-700"></p>;
  }

  if (isError) {
    return <p>Error Loading users: {error.message}</p>;
  }

  return (
    <>
      <Toolbar
        onDelete={handleDelete}
        deleteDisabled={selectedIds.length === 0}
      />

      {/* Replace the table with MUI DataGrid */}

      <div className="p-4">
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection
          rowSelectionModel={selectedIds}
          onRowSelectionModelChange={(newSelection) => {
            setSelectedIds(newSelection);
          }}
        />
      </div>
    </>
  );
};

export default ManageUsers;
