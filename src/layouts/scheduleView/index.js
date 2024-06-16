import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import axios from "axios";
import { BASE_URL } from "../../appconfig";

function DisplaySchedule() {
  const [classSchedules, setClassSchedules] = useState([]);
  const [examSchedules, setExamSchedules] = useState([]);

  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const classResponse = await axios.get(`${BASE_URL}/get-schedules?schedule_type=Class`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const examResponse = await axios.get(`${BASE_URL}/get-schedules?schedule_type=Exam`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (classResponse.data) {
          setClassSchedules(classResponse.data);
        }
        if (examResponse.data) {
          setExamSchedules(examResponse.data);
        }
      } catch (error) {
        console.error("Error fetching schedules: ", error.message);
      }
    };

    fetchSchedules();
  }, [accessToken]);

  const renderTable = (title, schedules, type) => (
    <Card style={{ border: "3px solid #206A5D", marginTop: "20px" }}>
      <MDBox
        mx={2}
        mt={-5}
        py={3}
        px={2}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="dark"
      >
        <MDTypography variant="h6" color="white">
          {title}
        </MDTypography>
      </MDBox>
  
      <MDBox pt={3} pb={3} px={2}>
        {schedules.length > 0 ? (
          <TableContainer>
            <Table>
              {/* <TableHead> */}
                <TableRow>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Course Name</TableCell>
                  {type === "Class" && (
                    <>
                      <TableCell>Class Days</TableCell>
                      <TableCell>Classroom</TableCell>
                      <TableCell>Lab Days</TableCell>
                      <TableCell>Lab Room</TableCell>
                      <TableCell>Lab Instructor</TableCell>
                      <TableCell>Class Instructor</TableCell>
                    </>
                  )}
                  {type === "Exam" && (
                    <>
                      <TableCell>Exam Date</TableCell>
                      <TableCell>Exam Time</TableCell>
                      <TableCell>Exam Room</TableCell>
                    </>
                  )}
                </TableRow>
              {/* </TableHead> */}
              <TableBody>
                {schedules.map((form, index) => (
                  <TableRow key={index}>
                    <TableCell>{form.course_code}</TableCell>
                    <TableCell>{form.course_name}</TableCell>
                    {type === "Class" && (
                      <>
                        <TableCell>{form.classDays}</TableCell>
                        <TableCell>{form.classroom}</TableCell>
                        <TableCell>{form.labDays}</TableCell>
                        <TableCell>{form.labroom}</TableCell>
                        <TableCell>{form.labInstructor}</TableCell>
                        <TableCell>{form.classInstructor}</TableCell>
                      </>
                    )}
                    {type === "Exam" && (
                      <>
                        <TableCell>{form.examDate}</TableCell>
                        <TableCell>{form.examTime}</TableCell>
                        <TableCell>{form.examRoom}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <MDTypography>No schedules available</MDTypography>
        )}
      </MDBox>
    </Card>
  );
  
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Sidenav />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {renderTable("Class Schedules", classSchedules, "Class")}
            {renderTable("Exam Schedules", examSchedules, "Exam")}
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default DisplaySchedule;
