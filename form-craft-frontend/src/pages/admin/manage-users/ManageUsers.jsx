import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Toolbar from "./Toolbar";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

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
    field: "createdAt",
    headerName: "User Since",
    width: 250,
  },
  {
    field: "lastLogin",
    headerName: "Last seen",
    width: 250,
  },
  {
    field: "role",
    headerName: "Role",
    width: 200,
    renderCell: (params) => (
      <span
        className={`badge ${
          params.value === "admin" ? "badge-primary" : "badge-ghost"
        }`}
      >
        {params.value === "admin" ? "Admin" : "User"}
      </span>
    ),
  },
  {
    field: "isBlocked",
    headerName: "Block Status",
    width: 200,
    renderCell: (params) => (
      <span
        className={`badge ${params.value ? "badge-error" : "badge-success"}`}
      >
        {params.value ? "Blocked" : "Active"}
      </span>
    ),
  },
];

const ManageUsers = () => {
  // // Define the query function to fetch users

  const axiosSecure = useAxiosSecure();
  const [selectedIds, setSelectedIds] = useState([]);
  const queryClient = useQueryClient();
  const fetchUsers = async () => {
    const response = await axiosSecure.get("/users");
    return response.data;
  };
  console.log(selectedIds);

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
      axiosSecure.delete("/users", { data: { userIds } }),
    onSuccess: () => {
      Swal.fire({
        title: `Deleted ${selectedIds.length} user(s) successfully!`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      // Invalidate the old query and fetch users data again
      queryClient.invalidateQueries(["users"]);
      setSelectedIds([]);
    },
  });

  // block mutation function
  const blockMutation = useMutation({
    mutationFn: (isBlocked) =>
      axiosSecure.patch("/users/block", {
        isBlocked: isBlocked,
        userIds: selectedIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setSelectedIds([]);
    },
  });

  // role mutation function

  const roleMutation = useMutation({
    mutationFn: (role) =>
      axiosSecure.patch("/users/role", { role: role, userIds: selectedIds }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setSelectedIds([]);
    },
  });

  // Delete selected users
  const handleDelete = () => {
    Swal.fire({
      title: `Delete ${selectedIds.length} user(s)?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(selectedIds);
      }
    });
  };

  // Block & unblock handler

  const handleBlockUnblock = (isBlocked) => {
    Swal.fire({
      title: `${isBlocked ? "Block" : "Unblock"} ${
        selectedIds.length
      } user(s) `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#34b233",
      cancelButtonColor: "#C70000",
    }).then((result) => {
      if (result.isConfirmed) {
        blockMutation.mutate(isBlocked);
      }
    });
  };
  // Role changing handler

  const handleRoleChange = (role) => {
    Swal.fire({
      title: `Make ${selectedIds.length} person(s) ${role}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#003366",
      cancelButtonColor: "#CF142B", 
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate(role);
      }
    });
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
        onBlock={() => handleBlockUnblock(true)}
        onUnblock={() => handleBlockUnblock(false)}
        onMakeAdmin={() => handleRoleChange("admin")}
        onMakeUser={() => handleRoleChange("user")}
        actionDisabled={selectedIds.length === 0}
        selectedUsers={users.filter((user) => selectedIds.includes(user.id))}
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
