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
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import MainDashboard from "../../layouts/MainDashboard";
import Footer from "../../examples/Footer";
import MDTypography from "../../components/MDTypography";
import { CheckCircle, Cancel, Edit, Delete } from "@mui/icons-material";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";

const tabStyles = {
  root: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 255, 0.1)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(0, 0, 255, 0.2)',
    },
  },
};

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
  const itemsPerPage = 20;
  const [current_page, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
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
      if (response.data && response.data.assignments) {
        setAssignments(response.data["assignments"]);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setErrorMessage("Error fetching assignments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, [current_page]);

  const handleFilterChange = (event, newValue) => {
    setFilterStatus(newValue);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.post(
        `${BASE_URL}/assignments/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.id === id ? { ...assignment, status: newStatus } : assignment
        )
      );
    } catch (error) {
      console.error("Error updating assignment status:", error);
      setErrorMessage("Error updating assignment status");
    }
  };

  function handleEditAssignment(updatedAssignment) {
    if (!selectedAssignment) {
      setAssignments([...assignments, updatedAssignment]);
    } else {
      setAssignments(
        assignments.map((assignment) =>
          assignment.id === updatedAssignment.id ? updatedAssignment : assignment
        )
      );
      setSelectedAssignment(null);
    }
    Navigate("/assignmentUpload", { state: { selectedAssignment: updatedAssignment } });
  }

  function handleDeleteDialogOpen(id) {
    const assignmentItem = assignments.find((assignmentItem) => assignmentItem.id === id);
    setItemToDelete(assignmentItem);
    setDeleteDialogOpen(true);
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

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

  const filteredAssignments = assignments.filter((assignment) => {
    if (filterStatus === "all") {
      return true;
    }
    return assignment.status === filterStatus;
  });

  return (
    <DashboardLayout>
      <div style={{ display: "flex" }}>
        <Sidenav />
        <div style={{ flex: "1" }}>
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
                  <MDTypography variant="h4" color="white"   textAlign="center">
                    Assignment List
                  <MDBox p={3}  variant="gradient"
                  bgColor="dark"
                  borderRadius="lg"
                  coloredShadow="info" >
                    <Tabs
                      value={filterStatus}
                      onChange={handleFilterChange}
                      indicatorColor="primary"
                      textColor="primary"
                      centered
                    >
                      <Tab
                        label={<MDTypography variant="h6" color="primary">All</MDTypography>}
                        value="all"
                        sx={tabStyles.root}
                      />
                      <Tab
                        label={<MDTypography variant="h6" color="primary">Sent</MDTypography>}
                        value="sent"
                        sx={tabStyles.root}
                      />
                      <Tab
                        label={<MDTypography variant="h6" color="primary">Unsent</MDTypography>}
                        value="unsent"
                        sx={tabStyles.root}
                      />
                    </Tabs>
                  </MDBox>
                  </MDTypography>
                </MDBox>
                  <Card style={{ marginTop: "20px", padding: "20px" }}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell><strong>Assignment Name</strong></TableCell>
                          <TableCell><strong>Course Name</strong></TableCell>
                          <TableCell><strong>Assignment Description</strong></TableCell>
                          <TableCell><strong>Due Date</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                          <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                        {filteredAssignments.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell>{assignment.ass_name}</TableCell>
                            <TableCell>{assignment.course_name}</TableCell>
                            <TableCell>{assignment.Add_description}</TableCell>
                            <TableCell>{assignment.due_date}</TableCell>
                            <TableCell>{assignment.status}</TableCell>
                            <TableCell>
                              <Box display="flex" gap={1}>
                                <Button
                                  variant="contained"
                                  style={{
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    minWidth: "120px",
                                  }}
                                  startIcon={<Edit />}
                                  onClick={() => handleEditAssignment(assignment)}
                                >
                                  Edit
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
                                  onClick={() => handleDeleteDialogOpen(assignment.id)}
                                >
                                  Delete
                                </Button>
                                <Box minWidth="120px">
                                  <Select
                                    value={assignment.status}
                                    onChange={(e) => handleStatusChange(assignment.id, e.target.value)}
                                  >
                                    <MenuItem value="sent">Sent</MenuItem>
                                    <MenuItem value="unsent">Unsent</MenuItem>
                                  </Select>
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {loading && (
                    <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                      <CircularProgress />
                    </Box>
                  )}
                  {errorMessage && (
                    <Box display="flex" justifyContent="center" alignItems="center" p={3}>
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
      </div>
    </DashboardLayout>
  );
}

export default AssignmentsPage;
