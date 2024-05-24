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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  Box,
  Modal,
  CardContent,
} from "@mui/material";
import axios from "axios";
// import { useHistory } from "react-router-dom";
import { BASE_URL } from "../../appconfig";
import MDBox from "../../components/MDBox";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import MainDashboard from "../../layouts/MainDashboard";
import Footer from "../../examples/Footer";
import MDTypography from "../../components/MDTypography";

function ViewAssignments() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = ipcRenderer.sendSync("get-user");

  const [open, setOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const accessToken = userData.accessToken;

  // const history = useHistory();

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getallassignments`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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

  const handleSubmitAssignment = (assignment) => {
    // history.push({
    //   pathname: "/submit-assignment",
    //   state: {
    //     assignmentName: assignment.ass_name,
    //     courseName: assignment.course_name,
    //   },
    // });
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
                          <TableCell align="center">
                            {assignment.ass_name}
                          </TableCell>
                          <TableCell align="center">
                            {assignment.Add_description}
                          </TableCell>
                          <TableCell align="center">
                            {assignment.course_name}
                          </TableCell>
                          <TableCell align="center">
                            {assignment.due_date}
                          </TableCell>
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
                              color="secondary"
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
              <Modal open={open} onClose={handleCloseModal}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Card>
                    <CardContent>
                      {selectedAssignment && (
                        <>
                          <Typography variant="h5" component="div" gutterBottom>
                            Assignment Details
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Assignment ID: {selectedAssignment.id}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Assignment Name: {selectedAssignment.ass_name}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Description: {selectedAssignment.Add_description}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Course Name: {selectedAssignment.course_name}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Due Date: {selectedAssignment.due_date}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            href={selectedAssignment.uploadedFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            Download Assignment
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Modal>
            </Grid>
          </Grid>
        </MDBox>
      </div>
    </div>
  );
}

export default ViewAssignments;
