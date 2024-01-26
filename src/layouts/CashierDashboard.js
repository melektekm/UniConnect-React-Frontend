import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import CashierSidenav from "../examples/Sidenav/CashierSidenav";

import theme from "../assets/theme";
import Dashboard from "./dashboard";

export default function CashierDashboard({ selectedMenu }) {
  return (
    <Dashboard />
  );
}
