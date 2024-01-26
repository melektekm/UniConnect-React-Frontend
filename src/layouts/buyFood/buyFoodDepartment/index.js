import React, { useState, useEffect } from "react";
import CashierDashboard from "../../CashierDashboard";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import axios from "axios";
import { BASE_URL } from "../../../appconfig";
import DepartmentOrderSummary from "./buyFoodUiDepartment";
import { Select, MenuItem } from "@mui/material";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Icon from "@mui/material/Icon";
import CashierSidenav from "../../../examples/Sidenav/CashierSidenav";

function BuyFoodDepartment() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Sidenav />
      {/* <CashierSidenav color="dark" brand="" brandName="የገንዘብ ተቀባይ ክፍል መተግበሪያ" /> */}
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
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <MDTypography variant="h4" color="white">
          {"የዲፓርትመንት ምግብ ግዥ"}
        </MDTypography>
      </MDBox>

      <DepartmentOrderSummary />
    </DashboardLayout>
  );
}
export default BuyFoodDepartment;
