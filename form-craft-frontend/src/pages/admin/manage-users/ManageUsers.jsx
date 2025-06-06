import { useMutation, useQueryClient } from "@tanstack/react-query";

import Toolbar from "./Toolbar";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
// date-fns
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "../../../providers/ThemeProvider";
import useUsers from "../../../hooks/useUsers";
// ------------------------------ IMPORT ----------------------------------//
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
    renderCell: (params) => {
      if (!params.value) {
        return "N/A";
      }
      const date = new Date(params.value);
      return formatDistanceToNow(date, { addSuffix: true });
    },
  },
  {
    field: "lastLogin",
    headerName: "Last seen",
    width: 250,
    renderCell: (params) => {
      if (!params.value) {
        return "N/A";
      }
      const date = new Date(params.value);
      return formatDistanceToNow(date, { addSuffix: true });
    },
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
  // Theme
  const { isDark } = useTheme();
  const axiosSecure = useAxiosSecure();
  const [selectedIds, setSelectedIds] = useState([]);
  const queryClient = useQueryClient();
  const { data: users = [], isError, error } = useUsers();

  console.log(selectedIds);

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
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              color: isDark ? "#fff !important" : "#000 !important",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
              "&:hover, &:focus": {
                backgroundColor: isDark ? "#383838" : "#e0e0e0",
              },
            },
            "& .MuiDataGrid-menuIcon": {
              color: isDark ? "#fff" : "#000",
            },
            "& .MuiDataGrid-sortIcon": {
              color: isDark ? "#fff" : "#000",
            },
            "& .MuiDataGrid-columnSeparator": {
              color: isDark ? "#666" : "#e0e0e0",
            },
            color: isDark ? "#fff" : "#000",
            backgroundColor: isDark ? "#121212" : "#fff",
            borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#e0e0e0",
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
              },
            },
          }}
        />
      </div>
    </>
  );
};

export default ManageUsers;
