import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import MDBox from "../../components/MDBox";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import MainDashboard from "../../layouts/MainDashboard";
import Footer from "../../examples/Footer";
import MDTypography from "../../components/MDTypography";
import { Card, Box, Button, Modal, Pagination, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

function ViewCourses() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = ipcRenderer.sendSync("get-user");

  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const itemsPerPage = 10; // Set the number of items to display per page
  const [current_page, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const accessToken = userData.accessToken;

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/fetch-course?page=${current_page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data && response.data.courses) {
        setCourses(response.data["courses"]);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.lastPage);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setErrorMessage("Failed to fetch courses.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, [current_page]);

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setOpen(true);
  };

  const handleEnrollConfirm = async () => {
    try {
      // Update the course status and send it to the backend
      const response = await axios.put(`${BASE_URL}/enroll/${selectedCourse.id}`, {
        status: "enrolled",
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data) {
        setSuccessMessage("Enrolled successfully!");
        setDialogOpen(true);
    } else {
        setErrorMessage("Failed to enroll. Please try again.");
        setDialogOpen(true);
    }
    } catch (error) {
      console.error("Error enrolling in the course:", error);
      setDialogOpen(true);
    } finally {
            setLoading(false);
    }
  };

  const handleEnrollCancel = () => {
    setOpen(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidenav />
      <div style={{ marginLeft: "280px", width: "100%", paddingLeft: "20px" }}>
        <DashboardNavbar />
        <MainDashboard />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <MDBox
                mx={2}
                mt={2}
                py={3}
                px={2}
                variant="gradient"
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h4" color="white">
                  Course List
                </MDTypography>
              </MDBox>
              <Card style={{ marginTop: "20px" }}>
                <TableContainer
                  component={Paper}
                  elevation={3}
                  style={{ marginTop: 20, marginBottom: 20 }}
                >
                  <Table>
                    <TableBody>
                      <TableRow sx={{ backgroundColor: "#" }}>
                        <TableCell align={"center"}>
                          <strong>Course Code</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Course Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Credit Hour</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Year</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Semester</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Enroll</strong>
                        </TableCell>
                      </TableRow>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell align="center">{course.course_code}</TableCell>
                          <TableCell align="center">{course.course_name}</TableCell>
                          <TableCell align="center">{course.credit_hour}</TableCell>
                          <TableCell align="center">{course.year}</TableCell>
                          <TableCell align="center">{course.semester}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleEnrollClick(course)}
                            >
                              Enroll
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {loading && (
                  <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                    <Typography variant="body1">Loading...</Typography>
                  </Box>
                )}
                {errorMessage && (
                  <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                    <Typography variant="body1" color="error">
                      {errorMessage}
                    </Typography>
                  </Box>
                )}
                <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                  <Pagination
                    count={lastPage}
                    page={current_page}
                    onChange={(event, page) => setCurrentPage(page)}
                    variant="outlined"
                    color="primary"
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </div>

      {/* Course Details Dialog */}
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Course Code:</strong> {selectedCourse?.course_code}
          </DialogContentText>
          <DialogContentText>
            <strong>Course Name:</strong> {selectedCourse?.course_name}
          </DialogContentText>
          <DialogContentText>
            <strong>Credit Hour:</strong> {selectedCourse?.credit_hour}
          </DialogContentText>
          <DialogContentText>
            <strong>Year:</strong> {selectedCourse?.year}
          </DialogContentText>
          <DialogContentText>
            <strong>Semester:</strong> {selectedCourse?.semester}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEnrollConfirm} color="primary">
            Enroll
          </Button>
          <Button onClick={handleEnrollCancel} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ViewCourses;