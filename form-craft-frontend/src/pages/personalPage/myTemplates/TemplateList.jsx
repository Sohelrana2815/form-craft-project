import { Link } from "react-router";
import { useNavigate } from "react-router";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useMyTemplates from "../../../hooks/useMyTemplates";
import { formatDistanceToNow } from "date-fns";
import TemplateToolbar from "../../../components/toolbar/TemplateToolbar";
import Swal from "sweetalert2";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
//------------------------------------------------//
const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "title",
    headerName: "Title",
    width: 200,
  },
  { field: "tags", headerName: "Tags", width: 200 },
  { field: "topic", headerName: "Topic", width: 200 },
  { field: "accessType", headerName: "Access", width: 200 },
  {
    field: "createdAt",
    headerName: "Created at",
    width: 200,
    renderCell: (params) => {
      if (!params.value) {
        return "N/A";
      }
      const date = new Date(params.value);
      return formatDistanceToNow(date, { addSuffix: true });
    },
  },
];
//----------------------------------//
const TemplateList = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { templates, isLoading, isError, error } = useMyTemplates();
  const [selectedIds, setSelectedIds] = useState([]);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (userIds) =>
      axiosSecure.delete("/templates", { data: { userIds } }),
    onSuccess: () => {
      Swal.fire({
        title: `Deleted ${selectedIds.length} template(s) successfully!`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      queryClient.invalidateQueries(["templates"]);
      selectedIds([]);
    },
  });

  const handleDelete = () => {
    Swal.fire({
      title: `Delete ${selectedIds.length} user(s?)`,
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

  if (isLoading) return <Typography>Loading templates...</Typography>;

  if (isError)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <>
      <TemplateToolbar
        onDelete={handleDelete}
        actionDisabled={selectedIds.length === 0}
      />
      <Box sx={{ height: 600, width: "100%", p: 4 }}>
        <DataGrid
          rows={templates || []}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection
          rowSelectionModel={selectedIds}
          onRowSelectionModelChange={(newSelection) => {
            setSelectedIds(newSelection);
          }}
          onRowClick={(params) => navigate(`/templates/${params.row.id}`)}
          sx={{
            "& .MuiDataGrid-cell": {
              borderRight: "1px solid rgba(224, 224, 224, 0.5)",
            },
          }}
        />
      </Box>
    </>
  );
};

export default TemplateList;
