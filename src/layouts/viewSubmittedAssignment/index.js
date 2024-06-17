import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Grid,
  Button,
  Card,
  Box,
  Modal,
  CardContent,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import MDBox from "../../components/MDBox";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import InstructorSidenav from "../../examples/Sidenav/InstructorSidenav";
import MainDashboard from "../../layouts/MainDashboard";
import Footer from "../../examples/Footer";
import MDTypography from "../../components/MDTypography";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";

function SubmittedAssignments() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/getallsubmittedassignments`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data && response.data.assignments) {
        setAssignments(response.data.assignments);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedAssignment(null);
  };

  return (
    <DashboardLayout>
      <InstructorSidenav />

      <div style={{ marginLeft: "280px", width: "100%", paddingLeft: "20px" }}>
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
              <Card style={{ marginTop: "20px" }}>
                <TableContainer
                  component={Paper}
                  elevation={3}
                  style={{ marginTop: 20, marginBottom: 20 }}
                >
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell align="center">
                          <strong>Assignment Id</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Assignment Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Course Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Student ID</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Student Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                      {assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell align="center">{assignment.id}</TableCell>
                          <TableCell align="center">
                            {assignment.assignment_name}
                          </TableCell>
                          <TableCell align="center">
                            {assignment.course_name}
                          </TableCell>
                          <TableCell align="center">
                            {assignment.student_id}
                          </TableCell>
                          <TableCell align="center">
                            {assignment.student_name}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleAssignmentClick(assignment)}
                            >
                              View Assignment
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Footer />
              </Card>
              <Modal open={open} onClose={handleCloseModal}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    height: "80%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  {selectedAssignment ? (
                    <>
                      <Card>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <MDTypography variant="h5">
                              Viewing Assignment: {selectedAssignment.ass_name}
                            </MDTypography>
                            <Button
                              variant="contained"
                              color="secondary"
                              href={selectedAssignment.uploadedFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              Download Assignment
                            </Button>
                          </Box>
                          <iframe
                            src={selectedAssignment.uploadedFileUrl}
                            title="Assignment File"
                            width="100%"
                            height="600px"
                            style={{ marginTop: "20px" }}
                          ></iframe>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <CircularProgress />
                  )}
                </Box>
              </Modal>
            </Grid>
          </Grid>
        </MDBox>
      </div>
    </DashboardLayout>
  );
}

export default SubmittedAssignments;
