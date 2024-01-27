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
import Footer from "../../examples/Footer";
import MDTypography from "../../components/MDTypography";
import {
  Card,
  Box,
} from "@mui/material";

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
      const response = await axios.get(`${BASE_URL}/getallcourses`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      setCourses(response.data.data);
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
                          <strong>Department</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Instructor</strong>
                        </TableCell>
                        {/* Add more headers based on your course data model */}
                      </TableRow>
                      {courses.map((course) => (
                        <TableRow key={course.courseCode}>
                          <TableCell align="center">{course.courseCode}</TableCell>
                          <TableCell align="center">{course.courseName}</TableCell>
                          <TableCell align="center">{course.department}</TableCell>
                          <TableCell align="center">{course.instructor}</TableCell>
                          {/* Add more cells based on your course data model */}
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
