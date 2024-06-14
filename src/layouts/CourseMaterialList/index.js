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
  Modal,
  Card,
  Box,
  CardContent,
  FormControl,
  TextField,
  InputLabel,
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

function CourseMaterialsPage() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = ipcRenderer.sendSync("get-user");

  const [open, setOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fileContent, setFileContent] = useState(null); // State to store file content

  const [courses, setCourses] = useState([]); // State to store unique courses

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getallmaterials`);
      console.log('Response data:', response.data); // Log the response data
      if (response.data && response.data.materials) {
        setMaterials(response.data.materials);
        const uniqueCourses = [...new Set(response.data.materials.map(material => material.course_name))];
        setCourses(uniqueCourses); // Extract unique courses
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
    setLoading(false);
  };

 // Fetch file content when material is selected
const fetchFileContent = async (materialId) => {
  try {
    const response = await axios.get(`${BASE_URL}/getmaterialcontent/${materialId}`, {
      responseType: "blob", // Ensure response is treated as a blob (binary data)
    });
    console.log('File content:', response.data);
    setFileContent(response.data); // Set the file content
  } catch (error) {
    console.error('Error fetching file content:', error);
  }
};

  // Filter materials based on selected course and search term
  const filterMaterials = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/filtermaterials`, {
        course_name: selectedCourse,
        searchTerm: searchTerm,
      });
      console.log('Filtered materials:', response.data.filteredMaterials);
      if (response.data && response.data.filteredMaterials) {
        setMaterials(response.data.filteredMaterials);
      }
    } catch (error) {
      console.error('Error filtering materials:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (selectedCourse || searchTerm) {
      filterMaterials();
    } else {
      fetchMaterials();
    }
  }, [selectedCourse, searchTerm]);

  const handleMaterialClick = async (material) => {
    setSelectedMaterial(material);
    setOpen(true);
    await fetchFileContent(material.id); // Fetch file content when material is clicked
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedMaterial(null);
    setFileContent(null); // Clear file content on modal close
  };

  const handleChangeCourse = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleChangeSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDownload = () => {
    if (fileContent) {
      // Create a Blob from the file content
      const blob = new Blob([fileContent]);
      // Create a URL for the Blob and open it in a new window
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      // Release the URL object after opening the window
      URL.revokeObjectURL(url);
    }
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
                  Course Material List
                </MDTypography>
              </MDBox>
              <Card style={{ marginTop: "20px" }}>
                {/* Filter by Course Select */}
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
                {/* Table displaying filtered materials */}
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
                        <TableCell align="center">
                          <strong>Course Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <Typography>Loading...</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        materials.map((material) => (
                          <TableRow key={material.id}>
                            <TableCell align="center">{material.id}</TableCell>
                            <TableCell align="center">{material.material_title}</TableCell>
                            <TableCell align="center">{material.course_name}</TableCell>
                            <TableCell align="center">
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleMaterialClick(material)}
                              >
                                View Material
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Footer />
              </Card>
              <Modal open={open} onClose={handleCloseModal}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
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
                            Title: {selectedMaterial.material_title}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Course Name: {selectedMaterial.course_name}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDownload}
                          >
                            Download Material
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
