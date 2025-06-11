// import {
//   Box,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import useAxiosPublic from "../../hooks/useAxiosPublic";
// import { useEffect, useState } from "react";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// export default function CreateTemplateWithQuestions() {
//   const axiosPublic = useAxiosPublic();
//   const [topics, setTopics] = useState([]);
//   const [tags, setTags] = useState([]);

//   // form state
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedTopic, setSelectedTopic] = useState("");
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [topicsRes, tagsRes] = await Promise.all([
//           axiosPublic.get("/topics"),
//           axiosPublic.get("/tags"),
//         ]);
//         setTopics(topicsRes.data);
//         setTags(tagsRes.data.map((t) => t.name));
//       } catch (err) {
//         console.error("Failed to fetch topics or tags:", err);
//       }
//     };
//     fetchData();
//   }, [axiosPublic]);

//   const handleFileChange = (e) => {
//     const picked = e.target.files?.[0] || null;
//     setFile(picked);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Title:", title);
//     console.log("Description:", description);
//     console.log("Selected Topic ID:", selectedTopic);
//     console.log("Image File:", file);
//     // here you can send to server
//   };

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{
//         mt: 4,
//         maxWidth: 600,
//         mx: "auto",
//         display: "flex",
//         flexDirection: "column",
//         gap: 2,
//       }}
//     >
//       <TextField
//         label="Title"
//         variant="outlined"
//         fullWidth
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <TextField
//         label="Description"
//         variant="outlined"
//         fullWidth
//         multiline
//         rows={3}
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />

//       <Button
//         variant="outlined"
//         fullWidth
//         component="label"
//         endIcon={<CloudUploadIcon />}
//       >
//         Upload Cover Image
//         <input type="file" accept="image/*" hidden onChange={handleFileChange} />
//       </Button>

//       <FormControl fullWidth>
//         <InputLabel id="topic-label">Topic</InputLabel>
//         <Select
//           labelId="topic-label"
//           id="topic-select"
//           label="Topic"
//           value={selectedTopic}
//           onChange={(e) => setSelectedTopic(e.target.value)}
//         >
//           <MenuItem value="">
//             <em>None</em>
//           </MenuItem>
//           {topics.map((topic) => (
//             <MenuItem key={topic.id} value={topic.id}>
//               {topic.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <Button type="submit" variant="contained" color="primary">
//         Create Template
//       </Button>
//     </Box>
//   );
// }
