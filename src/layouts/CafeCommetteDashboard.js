import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import CafeCommetteeSidenav from "../examples/Sidenav/CafeCommeteeSidenav";

import theme from "../assets/theme";

export default function CafeCommetteDashboard({ selectedMenu }) {
  return (
    <CafeCommetteeSidenav
      color="dark"
      brand=""
      brandName="MinT Cafe Admin App"
      selectedMenu={selectedMenu}
    />
  );
}
