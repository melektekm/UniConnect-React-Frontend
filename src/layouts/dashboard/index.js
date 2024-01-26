// @mui material components
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { Dropdown } from "@mui/base/Dropdown";
import TodayOrders from "../tables/order_menu_tables"; // Assuming you are using axios for API requests
import CashierDashboard from "../CashierDashboard";
import CafeCommetteDashboard from "../CafeCommetteDashboard";
import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import MDTypography from "../../components/MDTypography";
import colors from "../../assets/theme/base/colors";
import {
  EthDateTime,
  dayOfWeekString,
  limits,
} from "ethiopian-calendar-date-converter";
function Dashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [dashboardData, setDashboardData] = useState(null);
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const [dateInterval, setDateInterval] = useState(null);
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

        if (response.data.start_time && response.data.end_time) {
          let startTime = new Date(response.data.start_time);
          let endTime = new Date(response.data.end_time);

          if (
            startTime.getFullYear() === endTime.getFullYear() &&
            startTime.getMonth() === endTime.getMonth() &&
            startTime.getDate() === endTime.getDate()
          ) {
            let displayTime = `ቀን፡ ${convertToEthiopianDate(startTime)}`;
            setDateInterval(displayTime);
          } else {
            let displayTime = `ቀን፡ ከ ${convertToEthiopianDate(
              startTime
            )} እስከ ${convertToEthiopianDate(endTime)}`;
            setDateInterval(displayTime);
          }
        } else {
          setDateInterval(null);
        }
      } catch (error) {}
    }
    fetchData();
  }, [selectedTimeRange]);

  function convertToEthiopianDate(inputDate) {
    const parsedDate = new Date(inputDate);

    if (!isNaN(parsedDate.getTime())) {
      const ethDateTime = EthDateTime.fromEuropeanDate(parsedDate);
      const dayOfWeek = ethDateTime.getDay();
      const dayOfWeekStrings = [
        "እሁድ",
        "ሰኞ",
        "ማክሰኞ",
        "ረቡእ",
        "ሐሙስ",
        "አርብ",
        "ቅዳሜ",
      ];
      const dayName = dayOfWeekStrings[dayOfWeek];

      const ethiopianDateStr = `${dayName}, ${ethDateTime.toDateString()}`;

      return `${ethiopianDateStr}`;
    } else {
      return "Invalid Date";
    }
  }

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
      <DashboardNavbar />
      <Sidenav />
      <MDBox
        mx={2}
        mt={2}
        mb={2}
        py={3}
        px={2}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="info"
        textAlign="center"
      >
        <div style={{ display: "flex", color: "white" }}>
          <label htmlFor="timeRange" style={{ marginTop: 8 }}>
            የጊዜ ገደብ
          </label>
          <FormControl style={{}}>
            <Select
              id="time-range"
              value={selectedTimeRange}
              style={{
                backgroundColor: "#ffffff",
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
          {dateInterval ? (
            <MDBox style={{ marginLeft: "50px" }}>
              <MDTypography color="white">{dateInterval}</MDTypography>
            </MDBox>
          ) : (
            ""
          )}
        </div>
      </MDBox>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{
                  backgroundColor: "#0C356A",
                  color: "white",
                  padding: "30px",
                }}
                icon="order"
                title="የሰራተኛ ትዕዛዞች (ሞባይል እና ገንዘብ ተቀባይ)"
                count={dashboardData && dashboardData.employee_order_count}
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{ backgroundColor: "#900C3F", color: "white" }}
                icon="order"
                title="የእንግዳ ትዕዛዞች (ገንዘብ ተቀባይ)"
                count={dashboardData && dashboardData.guest_order_count_cashier}
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{
                  backgroundColor: "#3D0C11",
                  color: "white",
                  padding: "30px",
                }}
                icon="order"
                title="የእንግዳ ትዕዛዞች (ሰራተኞች)"
                count={
                  dashboardData && dashboardData.guest_order_count_employee
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{ backgroundColor: "#C70039", color: "white" }}
                icon="monetization"
                title="የክፍል ትዕዛዞች"
                count={dashboardData && dashboardData.department_order_count}
              />
            </MDBox>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{ backgroundColor: "#1B9C85", color: "white" }}
                icon="monetization"
                title="የሰራተኛ ገቢ (ሞባይል እና ገንዘብ ተቀባይ)"
                count={dashboardData && `${dashboardData.employee_revenue} ብር`}
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{ backgroundColor: "#F94C10", color: "white" }}
                icon="monetization"
                title="የእንግዳ ገቢ (ገንዘብ ተቀባይ)"
                count={
                  dashboardData && `${dashboardData.guest_revenue_cashier} ብር`
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{ backgroundColor: "#FFB000", color: "white" }}
                icon="monetization"
                title="የእንግዳ ገቢ (ሰራተኞች)"
                count={
                  dashboardData && `${dashboardData.guest_revenue_employee} ብር`
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{ backgroundColor: "#FFB000", color: "white" }}
                icon="monetization"
                title="የከፍል ገቢ"
                count={
                  dashboardData && `${dashboardData.department_revenue} ብር`
                }
              />
            </MDBox>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{ backgroundColor: "#FAC213", color: "white" }}
                icon="deposit"
                title="ለሠራተኞች የገባው የገንዘብ መጠን"
                count={dashboardData && `${dashboardData.total_deposit} ብር`}
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{ backgroundColor: "#004225", color: "white" }}
                icon="monetization"
                title="ጠቅላላ ገቢ"
                count={
                  dashboardData &&
                  `${
                    Number(dashboardData.guest_revenue_employee) +
                    Number(dashboardData.employee_revenue) +
                    Number(dashboardData.guest_revenue_cashier)
                  } ብር`
                }
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{ backgroundColor: "#C70039", color: "white" }}
                icon="monetization"
                title=" ጠቅላላ ወጪ"
                count={dashboardData && `${dashboardData.total_expense} ብር`}
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                customStyle={{ backgroundColor: "#0081C9", color: "white" }}
                icon="monetization"
                title="የተቀበሉት ጠቅላላ ጥሬ ገንዘብ፡-"
                count={dashboardData && `${dashboardData.cash_received} ብር`}
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

export default Dashboard;
