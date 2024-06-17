import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Grid,
  Card,
  Box,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import MDBox from "../../components/MDBox";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import InstructorSidenav from "../../examples/Sidenav/InstructorSidenav";
import MainDashboard from "../../layouts/MainDashboard";
import Footer from "../../examples/Footer";
import MDTypography from "../../components/MDTypography";
import { CheckCircle, Cancel, Edit, Delete } from "@mui/icons-material";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import { useNavigate } from "react-router-dom";

function AssignmentsPage() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);

  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getallassignments`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API Response:", response.data); // Log the API response
      if (response.data && response.data.assignments) {
        setAssignments(response.data.assignments);
        const uniqueCourses = [
          ...new Set(
            response.data.assignments.map(
              (assignment) => assignment.course_name
            )
          ),
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
      0;
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

  const fetchFileContent = async (assignmentId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/getassignmentcontent/${assignmentId}`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching file content:", error);
      return null;
    }
  };

  function handleDeleteDialogOpen(id) {
    const assignmentItem = assignments.find(
      (assignmentItem) => assignmentItem.id === id
    );
    setItemToDelete(assignmentItem);
    setDeleteDialogOpen(true);
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  function handleEditAssignment(assignment) {
    navigate("/notify-students", {
      state: {
        assignmentName: assignment.assignmentName,
        courseName: assignment.course_name,
      },
    });
  }
  const handleDeleteAssignment = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/deleteAssignment/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setAssignments(assignments.filter((assignment) => assignment.id !== id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      setErrorMessage("Error deleting assignment");
    }
  };
  const handleAssignmentClick = async (assignment) => {
    const fileContent = await fetchFileContent(assignment.id);
    if (fileContent) {
      const fileURL = URL.createObjectURL(
        new Blob([fileContent], { type: "application/pdf" })
      );
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${assignment.assignmentName}</title>
            </head>
            <body>
              <embed width="100%" height="100%" src="${fileURL}" type="application/pdf">
              <a href="${fileURL}" download="${assignment.assignmentName}.pdf">
                <button>Download</button>
              </a>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        console.error("Failed to open new window");
      }
    }
  };

  const handleChangeCourse = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleChangeSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <DashboardLayout>
      <InstructorSidenav />
      <div style={{ flex: "1" }}>
        <DashboardNavbar />

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
                <MDTypography variant="h4" color="white" textAlign="center">
                  Assignment List
                </MDTypography>
              </MDBox>

              <Card style={{ marginTop: "20px", padding: "20px" }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <strong>Assignment Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Course Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Assignment Description</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Due Date</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                      {assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>{assignment.assignmentName}</TableCell>
                          <TableCell>{assignment.course_name}</TableCell>
                          <TableCell>
                            {assignment.assignmentDescription}
                          </TableCell>
                          <TableCell>{assignment.dueDate}</TableCell>

                          <TableCell>
                            <Box display="flex" gap={1}>
                              <Button
                                variant="contained"
                                style={{
                                  borderRadius: "20px",
                                  padding: "5px 15px",
                                  minWidth: "120px",
                                }}
                                onClick={() =>
                                  handleAssignmentClick(assignment)
                                }
                              >
                                View Assignment
                              </Button>
                              <Button
                                variant="contained"
                                style={{
                                  backgroundColor: "#ff9800",
                                  color: "white",
                                  borderRadius: "20px",
                                  padding: "5px 15px",
                                  minWidth: "120px",
                                }}
                                startIcon={<Delete />}
                                onClick={() =>
                                  handleDeleteDialogOpen(assignment.id)
                                }
                              >
                                Delete
                              </Button>
                              <Button
                                variant="contained"
                                style={{
                                  borderRadius: "20px",
                                  padding: "5px 15px",
                                  minWidth: "120px",
                                }}
                                onClick={() => handleEditAssignment(assignment)}
                              >
                                Notify students about changes
                              </Button>
                            </Box>
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
                    <CircularProgress />
                  </Box>
                )}
                {errorMessage && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={3}
                  >
                    <MDTypography variant="body1" color="error">
                      {errorMessage}
                    </MDTypography>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            {itemToDelete && (
              <MDTypography variant="body1">
                Are you sure you want to delete{" "}
                <strong>{itemToDelete.ass_name}</strong>?
              </MDTypography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button
              onClick={() =>
                handleDeleteAssignment(itemToDelete ? itemToDelete.id : null)
              }
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

export default AssignmentsPage;
