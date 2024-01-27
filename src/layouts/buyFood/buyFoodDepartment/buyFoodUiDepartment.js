import React, { useState } from "react";
import {
  Grid,
  Card,
  Button,
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../../appconfig"; // Commented out for static courses
import colors from "../../../assets/theme/base/colors";

const staticCourses = [
  { id: 1, name: "Course 1" },
  { id: 2, name: "Course 2" },
  // Add more courses as needed
];

function AssignmentUpload() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken; // Commented out for static response

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(staticCourses); // Use static courses
  const [courseId, setCourseId] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const fileInputStyle = {
    display: "inline-block",
    cursor: "pointer",
    padding: "10px 20px",
    backgroundColor: colors.dark.main,
    color: "white",
    borderRadius: "5px",
    border: "1px solid #007bff",
  };

  useEffect(() => {
    // Fetch courses when the component mounts
    getCourses();
  }, []);
  console.log(accessToken);
  const getCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-all-courses`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data) {
        setCourses(response.data.courses);
      } else {
        setErrorMessage("Failed to fetch courses.");
        setOpen(true);
      }
    } catch (error) {
      setErrorMessage("Error fetching courses: " + error.message);
      setOpen(true);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!courseId || !assignmentName || !dueDate || !file) {
      setNotification({
        type: "error",
        message: "Please fill in all fields.",
      });
      setOpen(true);
      return;
    }

    setLoading(true);

    try {
      setCourses(staticCourses);

      // Your existing code
      const formDataObject = new FormData();
      formDataObject.append("file", file);
      formDataObject.append("course_id", courseId);
      formDataObject.append("assignment_name", assignmentName);
      formDataObject.append("due_date", dueDate);

      const response = await axios.post(
        `${BASE_URL}/upload-assignment`,
        formDataObject,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message) {
        setNotification({
          type: "success",
          message: response.data.message,
        });
        setOpen(true);
        // Reset form fields after successful upload
        setCourseId("");
        setAssignmentName("");
        setDueDate("");
        setFile(null);
        console.log(accessToken);
      } else {
        setNotification({
          type: "error",
          message: "Failed to upload assignment.",
        });
        setOpen(true);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error uploading assignment: " + error.message,
      });
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ flexGrow: 1, padding: "16px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card style={{ padding: "16px" }}>
            <form onSubmit={handleAssignmentSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    style={{ marginTop: "16px" }}
                  >
                    <InputLabel htmlFor="course">Select Course</InputLabel>
                    <Select
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      label="Select Course"
                      inputProps={{
                        name: "courseId",
                        id: "course",
                      }}
                      style={{ height: "46px" }}
                    >
                      {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    required
                    fullWidth
                    label="Assignment Name"
                    value={assignmentName}
                    onChange={(e) => setAssignmentName(e.target.value)}
                    style={{ marginTop: "16px" }}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Assignment Description"
                    value={assignmentDescription}
                    onChange={(e) => setAssignmentDescription(e.target.value)}
                    style={{ marginTop: "16px" }}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Due Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ marginTop: "16px" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box mb={2} style={{ display: "flex", alignItems: "center" }}>
                    <label htmlFor="fileInput" style={fileInputStyle}>
                      <input
                        type="file"
                        id="fileInput"
                        onChange={handleFileChange}
                        accept="application/pdf"
                        style={{ display: "none" }}
                      />
                      <span style={{ fontSize: "16px" }}>
                        &#128206; {file ? file.name : "Choose File"}
                      </span>
                    </label>
                    <Typography variant="body2" ml={1}>
                      File must be 4 MB in PDF format.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <Box mb={1}>
                  {loading ? (
                    <Box textAlign="center">
                      <CircularProgress color="info" />
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      style={{ color: "white" }}
                    >
                      Upload Assignment
                    </Button>
                  )}
                </Box>
              </div>
            </form>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{"Message"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{notification.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            color="light"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AssignmentUpload;
