// @mui material components
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MainDashboard from "../../layouts/MainDashboard";
// Data
import reportsBarChartData from "./data/reportsBarChartData";
import reportsLineChartData from "./data/reportsLineChartData";
import OrderTables from "../../layouts/tables/ordertables";
// Dashboard components
import Projects from "./components/Projects";


import axios from "axios";
import { BASE_URL } from "../../appconfig";
import { FormControl, MenuItem, Select } from "@mui/material";
import { Dropdown } from "@mui/base/Dropdown";
import TodayOrders from "../tables/order_menu_tables"; // Assuming you are using axios for API requests
import CashierDashboard from "../CashierDashboard";
import CafeCommetteDashboard from "../CafeCommetteDashboard";
function Dashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [selectedTimeRangeExp, setSelectedTimeRangeExp] = useState("today");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const { sales, tasks } = reportsLineChartData;
  const [orderCount, setOrderCount] = useState(0);
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  // const primaryColor = "#425B58"; // Define the primary color here
  // const secondaryColor = "#FFC2A0";
  const accessToken = userData.accessToken

  useEffect(() => {
    axios
      .get(`${BASE_URL}/orders/status`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          time_range: selectedTimeRange,
        },
      })
      .then((response) => {
        setOrderCount(response.data.order_count);
        setTotalRevenue(response.data.total_revenue);
      })
      .catch((error) => {
        console.error("Error fetching order stats:", error);
      });
  }, [selectedTimeRange]);
  const options = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "All", value: "all" },
  ];
  const handleTimeRangeChange = async (event) => {
    const selectedRange = event.target.value;
    setSelectedTimeRange(selectedRange);
    const selectedRangeExp = event.target.value;
    setSelectedTimeRangeExp(selectedRangeExp);
  };
  useEffect(() => {
    axios
      .get(`${BASE_URL}/inventory/expense`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          time_range: selectedTimeRange,
        },
      })
      .then((response) => {
        setTotalExpense(response.data.total_expense);
      })
      .catch((error) => {
        console.error("Error while fetching expense", error);
      });
  }, [selectedTimeRangeExp]);
  // const optionsExp = [
  //   { label: "Today", value: "today" },
  //   { label: "This Week", value: "this_week" },
  //   { label: "This Month", value: "this_month" },
  //   { label: "All", value: "all" },
  // ];
  // const handleTimeRangeChangeExp = async (event) => {
  //   const selectedRangeExp = event.target.value;
  //   setSelectedTimeRangeExp(selectedRangeExp);
  // };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {userData.user.role == 'cashier' ? <CashierDashboard /> : <CafeCommetteDashboard /> }
      <MDBox py={3}>
        <div style={{ display: "flex" }}>
          <label htmlFor="timeRange" style={{ marginTop: 8  }}>
            Time Range
          </label>
          <FormControl>
            <Select
              id="time-range"
              value={selectedTimeRange}
              style={{
                minWidth: 200,
                minHeight: 50,
                marginBottom: 20,
                marginLeft: 10,
              }}
              onChange={handleTimeRangeChange}
              IconComponent={Dropdown}
              
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={4} md={8} lg={3.5}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="table_view"
                title="Orders"
                count={orderCount}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={8} lg={5}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="store"
                title="Revenue"
                count={`${totalRevenue} ETB`}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={8} lg={3.5}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="store"
                title="Expenses"
                count={`${totalExpense} ETB`}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox pt={1} pb={3}>
          <MDBox padding={3}>
            <TodayOrders />
          </MDBox>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
