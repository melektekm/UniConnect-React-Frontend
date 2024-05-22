import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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

function UploadCourse() {
  const [course_code, setcourse_code] = useState("");
  const [course_name, setcourse_name] = useState("");
  const [course_description, setcourse_description] = useState("");
  const [credit_hours, setcredit_hours] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  const handleUploadCourse = async () => {
    if (
      !course_code ||
      !course_name ||
      !course_description ||
      !credit_hours ||
      !year ||
      !semester
    ) {
      setErrorMessage("Please fill in all the fields.");
      setOpen(true);
      return;
    }

    setLoading(true);
    try {
      const courseData = {
        course_code: course_code,
        course_name: course_name,
        course_description: course_description,
        credit_hours: credit_hours,
        year: year,
        semester: semester,
      };

      const response = await axios.post(
        `${BASE_URL}/upload-course`,
        JSON.stringify(courseData),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        resetState();
        setErrorMessage("Course uploaded successfully!");
        setOpen(true);
      } else {
        setErrorMessage("Failed to upload course. Please try again.");
        setOpen(true);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error status code:", error.response.status);
      } else {
        console.error("An error occurred while uploading the course:", error.message);
      }
      setErrorMessage("An error occurred while uploading the course.");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setcourse_code("");
    setcourse_description("");
    setcourse_name("");
    setcredit_hours("");
    setYear("");
    setSemester("");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Sidenav />
      <MainDashboard />
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
                Upload Course
              </MDTypography>
            </MDBox>
            <Card>
              <CardContent>
                <MDBox pt={2} pb={2} px={2}>
                  <MDBox component="form" role="form">
                    <MDBox mb={1}>
                      <MDInput
                        type="text"
                        label="Course Code"
                        variant="outlined"
                        fullWidth
                        value={course_code}
                        onChange={(e) => setcourse_code(e.target.value)}
                        margin="normal"
                        required
                      />
                    </MDBox>
                    <MDBox mb={1}>
                      <MDInput
                        type="text"
                        label="Course Name"
                        variant="outlined"
                        fullWidth
                        value={course_name}
                        onChange={(e) => setcourse_name(e.target.value)}
                        margin="normal"
                        required
                      />
                    </MDBox>
                    <MDBox mb={1}>
                      <MDInput
                        type="text"
                        label="Course Description"
                        variant="outlined"
                        fullWidth
                        value={course_description}
                        onChange={(e) => setcourse_description(e.target.value)}
                        margin="normal"
                        required
                      />
                    </MDBox>
                    <MDBox mb={1}>
                      <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Credit Hours</InputLabel>
                        <Select
                          value={credit_hours}
                          onChange={(e) => setcredit_hours(e.target.value)}
                          label="Credit Hours"
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                          <MenuItem value={4}>4</MenuItem>
                        </Select>
                      </FormControl>
                    </MDBox>
                    <MDBox mb={1}>
                      <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Year</InputLabel>
                        <Select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          label="Year"
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                          <MenuItem value={4}>4</MenuItem>
                        </Select>
                      </FormControl>
                    </MDBox>
                    <MDBox mb={1}>
                      <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel>Semester</InputLabel>
                        <Select
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          label="Semester"
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                        </Select>
                      </FormControl>
                    </MDBox>
                    <MDBox mt={2} mb={1} textAlign="center">
                      <MDButton color="primary" onClick={handleUploadCourse}>
                        {loading ? <CircularProgress /> : "Upload Course"}
                      </MDButton>
                    </MDBox>
                  </MDBox>
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

export default UploadCourse;
