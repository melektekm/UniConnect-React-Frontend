import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import CashierSidenav from "../examples/Sidenav/CashierSidenav";

import theme from "../assets/theme";

export default function CashierDashboard({ selectedMenu }) {
  return (
    <CashierSidenav
      color="dark"
      brand=""
      brandName="MinT Cafe Admin App"
      selectedMenu={selectedMenu}
    />
  );
}
