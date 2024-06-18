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
  Tabs,
  Tab,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
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
  const [currentTab, setCurrentTab] = useState("Class");
  const [selectedYear, setSelectedYear] = useState("");
  const [page, setPage] = useState(1);

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

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleYearFilterChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const renderTable = (title, schedules, type) => (
    <Card style={{ border: "1px solid #206A5D", marginTop: "20px", borderRadius: "10px", overflow: "hidden" }}>
      <MDBox
        mx={2}
        mt={-3}
        py={2}
        px={2}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="dark"
        textAlign="center"
      >
        <MDTypography variant="h5" color="white">
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
                  <TableCell>Status</TableCell>
                  <TableCell>Year</TableCell>
                </TableRow>
              {/* </TableHead> */}
              <TableBody>
                {schedules
                  .filter((schedule) =>
                    selectedYear ? schedule.year === selectedYear : true
                  )
                  .slice((page - 1) * 10, page * 10)
                  .map((form, index) => (
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
                      <TableCell>{form.status}</TableCell>
                      <TableCell>{form.year}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No schedules available
          </Typography>
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
            <MDBox
              mx={2}
              mt={1}
              mb={2}
              py={3}
              px={2}
              variant="gradient"
              bgColor="dark"
              borderRadius="lg"
              coloredShadow="info"
              textAlign="center"
            >
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Class Schedules" value="Class" />
                <Tab label="Exam Schedules" value="Exam" />
              </Tabs>
            </MDBox>
            <MDBox display="flex" justifyContent="center" mt={2} mb={2}>
                <FormControl
                  style={{
                    width: "200px",
                    backgroundColor: "#fff",
                    borderRadius: "5px",
                    marginTop: "10px",
                    padding: "5px",
                  }}
                >
                  <InputLabel>Filter by Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={handleYearFilterChange}
                    displayEmpty
                  >
                    <MenuItem value="">All Years</MenuItem>
                    <MenuItem value="1">1st Year</MenuItem>
                    <MenuItem value="2">2nd Year</MenuItem>
                    <MenuItem value="3">3rd Year</MenuItem>
                    <MenuItem value="4">4th Year</MenuItem>
                  </Select>
                </FormControl>
              </MDBox>
            {currentTab === "Class" &&
              renderTable("Class Schedules", classSchedules, "Class")}
            {currentTab === "Exam" &&
              renderTable("Exam Schedules", examSchedules, "Exam")}
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default DisplaySchedule;
