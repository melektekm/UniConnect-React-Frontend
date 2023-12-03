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
import OrderTables from "../../layouts/tables/ordertables";
import CashierDashboard from "../CashierDashboard";
// Data
import authorsTableData from "./data/authorsTableData";
import projectsTableData from "./data/projectsTableData";

function Tables() {
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  return (
    <DashboardLayout>
      {userData.user.role == 'cashier' ? <DashboardNavbar /> : <NavbarForCommette /> }
      <CashierDashboard />
      <MDBox pt={6} pb={3}>
        <OrderTables />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
