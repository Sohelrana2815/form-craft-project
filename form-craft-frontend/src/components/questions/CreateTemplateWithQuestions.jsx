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
  const [tags, setTags] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [accessType, setAccessType] = useState("PUBLIC");
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [questions, setQuestions] = useState([]);

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

    // Upload image if selected
    if (selectedFile) {
      try {
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
      } catch (err) {
        console.log("Failed to create template:", err);
      } finally {
        setIsUploading(false);
      }
    }

    // Build payload to create template
    const templateData = {
      title,
      description,
      topicId: selectedTopic,
      tags: selectedTags,
      imageUrl,
      accessType,
      allowedUsers:
        accessType === "RESTRICTED" ? allowedUsers.map((u) => u.id) : [],
    };

    try {
      // 1) Create template
      const templateRes = await axiosSecure.post("/templates", templateData);

      // Template ID
      const templateId = templateRes.data.template.id;

      // 2) Prepare questions data

      const formattedQuestions = questions.map((q, idx) => {
        const base = {
          title: q.title,
          description: q.description,
          type: q.type,
          order: idx + 1,
          showInList: q.showInList,
        };

        if (q.type === "CHOICE") {
          return {
            ...base,
            allowMultiple: false,
            options: q.options.filter((opt) => opt),
          };
        }
        return base;
      });

      // 3) Create questions under the new template

      if (templateId) {
        setIsUploading(true);
        await axiosSecure.post(`/templates/${templateId}/questions`, {
          questions: formattedQuestions,
        });
      }

      toast.success("📃 Template created with questions successfully!", {
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
    } catch (err) {
      console.error("Creation failed:", err);
      toast.error("Failed to create template or questions.");
    } finally {
      setIsUploading(false);
    }
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
          {isUploading ? (
            <span className="loading loading-bars loading-md"></span>
          ) : (
            "Create Template"
          )}
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
      <QuestionsManager questions={questions} onQuestionChange={setQuestions} />

      <ToastContainer />
    </Box>
  );
}
