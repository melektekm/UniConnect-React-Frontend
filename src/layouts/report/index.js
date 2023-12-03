import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CashierDashboard from "../CashierDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import CafeCommetteDashboard from "../CafeCommetteDashboard";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import MDBox from "../../components/MDBox";

function ReportList() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("2023");
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [reportData, setReportData] = useState([]);
  const [reportData2, setReportData2] = useState([]);
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  const handleTimeRangeChange = async (event) => {
    const selectedRange = event.target.value;
    setSelectedTimeRange(selectedRange);
  };

  const options = [
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
  ];

  const fetchReportData = async () => {
    const response = await axios.get(`${BASE_URL}/report`, {
      params: {
        selected_year: selectedTimeRange,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setReportData(response.data);
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedTimeRange]);

  // Combine reportData and reportData2 into a single array
  const combinedReportData = [...reportData, ...reportData2];

  return (
    <DashboardLayout>
      {userData.user.role == "cashier" ? (
        <DashboardNavbar />
      ) : (
        <NavbarForCommette />
      )}
      {userData.user.role == "cashier" ? (
        <CashierDashboard />
      ) : (
        <CafeCommetteDashboard />
      )}
      <MDBox
        mx={2}
        mt={2}
        mb={2}
        py={3}
        px={2}
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
        textAlign="center"
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Typography style={{ color: "white" }} variant="h5">
              Reports
            </Typography>
          </Grid>
          <Grid item>
            <FormControl>
              <Typography
                variant="h6"
                style={{ marginRight: "8px", color: "white" }}
              >
                Time Range:
              </Typography>
              <Select
                id="time-range"
                value={selectedTimeRange}
                style={{ minWidth: 120, height: 40, backgroundColor: "white" }}
                onChange={handleTimeRangeChange}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </MDBox>
      <TableContainer component={Paper} elevation={3} style={{ marginTop: 20 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Month</strong>
              </TableCell>
              <TableCell>
                <strong>Total Employee Orders</strong>
              </TableCell>
              <TableCell>
                <strong>Total Guest Orders</strong>
              </TableCell>
              <TableCell>
                <strong>Total Employee Revenue</strong>
              </TableCell>
              <TableCell>
                <strong>Total Guest Revenue</strong>
              </TableCell>
              <TableCell>
                <strong>Total Revenue</strong>
              </TableCell>
              <TableCell>
                <strong>Total Expense</strong>
              </TableCell>
              <TableCell>
                <strong>Net</strong>
              </TableCell>
            </TableRow>
            {reportData.map((data) => (
              <TableRow key={data.month}>
                <TableCell>{data.month}</TableCell>
                <TableCell>{data.emplotee_total_orders}</TableCell>
                <TableCell>{data.guest_total_orders}</TableCell>
                <TableCell>{data.employee_total_revenue}</TableCell>
                <TableCell>{data.guest_total_revenue} ETB</TableCell>
                <TableCell>
                  {Number(data.guest_total_revenue) +
                    Number(data.employee_total_revenue)}{" "}
                  ETB
                </TableCell>
                <TableCell>{data.total_expense} ETB</TableCell>
                <TableCell>
                  {Number(data.guest_total_revenue) +
                    Number(data.employee_total_revenue) -
                    Number(data.total_expense)}{" "}
                  ETB
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Footer />
    </DashboardLayout>
  );
}

export default ReportList;
