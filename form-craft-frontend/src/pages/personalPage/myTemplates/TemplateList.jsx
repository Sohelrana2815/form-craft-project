import { useNavigate } from "react-router";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useMyTemplates from "../../../hooks/useMyTemplates";
import { formatDistanceToNow } from "date-fns";
import TemplateToolbar from "../../../components/toolbar/TemplateToolbar";
import { useState } from "react";
import { useTheme } from "../../../providers/ThemeProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Bounce, toast, ToastContainer } from "react-toastify";

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
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { templates, isLoading, isError, error } = useMyTemplates();
  const [selectedIds, setSelectedIds] = useState([]);
  const queryClient = useQueryClient();
  console.log("My selected ids:", selectedIds);

  // Delete mutation function

  const deleteMutation = useMutation({
    mutationFn: (templateIds) =>
      axiosSecure.delete("/templates", { data: { templateIds } }),
    onSuccess: () => {
      toast.success("Deleted successfully!", {
        position: "top-right",
        theme: "dark",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        transition: Bounce,
      });
      queryClient.invalidateQueries(["templates"]);
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error("Error delete templates.");

      toast.error(error.response?.data?.error, {
        autoClose: 1500,
      });
    },
  });

  const deleteTemplate = () => {
    deleteMutation.mutate(selectedIds);
  };

  if (isLoading) return <Typography>Loading templates...</Typography>;

  if (isError)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <>
      <TemplateToolbar
        onDelete={deleteTemplate}
        actionDisabled={selectedIds.length === 0}
        // Get selected templates only
        // selectedTemplates={templates.filter((template) =>
        //   selectedIds.includes(template.id)
        // )}
      />
      <Box className="p-4 max-w-6xl mx-auto" sx={{ height: 600 }}>
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
        <ToastContainer />
      </Box>
    </>
  );
};

export default TemplateList;
