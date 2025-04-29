import { Link } from "react-router";
import { useNavigate } from "react-router";

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useMyTemplates from "../../../hooks/useMyTemplates";
import { formatDistanceToNow } from "date-fns";
//------------------------------------------------//
const TemplateList = () => {
  const navigate = useNavigate();
  const { templates, isLoading, isError, error } = useMyTemplates();

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "title",
      headerName: "Title",
      width: 200,
      renderCell: (params) => {
        <Link
          to={`/templates/${params.row.id}`}
          style={{
            textDecoration: "underline",
            color: "#1976d2",
            cursor: "pointer",
          }}
        >
          {params.value}
        </Link>;
      },
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
  if (isLoading) return <Typography>Loading templates...</Typography>;

  if (isError)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ height: 600, width: "100%", p: 4 }}>
      <DataGrid
        rows={templates || []}
        columns={columns}
        getRowId={(row) => row.id}
        onRowClick={(params) => navigate(`/templates/${params.row.id}`)}
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
