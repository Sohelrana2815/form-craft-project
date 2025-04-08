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

  // delete mutation function
  const deleteMutation = useMutation({
    mutationFn: (userIds) =>
      axiosPublic.delete("/users", { data: { ids: userIds } }), // Send array of IDs
    onSuccess: () => {
      // Invalidate the query to remove user from the UI
      queryClient.invalidateQueries(["users"]); // Refresh data
      setSelectedIds([]); // Clear selection
    },
  });
  // block mutation function

  const blockMutation = useMutation({
    mutationFn: (isBlocked) =>
      axiosPublic.patch("/users/block", {
        is_blocked: isBlocked,
        userIds: selectedIds,
      }),
    onSuccess: () => {
      // Invalidate the query to remove user from UI
      queryClient.invalidateQueries(["users"]); // Data refresh
      setSelectedIds([]);
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
      renderCell: (params) => (
        <span className={`${params.value ? "text-red-600" : "text-green-600"}`}>
          {params.value ? "Blocked" : "Active"}
        </span>
      ),
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

  // Block & unblock handler

  const handleBlock = () => blockMutation.mutate(true);
  const handleUnblock = () => blockMutation.mutate(false);

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
        onBlock={handleBlock}
        onUnblock={handleUnblock}
        actionDisabled={selectedIds.length === 0}
      />

      {/* Replace the table with MUI DataGrid */}

      <div className="p-5 lg:max-w-7xl 2xl:max-w-[1600px] mx-auto">
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
