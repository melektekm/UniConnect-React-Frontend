import React, { useState } from "react";
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
function CourseMaterial() {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [creditHours, setCreditHours] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleUploadCourse = async () => {
    // Check if any of the input fields are empty
    if (
      !courseCode ||
      !courseName ||
      !courseDescription ||
      !creditHours ||
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
        course_code: courseCode,
        course_name: courseName,
        course_description: courseDescription,
        credit_hours: creditHours,
        year: year,
        semester: semester,
      };

      const response = await axios.post(`${BASE_URL}/upload-course`, courseData);

      if (response.data) {
        setErrorMessage("Course uploaded successfully!");
        setOpen(true);
      } else {
        setErrorMessage("Failed to upload course. Please try again.");
        setOpen(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred while uploading the course.");
      setOpen(true);
    } finally {
      setLoading(false);
    }
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
            <Card>
              <MDBox
                mx={2}
                mt={-3}
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
              <CardContent>
                <MDBox pt={2} pb={2} px={2}>
                  <MDBox component="form" role="form">
                    <MDBox mb={1}>
                      <MDInput
                        type="text"
                        label="Course Code"
                        variant="outlined"
                        fullWidth
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
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
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
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
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        margin="normal"
                        required
                      />
                    </MDBox>
                    <MDBox mb={1}>
                      <MDInput
                        type="number"
                        label="Credit Hours"
                        variant="outlined"
                        fullWidth
                        value={creditHours}
                        onChange={(e) => setCreditHours(e.target.value)}
                        margin="normal"
                        required
                      />
                    </MDBox>
                    <MDBox mb={1}>
                      <MDInput
                        type="number"
                        label="Year"
                        variant="outlined"
                        fullWidth
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        margin="normal"
                        required
                      />
                    </MDBox>
                    <MDBox mb={1}>
                      <MDInput
                        type="number"
                        label="Semester"
                        variant="outlined"
                        fullWidth
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        margin="normal"
                        required
                      />
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

export default CourseMaterial;
