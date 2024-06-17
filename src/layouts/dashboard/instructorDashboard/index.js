import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MainDashboard from "../../../layouts/MainDashboard";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import AdminNavbar from "../../../examples/Navbars/AdminNavbar";
import Footer from "../../../examples/Footer";
import InstructorSidenav from "../../../examples/Sidenav/InstructorSidenav";
import axios from "axios";
import { BASE_URL } from "../../../appconfig";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function InstructorDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [formList, setFormList] = useState([]);

  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/announcements`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements: ", error.message);
      }
    };

    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/assignments`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments: ", error.message);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/notifications`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications: ", error.message);
      }
    };

    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/schedule`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setSchedule(response.data);
      } catch (error) {
        console.error("Error fetching schedule: ", error.message);
      }
    };

    fetchAnnouncements();
    fetchAssignments();
    fetchNotifications();
    fetchSchedule();
  }, [accessToken]);

  return (
    <DashboardLayout>
      <AdminNavbar />
      <InstructorSidenav />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Recent Announcements
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                {announcements.length > 0 ? (
                  announcements.map((announcement, index) => (
                    <MDBox key={index} mb={2}>
                      <MDTypography variant="subtitle2">
                        {announcement.title}
                      </MDTypography>
                      <MDTypography variant="body2">
                        {announcement.message}
                      </MDTypography>
                    </MDBox>
                  ))
                ) : (
                  <MDTypography>No recent announcements</MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
              >
                <MDTypography variant="h6" color="white">
                  Assignment Notices
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                {assignments.length > 0 ? (
                  assignments.map((assignment, index) => (
                    <MDBox key={index} mb={2}>
                      <MDTypography variant="subtitle2">
                        {assignment.title}
                      </MDTypography>
                      <MDTypography variant="body2">
                        Due: {assignment.due_date}
                      </MDTypography>
                    </MDBox>
                  ))
                ) : (
                  <MDTypography>No assignment notices</MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
              >
                <MDTypography variant="h6" color="white">
                  Notifications
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <MDBox key={index} mb={2}>
                      <MDTypography variant="body2">
                        {notification.message}
                      </MDTypography>
                    </MDBox>
                  ))
                ) : (
                  <MDTypography>No notifications</MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {/* <MDBox pt={3} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="primary"
              >
                <MDTypography variant="h6" color="white">
                  Schedule
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                {schedule.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableBody>
                        {schedule.map((form, index) => (
                          <TableRow key={index}>
                            <TableCell>{form.course_code}</TableCell>
                            <TableCell>{form.course_name}</TableCell>
                            <TableCell>{form.classDays}</TableCell>
                            <TableCell>{form.classroom}</TableCell>
                            <TableCell>{form.labDays}</TableCell>
                            <TableCell>{form.labroom}</TableCell>
                            <TableCell>{form.labInstructor}</TableCell>
                            <TableCell>{form.classInstructor}</TableCell>
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
          </Grid>
        </Grid>
      </MDBox> */}
      <Footer />
    </DashboardLayout>
  );
}

export default InstructorDashboard;
