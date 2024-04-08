import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import AdminSidenav from "../examples/Sidenav/AdminSidenav";

import theme from "../assets/theme";

export default function MainDashboard({ selectedMenu }) {
  return (
    <AdminSidenav
      color="dark"
      brand=""
      brandName="UNICONNECT"
      selectedMenu={selectedMenu}
    />
  );
}
