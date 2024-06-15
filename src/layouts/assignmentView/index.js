import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  Box,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import MDBox from "../../components/MDBox";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import MainDashboard from "../../layouts/MainDashboard";
import Footer from "../../examples/Footer";
import MDTypography from "../../components/MDTypography";
import { useNavigate } from "react-router-dom";

function ViewAssignments() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = ipcRenderer.sendSync("get-user");

  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);

  const accessToken = userData.accessToken;

  const navigate = useNavigate();

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getallassignments`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("API Response:", response.data); // Log the API response
      if (response.data && response.data.assignments) {
        setAssignments(response.data.assignments);
        const uniqueCourses = [
          ...new Set(response.data.assignments.map((assignment) => assignment.course_name)),
        ];
        setCourses(uniqueCourses);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
    setLoading(false);
  };

  const filterAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/filterassignments`,
        {
          course_name: selectedCourse,
          searchTerm: searchTerm,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Filtered API Response:", response.data); // Log the filtered API response
      if (response.data && response.data.filteredAssignments) {
        setAssignments(response.data.filteredAssignments);
      }
    } catch (error) {
      console.error("Error filtering assignments:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (selectedCourse || searchTerm) {
      filterAssignments();
    } else {
      fetchAssignments();
    }
  }, [selectedCourse, searchTerm]);

  const handleAssignmentClick = (assignment) => {
    const fileUrl = assignment.uploadedFileUrl;
    console.log("Opening URL:", fileUrl);

    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.error("Invalid file URL");
    }
  };

  const handleChangeCourse = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleChangeSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  function handleSubmitAssignment(assignment) {
    navigate("/submit-assignment", {
      state: {
        assignmentName: assignment.assignmentName,
        courseName: assignment.course_name,
      },
    });
  }

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
                  Assignment List
                </MDTypography>
              </MDBox>
              <Card style={{ marginTop: "20px" }}>
                <Box m={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="course-select-label">Filter by Course</InputLabel>
                        <Select
                          labelId="course-select-label"
                          id="course-select"
                          value={selectedCourse}
                          onChange={handleChangeCourse}
                        >
                          <MenuItem value="">All Courses</MenuItem>
                          {courses.map((course_name) => (
                            <MenuItem key={course_name} value={course_name}>
                              {course_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="search-term"
                        label="Search by Course Name"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleChangeSearchTerm}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <TableContainer
                  component={Paper}
                  elevation={3}
                  style={{ marginTop: 20, marginBottom: 20 }}
                >
                  <Table>
                    <TableBody>
                      <TableRow sx={{ backgroundColor: "#" }}>
                        <TableCell align="center">
                          <strong>Assignment Id</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Assignment Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Assignment Description</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Course Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Due Date</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                      {assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell align="center">{assignment.id}</TableCell>
                          <TableCell align="center">{assignment.assignmentName}</TableCell>
                          <TableCell align="center">{assignment.assignmentDescription}</TableCell>
                          <TableCell align="center">{assignment.course_name}</TableCell>
                          <TableCell align="center">{assignment.dueDate}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleAssignmentClick(assignment)}
                            >
                              View Assignment
                            </Button>
                            <Button
                              variant="contained"
                              color="white"
                              onClick={() => handleSubmitAssignment(assignment)}
                              style={{ marginLeft: "10px" }}
                            >
                              Submit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Footer />
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </div>
    </div>
  );
}

export default ViewAssignments;
