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
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  Box,
} from "@mui/material";

function ViewAssignments() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = ipcRenderer.sendSync("get-user");

  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

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
      console.log(response.data);
      if (response.data && response.data.assignments) {
        setAssignments(response.data["assignments"]);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

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
                        <TableCell align={"center"}>
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
                        <TableCell>
                          <strong>Uploaded File</strong>
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
                            {assignment.courseName}
                          </TableCell>
                          <TableCell align="center">
                            {assignment.due_date}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              href={assignment.uploadedFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              Download File
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
