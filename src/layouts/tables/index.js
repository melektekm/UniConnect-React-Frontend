// @mui material components
import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import OrderTables from "./assignmentList";
import CoordinatorDashboard from "../CoordinatorDashboard";
import DeanNavBar from "../../examples/Navbars/DeanNavBar";
import Sidenav from "../../examples/Sidenav/AdminSidenav";

function Tables() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  return (
    <DashboardLayout>
      {/* <DeanNavBar />
      <DeanSidenav color="dark" brand="" brandName="የሚንት ካፌ መተግበሪያ" /> */}
      {/* <DashboardNavbar /> */}
      <Sidenav />
      <MDBox pt={6} pb={3}>
        <OrderTables showEditColumn={true} />
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Tables;
