import { useQuery } from "@tanstack/react-query";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

import { Box, Typography } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import { DataGrid } from "@mui/x-data-grid";

const TemplateList = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const fetchTemplates = async () => {
    const response = await axiosSecure.get("/templates/my-templates");
    return response.data;
  };

  const {
    data: templates,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userTemplates"],
    queryFn: fetchTemplates,
    enabled: !!user,
  });

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "tags", headerName: "Tags", width: 200 },
    { field: "topic", headerName: "Topic", width: 200 },
    { field: "accessType", headerName: "Access", width: 200 },
    { field: "createdAt", headerName: "Created at", width: 200 },
  ];
  if (isLoading) return <Typography>Loading templates...</Typography>;

  if (isError)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ height: 600, width: "100%", p: 4 }}>
      <DataGrid
        rows={templates || []}
        columns={columns}
        getRowId={(row) => row.id}
        sx={{
          "& .MuiDataGrid-cell": {
            borderRight: "1px solid rgba(224, 224, 224, 0.5)",
          },
        }}
      />
    </Box>
  );
};

export default TemplateList;
