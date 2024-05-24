// @mui material components
import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import OrderTables from "../assignmentList";
import CashierDashboard from "../../CashierDashboard";
import CashierSidenav from "../../../examples/Sidenav/CashierSidenav";
import Sidenav from "../../../examples/Sidenav/AdminSidenav";
// Data

import CafeManagerDashboardNavbar from "../../../examples/Navbars/CafeManagerNavbar";
import CafeManagerSidenav from "../../../examples/Sidenav/CafeManagerSidenav";

function CashierOrder() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* <CashierSidenav color="dark" brand="" brandName="የገንዘብ ተቀባይ ክፍል መተግበሪያ" /> */}
      <Sidenav />
      <MDBox pt={6} pb={3}>
        <OrderTables showEditColumn={false} />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CashierOrder;
