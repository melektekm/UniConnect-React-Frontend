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
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
import CoordinatorSidenav from "../../examples/Sidenav/CoordinatorSidenav";
import StudentSidenav from "../../examples/Sidenav/Studentsidenav";
import DeanSidenav from "../../examples/Sidenav/DeanSidenav";
import InstructorSidenav from "../../examples/Sidenav/InstructorSidenav";

function CourseMaterialsPage() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = ipcRenderer.sendSync("get-user");

  const [open, setOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const accessToken = userData.accessToken;

  const fetchMaterial = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getallmaterials`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data && response.data.materials) {
        setMaterials(response.data.materials);
      }
    } catch (error) {
      console.error("Error fetching matrials:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterial();
  }, []);

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedMaterial(null);
  };

  return (
    <div style={{ display: "flex" }}>
      {userData.user.role == "student" ? (
        <StudentSidenav />
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
                  Course Material List
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
                          <strong>Id</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Title</strong>
                        </TableCell>
                        {/* <TableCell align="center">
                          <strong>Material Description</strong>
                        </TableCell> */}
                        <TableCell align="center">
                          <strong>Course Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                      {materials.map((material) => (
                        <TableRow key={assignment.id}>
                          <TableCell align="center">{material.id}</TableCell>
                          <TableCell align="center">
                            {material.materialTitle}
                          </TableCell>
                          {/* <TableCell align="center">{material.materialDescription}</TableCell> */}
                          <TableCell align="center">
                            {material.course_name}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleAssignmentClick(assignment)}
                            >
                              View Material
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
                      {selectedMaterial && (
                        <>
                          <Typography variant="h5" component="div" gutterBottom>
                            Course Material Details
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            ID: {selectedMaterial.id}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Title: {selectedMaterial.materialTitle}
                          </Typography>
                          {/* <Typography variant="body1" gutterBottom>
                            Description: {selectedMaterial.materialDescription}
                          </Typography> */}
                          <Typography variant="body1" gutterBottom>
                            Course Name: {selectedMaterial.course_name}
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

export default CourseMaterialsPage;
