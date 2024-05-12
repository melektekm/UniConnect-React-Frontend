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
import { Card, Box } from "@mui/material";

function ViewCourses() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = ipcRenderer.sendSync("get-user");

  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const accessToken = userData.accessToken;

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/fetch-course`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data && response.data.courses) {
        setCourses(response.data["courses"]);
      }

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
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
                  Course List
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
                          <strong>Course Code</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Course Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Credit Hour</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Year</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Semester</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Description</strong>
                        </TableCell>
                      </TableRow>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell align="center">
                            {course.course_code}
                          </TableCell>
                          <TableCell align="center">
                            {course.course_name}
                          </TableCell>
                          <TableCell align="center">
                            {course.credit_hours}
                          </TableCell>
                          <TableCell align="center">{course.year}</TableCell>
                          <TableCell align="center">
                            {course.semester}
                          </TableCell>
                          <TableCell align="center">
                            {course.course_description}
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

export default ViewCourses;
