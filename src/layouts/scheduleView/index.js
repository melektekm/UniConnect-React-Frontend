import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
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
  const [formList, setFormList] = useState({
    items: [],
  });

  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-schedules`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.data) {
          setFormList({ items: response.data });
        }
      } catch (error) {
        console.error("Error fetching schedules: ", error.message);
      }
    };

    fetchSchedules();
  }, [accessToken]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Sidenav />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card style={{ border: "3px solid #206A5D" }}>
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
                  Entered Schedules
                </MDTypography>
              </MDBox>

              <MDBox pt={3} pb={3} px={2}>
                {formList.items.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableBody>
                        {formList.items.map((form, index) => (
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
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default DisplaySchedule;
