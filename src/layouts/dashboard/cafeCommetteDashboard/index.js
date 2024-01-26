// @mui material components
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import ReportsBarChart from "../../../examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../../examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "../../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MainDashboard from "../../MainDashboard";
import reportsLineChartData from "../data/reportsLineChartData";
import NavbarForCommette from "../../../examples/Navbars/NavBarForCommette";
import axios from "axios";
import { BASE_URL } from "../../../appconfig";
import { FormControl, MenuItem, Select } from "@mui/material";
import { Dropdown } from "@mui/base/Dropdown";
import TodayOrders from "../../tables/order_menu_tables"; // Assuming you are using axios for API requests
import CashierDashboard from "../../CashierDashboard";
import CafeCommetteDashboard from "../../CafeCommetteDashboard";
function CommetteDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [dashboardData, setDashboardData] = useState(null);
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");

  const accessToken = userData.accessToken;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/dashboard/status`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            time_range: selectedTimeRange,
          },
        });
        setDashboardData(response.data);
      } catch (error) {}
    }
    fetchData();
  }, [selectedTimeRange]);

  useEffect(() => {}, [dashboardData]);

  const options = [
    { label: " የዛሬው", value: "today" },
    { label: "የዚህ ሳምንት", value: "this_week" },
    { label: "የዚህ ወር", value: "this_month" },
    { label: "ሁሉም", value: "all" },
  ];

  const handleTimeRangeChange = async (event) => {
    const selectedRange = event.target.value;
    setSelectedTimeRange(selectedRange);
  };

  return (
    <DashboardLayout>
      {userData.user.role == "coordinator" ? (
        <DashboardNavbar />
      ) : (
        <NavbarForCommette />
      )}
      {userData.user.role == "coordinator" ? (
        <CashierDashboard />
      ) : (
        <CafeCommetteDashboard />
      )}
      <MDBox py={3}>
        <div style={{ display: "flex" }}>
          <label htmlFor="timeRange" style={{ marginTop: 8 }}>
            የጊዜ ገደብ
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
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="table_view"
                title="የሰራተኛ ትዕዛዞች (ሞባይል እና ገንዘብ ተቀባይ)"
                count={dashboardData && dashboardData.employee_order_count}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="table_view"
                title="የእንግዳ ማዘዣ (ገንዘብ ተቀባይ)"
                count={dashboardData && dashboardData.guest_order_count_cashier}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="table_view"
                title="የእንግዳ ማዘዣ (ሰራተኞች)"
                count={
                  dashboardData && dashboardData.guest_order_count_employee
                }
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="store"
                title="ወጪዎች"
                count={`${dashboardData && dashboardData.total_expense} ብር`}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={6}>
          <Grid item xs={4} md={8} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="table_view"
                title="የሰራተኛ ገቢ (ሞባይል እና ገንዘብ ተቀባይ)"
                count={dashboardData && `${dashboardData.employee_revenue} ብር`}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="table_view"
                title="የእንግዳ ገቢ (ገንዘብ ተቀባይ)"
                count={
                  dashboardData && `${dashboardData.guest_revenue_cashier} ብር`
                }
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={3.5}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="table_view"
                title="የእንግዳ ገቢ (ሰራተኞች)"
                count={
                  dashboardData && `${dashboardData.guest_revenue_employee} ብር`
                }
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={6}>
          <Grid item xs={12} md={8} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="store"
                title="ጠቅላላ ገቢ"
                count={
                  dashboardData &&
                  `${
                    Number(dashboardData.guest_revenue_employee) +
                    Number(dashboardData.employee_revenue) +
                    Number(dashboardData.guest_revenue_cashier)
                  } ብር`
                }
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={8} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="store"
                title="ለሠራተኞች የገባው የገንዘብ መጠን"
                count={dashboardData && `${dashboardData.total_deposit} ብር`}
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
                title="የተቀበሉት ጠቅላላ ጥሬ ገንዘብ፡"
                count={dashboardData && `${dashboardData.cash_received} ብር`}
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
            <TodayOrders timeRange={selectedTimeRange} />
          </MDBox>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CommetteDashboard;
