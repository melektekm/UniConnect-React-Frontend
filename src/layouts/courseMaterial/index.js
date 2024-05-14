import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import AdminNavbar from "../../examples/Navbars/AdminNavbar";
import Footer from "../../examples/Footer";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import { BASE_URL } from "../../appconfig";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import colors from "../../assets/theme/base/colors";
import FormControl from "@mui/material/FormControl"; // Import FormControl
import InputLabel from "@mui/material/InputLabel"; // Import InputLabel
import Select from "@mui/material/Select"; // Import Select
import MenuItem from "@mui/material/MenuItem"; // Import MenuItem

function AddCourseMaterial() {
  const [courses, setCourses] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken; // Assuming accessToken is available in user data
  const [formValues, setFormValues] = useState({
    course_code: "",
    materialTitle: "",
    materialDescription: "",
    file: null,
});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-all-courses`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass accessToken in headers
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

  const handleUploadMaterial = async () => {
    // Check if any of the input fields are empty
    const newErrorMessages = {
      course_code: formValues.course_code ? "" : "Course is required",
      materialTitle: formValues.materialTitle ? "" : "Title is required",
    };

    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("All fields should be filled");
      setOpen(true);
      return;
    }

    setLoading(true);
    try {
      const materialData = {
        code: formValues.course_code,
        title: formValues.materialTitle,
        description: formValues.materialDescription,
        file: formValues.file, // Assuming you want to send the file name only
      };

      const response = await axios.post(
        `${BASE_URL}/upload-material`,
        materialData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setErrorMessage("Material uploaded successfully!");
        setOpen(true);
      } else {
        setErrorMessage("Failed to upload material. Please try again.");
        setOpen(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred while uploading the material.");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFormValues({ ...formValues, file: selectedFile });
    setFile(selectedFile); // Set the file in the state
  };
  const fileInputStyle = {
    display: "inline-block",
    cursor: "pointer",
    padding: "10px 20px",
    backgroundColor: colors.dark.main,
    color: "white",
    borderRadius: "5px",
    border: "1px solid #007bff",
  };

  return (
    <DashboardLayout>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Message"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpen(false)} color="primary" autoFocus>
            Close
          </MDButton>
        </DialogActions>
      </Dialog>
      {/* <AdminNavbar /> */}
      <DashboardNavbar />
      <Sidenav />
      <MainDashboard />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={2}
              mb={2}
              py={3}
              px={2}
              variant="gradient"
              bgColor="dark"
              borderRadius="lg"
              coloredShadow="info"
              textAlign="center"
            >
              <MDTypography variant="h5" color="white">
                Add Course Material
              </MDTypography>
            </MDBox>
            <Card>
              <CardContent>
                <MDBox mb={2}>
                  <FormControl variant="outlined" fullWidth style={{ marginTop: "16px" }}>
                    <InputLabel htmlFor="course">Course</InputLabel>
                    <Select
                      value={formValues.course_code}
                      onChange={(e) =>
                        setFormValues({ ...formValues, course_code: e.target.value })
                      }
                      label="Course"
                      inputProps={{
                        name: "course_code",
                        id: "course",
                      }}
                      style={{ minHeight: "45px" }}
                    >
                      <MenuItem value="">Select Course</MenuItem>
                      {courses.map((course) => (
                        <MenuItem key={course.id} value={course.code}>
                          {course.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </MDBox>
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Material Title"
                        variant="outlined"
                        fullWidth
                        value={formValues.materialTitle}
                        onChange={(e) => setFormValues({ ...formValues, materialTitle: e.target.value })}
                        margin="normal"
                        required
                      />
                    </MDBox>
                    <MDBox mb={1}>
                      <MDInput
                        type="text"
                        label="Material Description"
                        variant="outlined"
                        fullWidth
                        value={formValues.materialDescription}
                        onChange={(e) => setFormValues({ ...formValues, materialDescription: e.target.value })}
                        margin="normal"
                        required
                      />
                    </MDBox>
                    <MDBox mb={2} style={{ display: 'flex', alignItems: 'center' }}>
                      <label htmlFor="fileUpload" style={fileInputStyle}>
                        <input
                          type="file"
                          id="fileUpload"
                          accept="application/pdf"
                          // name="imageUrl"
                          onChange={handleFileUpload}
                          style={{ display: "none" }}
                        />
                        <span>&#128206; {file ? file.name : "Choose File:"}</span>
                      </label>
                      <MDTypography variant="body2" ml={1}>
                        File must be 4 MB in PDF format.
                      </MDTypography>
                    </MDBox>
                    <MDBox mt={2} mb={1} textAlign="center">
                      <MDButton color="primary" onClick={handleUploadMaterial}>
                        {loading ? <CircularProgress /> : "Upload Material"}
                      </MDButton>
                    </MDBox>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AddCourseMaterial;
