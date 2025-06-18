import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaPen, FaRegEye } from "react-icons/fa";
import { Link } from "react-router";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Typography,
  Button,
  Box,
} from "@mui/material";

const MyTemplates = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: templates = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-templates"],
    queryFn: async () => {
      const response = await axiosSecure.get("/templates/mine");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ marginTop: 2 }}>
        Error loading templates. Please try again later.
      </Alert>
    );
  }

  return (
    <div style={{ padding: "1rem" }} className="max-w-7xl mx-auto">
      <Typography variant="h5" gutterBottom>
        My Templates
        <Typography component="span" color="primary" sx={{ ml: 1 }}>
          ({templates.length})
        </Typography>
      </Typography>

      {templates.length === 0 ? (
        <Alert severity="info">
          No templates found. Create your first template to get started.
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Title</strong>
                </TableCell>
                <TableCell>
                  <strong>Created At</strong>
                </TableCell>
                <TableCell>
                  {/* Clicking will go to TemplateDetailTabs page */}
                  <strong>View</strong>
                </TableCell>
                <TableCell>
                  <strong>Edit</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.title}</TableCell>
                  <TableCell>
                    {new Date(template.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {/* View button */}
                    <Link to={`/temp-tabs/${template.id}`}>
                      <Button size="small">
                        <FaRegEye />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/temp-tabs/${template.id}?tab=1`}>
                      <Button>
                        <FaPen />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default MyTemplates;
