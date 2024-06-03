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
import MainDashboard from "../MainDashboard";
import Footer from "../../examples/Footer";
import MDTypography from "../../components/MDTypography";
import {
  Card,
  Box,
  Button,
  Modal,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
import CoordinatorSidenav from "../../examples/Sidenav/CoordinatorSidenav";
import StudentSidenav from "../../examples/Sidenav/Studentsidenav";
import DeanSidenav from "../../examples/Sidenav/DeanSidenav";
import InstructorSidenav from "../../examples/Sidenav/InstructorSidenav";

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
      const response = await axios.get(
        `${BASE_URL}/courses?page=${current_page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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
      setLoading(true); // Set loading to true while enrolling
      if (!selectedCourse) {
        // Check if selectedCourse is null
        throw new Error("No course selected for enrollment");
      }
      // Update the course status and send it to the backend
      const response = await axios.put(
        `${BASE_URL}/enroll/${id}`,
        {
          status: "enrolled",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data) {
        // After successful enrollment, fetch the updated course list
        fetchCourses();
        setErrorMessage(""); // Reset error message if there was any
        setOpen(false); // Close the enrollment dialog
      } else {
        setErrorMessage("Failed to enroll. Please try again.");
        // Show error message if enrollment failed
      }
    } catch (error) {
      setErrorMessage("Failed to enroll. Please try again.");
      console.error("Error enrolling in the course:", error);
    } finally {
      setLoading(false); // Set loading to false after enrollment attempt
    }
  };

  const handleEnrollCancel = () => {
    setOpen(false);
  };

  return (
    <div style={{ display: "flex" }}>
      {userData.user.role == "coordinator" ? (
        <CoordinatorSidenav />
      ) : userData.user.role == "admin" ? (
        <Sidenav />
      ) : userData.user.role == "student" ? (
        <StudentSidenav />
      ) : userData.user.role == "dean" ? (
        <DeanSidenav />
      ) : (
        <InstructorSidenav />
      )}
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
                          <strong>Description</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell align="center">
                            {course.course_code}
                          </TableCell>
                          <TableCell align="center">
                            {course.course_name}
                          </TableCell>
                          <TableCell align="center">
                            {course.credit_hours}
                          </TableCell>
                          <TableCell align="center">{course.year}</TableCell>
                          <TableCell align="center">
                            {course.semester}
                          </TableCell>
                          <TableCell align="center">
                            {course.course_description}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleViewDetails(course)}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleEnrollConfirm(course)}
                              style={{ marginLeft: 8 }}
                              disabled={!selectedCourse}
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
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={3}
                  >
                    <Typography variant="body1">Loading...</Typography>
                  </Box>
                )}
                {errorMessage && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={3}
                  >
                    <Typography variant="body1" color="error">
                      {errorMessage}
                    </Typography>
                  </Box>
                )}
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p={3}
                >
                  <Pagination
                    count={lastPage}
                    page={current_page}
                    onChange={(event, page) => setCurrentPage(page)}
                    variant="outlined"
                    color="primary"
                  />
                </Box>
                <Footer />
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </div>
      {/* Modal for displaying detailed course information */}
      {/* <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Course Details
          </Typography>
          {selectedCourse && (
            <>
              <Typography variant="body1">
                Course Name: {selectedCourse.course_name}
              </Typography>
              <Typography variant="body1">
                Course Code: {selectedCourse.course_code}
              </Typography>
              <Typography variant="body1">
                Credit Hour: {selectedCourse.credit_hours}
              </Typography>
              <Typography variant="body1">
                Year: {selectedCourse.year}
              </Typography>
              <Typography variant="body1">
                Semester: {selectedCourse.semester}
              </Typography>
              <Typography variant="body1">
                Description: {selectedCourse.course_description}
              </Typography>
            </>
          )}
          <Button variant="contained" onClick={handleCloseModal}>
            Close
          </Button>
        </Box>
      </Modal> */}
      <Dialog open={!!errorMessage} onClose={() => setErrorMessage("")}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorMessage("")} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
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
            <strong>Credit Hour:</strong> {selectedCourse?.credit_hours}
          </DialogContentText>
          <DialogContentText>
            <strong>Year:</strong> {selectedCourse?.year}
          </DialogContentText>
          <DialogContentText>
            <strong>Semester:</strong> {selectedCourse?.semester}
          </DialogContentText>
          <DialogContentText>
            <strong>Description:</strong> {selectedCourse?.course_description}
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
