import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import MDBox from "../../components/MDBox";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import Footer from "../../examples/Footer";
import MDTypography from "../../components/MDTypography";
import {
  Card,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { CheckCircle, Cancel, Edit, Delete } from "@mui/icons-material";

function AssignmentsPage() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'sent', 'unsent'
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getallassignments`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      setAssignments(response.data.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setErrorMessage("Error fetching assignments");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleStatusChange = async (assignmentId, newStatus) => {
    // Implement logic to update the status of the assignment on the server
    try {
      await axios.put(
        `${BASE_URL}/updateAssignmentStatus/${assignmentId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the local state to reflect the change
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.assignmentId === assignmentId
            ? { ...assignment, status: newStatus }
            : assignment
        )
      );
    } catch (error) {
      console.error("Error updating assignment status:", error);
      setErrorMessage("Error updating assignment status");
    }
  };

  const handleEditAssignment = (assignmentId) => {
    // Implement logic to navigate to the edit assignment page
    // You may use React Router or any other navigation method
    // and pass the assignmentId as a parameter to the edit page.
  };

  const handleDeleteAssignment = async (assignmentId) => {
    // Implement logic to delete the assignment on the server
    try {
      await axios.delete(`${BASE_URL}/deleteAssignment/${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // Update the local state to reflect the deletion
      setAssignments((prevAssignments) =>
        prevAssignments.filter(
          (assignment) => assignment.assignmentId !== assignmentId
        )
      );
    } catch (error) {
      console.error("Error deleting assignment:", error);
      setErrorMessage("Error deleting assignment");
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filterStatus === "all") {
      return true;
    }
    return assignment.status === filterStatus;
  });

  return (
    <div style={{ display: "flex" }}>
      <Sidenav />
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
                <MDTypography variant="h4" color="white">
                  Assignment List
                </MDTypography>
              </MDBox>
              <Card style={{ marginTop: "20px", padding: "20px" }}>
                <MDBox p={3} display="flex" alignItems="center">
                  <FormControl
                    variant="outlined"
                    fullWidth
                    style={{ margin: "0 0 10px" }}
                  >
                    <InputLabel htmlFor="filter-status">Status</InputLabel>
                    <Select
                      value={filterStatus}
                      onChange={handleFilterChange}
                      label="Status"
                      inputProps={{
                        name: "status",
                        id: "filter-status",
                      }}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="sent">Sent</MenuItem>
                      <MenuItem value="unsent">Unsent</MenuItem>
                    </Select>
                  </FormControl>
                </MDBox>
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
                          <strong>Status</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                      {filteredAssignments.map((assignment) => (
                        <TableRow key={assignment.assignmentId}>
                          <TableCell>{assignment.name}</TableCell>
                          <TableCell>{assignment.courseName}</TableCell>
                          <TableCell>
                            {assignment.assignmentDescription}
                          </TableCell>
                          <TableCell>{assignment.date}</TableCell>
                          <TableCell>{assignment.status}</TableCell>
                          <TableCell>
                            <Box display="flex">
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircle />}
                                onClick={() =>
                                  handleStatusChange(
                                    assignment.assignmentId,
                                    "sent"
                                  )
                                }
                              >
                                Mark as Sent
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                startIcon={<Cancel />}
                                onClick={() =>
                                  handleStatusChange(
                                    assignment.assignmentId,
                                    "unsent"
                                  )
                                }
                              >
                                Mark as Unsent
                              </Button>
                              <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() =>
                                  handleEditAssignment(assignment.assignmentId)
                                }
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() =>
                                  handleDeleteAssignment(
                                    assignment.assignmentId
                                  )
                                }
                              >
                                Delete
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {loading && <p>Loading...</p>}
                {errorMessage && <p>{errorMessage}</p>}
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </div>
    </div>
  );
}

export default AssignmentsPage;
