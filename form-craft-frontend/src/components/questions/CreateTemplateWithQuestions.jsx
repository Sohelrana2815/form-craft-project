import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Bounce, ToastContainer, toast } from "react-toastify";
import QuestionsManager from "./QuestionsManager";
//--------------------IMPORT PART ---------------------//

export default function CreateTemplateWithQuestions() {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [topics, setTopics] = useState([]);
  const [tags, setTags] = useState([]); // Array of string name
  const [isUploading, setIsUploading] = useState(false); // Loading
  const [allUsers, setAllUsers] = useState([]);
  // console.log("All Users:", allUsers);
  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [accessType, setAccessType] = useState("PUBLIC");
  const [allowedUsers, setAllowedUsers] = useState([]);
  // console.log("Topics and Tags:", topics, tags);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, tagsRes, usersRes] = await Promise.all([
          axiosPublic.get("/topics"),
          axiosPublic.get("/tags"),
          axiosPublic.get("/users"),
        ]);
        setTopics(topicsRes.data);
        setTags(tagsRes.data.map((tag) => tag.name));
        setAllUsers(usersRes.data);
      } catch (err) {
        console.error("Failed to fetch topics, tags or users", err);
      }
    };
    fetchData();
  }, [axiosPublic]);

  // File upload

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let imageUrl = null;

    try {
      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", "Image_upload_to_cloudinary");
        data.append("cloud_name", "djmhyrvxd");
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/djmhyrvxd/image/upload",
          { method: "POST", body: data }
        );
        const uploadResult = await response.json();
        imageUrl = uploadResult.url;
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
    const templateData = {
      title: title,
      description: description,
      topicId: selectedTopic,
      tags: selectedTags,
      imageUrl: imageUrl, // Will be null if no file selected
      accessType: accessType,
      allowedUsers:
        accessType === "RESTRICTED" ? allowedUsers.map((u) => u.id) : [],
    };

    const templateRes = await axiosSecure.post("/templates", templateData);
    if (templateRes.data) {
      toast.success("📃 Template created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    console.log("Submitting Data:", templateData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 4,
        maxWidth: 800,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
      }}
    >
      {/* Submit button */}
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button type="submit" variant="contained" color="primary" size="small">
          {isUploading ? "Uploading..." : "Create Template"}
        </Button>
      </Box>
      {/* Title */}
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="Title"
        variant="outlined"
        fullWidth
      />
      {/* Description */}
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
      />

      {/* File upload */}

      <Button
        variant="outlined"
        fullWidth
        component="label"
        endIcon={<CloudUploadIcon />}
        color={selectedFile ? "success" : "primary"}
        disabled={isUploading}
      >
        {selectedFile ? selectedFile.name : "Upload Cover Image"}
        <input
          onChange={handleFileChange}
          type="file"
          accept="image/*"
          hidden
        />
      </Button>

      {/* Topics dropdown */}
      <FormControl>
        <InputLabel id="topic-label">Topic</InputLabel>
        <Select
          labelId="topic-label"
          id="topic-select"
          label="Topic"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>

          {topics.map((topic) => (
            <MenuItem key={topic.id} value={topic.id}>
              {topic.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Tags Autocomplete */}

      <Autocomplete
        id="tags-autocomplete"
        multiple
        freeSolo
        options={tags}
        value={selectedTags}
        onChange={(_, newValue) => {
          setSelectedTags(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Tags"
            placeholder="Select or add tags"
          />
        )}
      />
      {/* ACCESS TYPE RADIO BUTTONS */}
      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <FormLabel component="legend">Access Type</FormLabel>
        <RadioGroup
          row
          value={accessType}
          onChange={(e) => setAccessType(e.target.value)}
        >
          <FormControlLabel
            value="PUBLIC"
            control={<Radio size="small" />}
            label="Public"
          />
          <FormControlLabel
            value="RESTRICTED"
            control={<Radio size="small" />}
            label="Restricted"
          />
        </RadioGroup>
      </FormControl>
      {/* Allowed User (Only when user's select RESTRICTED) */}

      {accessType === "RESTRICTED" && (
        <Autocomplete
          multiple
          options={allUsers}
          getOptionLabel={(u) => `${u.username} (${u.email})`}
          onChange={(_, v) => setAllowedUsers(v)}
          value={allowedUsers}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Allowed Users"
              placeholder="Select users"
              size="small"
            />
          )}
          sx={{ mt: 2 }}
        />
      )}

      <div className="divider">Add Questions</div>
      <QuestionsManager />

      <ToastContainer />
    </Box>
  );
}
