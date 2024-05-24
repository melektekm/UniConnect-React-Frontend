import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import CoordinatorSidenav from "../examples/Sidenav/CoordinatorSidenav";

import theme from "../assets/theme";
import Dashboard from "./dashboard";

export default function CoordinatorDashboard({ selectedMenu }) {
  return <Dashboard />;
}
