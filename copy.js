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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

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

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const accessToken = userData.accessToken;

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/courses?page=${current_page}&year=${selectedYear}&semester=${selectedSemester}`,
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
  }, [current_page, selectedYear, selectedSemester]);

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
        `${BASE_URL}/enroll/${selectedCourse.id}`,
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

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
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
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                >
                  <FormControl variant="outlined" style={{ minWidth: 120 }}>
                    <InputLabel>Year</InputLabel>
                    <Select
                      value={selectedYear}
                      onChange={handleYearChange}
                      label="Year"
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                      <MenuItem value="4">4</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined" style={{ minWidth: 120 }}>
                    <InputLabel>Semester</InputLabel>
                    <Select
                      value={selectedSemester}
                      onChange={handleSemesterChange}
                      label="Semester"
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>{course.course_code}</TableCell>
                          <TableCell>{course.course_name}</TableCell>
                          <TableCell>{course.credit_hours}</TableCell>
                          <TableCell>{course.year}</TableCell>
                          <TableCell>{course.semester}</TableCell>
                          <TableCell>{course.course_description}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
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
                <Box display="flex" justifyContent="center" p={2}>
                  <Pagination
                    count={lastPage}
                    page={current_page}
                    onChange={(event, page) => setCurrentPage(page)}
                    color="primary"
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
        <Modal open={open} onClose={handleCloseModal}>
          <Dialog open={open} onClose={handleCloseModal}>
            <DialogTitle>Course Details</DialogTitle>
            <DialogContent>
              {selectedCourse && (
                <>
                  <DialogContentText>
                    <strong>Course Code:</strong> {selectedCourse.course_code}
                    <br />
                    <strong>Course Name:</strong> {selectedCourse.course_name}
                    <br />
                    <strong>Credit Hours:</strong> {selectedCourse.credit_hours}
                    <br />
                    <strong>Year:</strong> {selectedCourse.year}
                    <br />
                    <strong>Semester:</strong> {selectedCourse.semester}
                    <br />
                    <strong>Description:</strong>{" "}
                    {selectedCourse.course_description}
                  </DialogContentText>
                </>
              )}
              {errorMessage && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEnrollCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={handleEnrollConfirm} color="primary">
                Enroll
              </Button>
            </DialogActions>
          </Dialog>
        </Modal>
      </div>
    </div>
  );
}

export default ViewCourses;
