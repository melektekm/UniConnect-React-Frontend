import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import axios from "axios";

import { BASE_URL } from "../../appconfig";
import Paper from "@mui/material/Paper";
import CafeCommetteDashboard from "../CafeCommetteDashboard";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  Box,
  Pagination,
} from "@mui/material";
import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
import CafeManagerSidenav from "../../examples/Sidenav/CafeManagerSidenav";
import storeKeeperSidenav from "../../examples/Sidenav/storeKeeperSidenav";
import CafeCommetteeSidenav from "../../examples/Sidenav/CafeCommeteeSidenav";
import Link from "@mui/material/Link";

function StockAmountTable() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState({
    id: "",
    name: "",
    quantity: "",
    measured_in: "",
  });

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const fetchData = async (page) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/getinventoryremained?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setFetchedData(response.data.data);
      } else {
      }
    } catch (error) {}
    setLoading(false);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);

    fetchData(page);
  };

  return (
    <DashboardLayout>
      {userData.user.role == "student" ? (
        <NavbarForCommette />
      ) : userData.user.role == "dean" ? (
        <CafeManagerDashboardNavbar />
      ) : (
        <NavbarForCommette />
      )}
      {userData.user.role == "student" ? (
        <CafeCommetteeSidenav
          color="dark"
          brand=""
          brandName="የኮሚቴ ክፍል መተገበሪያ"
        />
      ) : userData.user.role == "dean" ? (
        <CafeManagerSidenav
          color="dark"
          brand=""
          brandName="የምግብ ዝግጅት ክፍል መተግበሪያ"
        />
      ) : (
        <storeKeeperSidenav color="dark" brand="" brandName="የስቶር ክፍል መተግበሪያ" />
      )}
      <MDBox
        mx={2}
        mt={2}
        py={3}
        px={2}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="info"
        style={{ border: "3px solid #0779E4" }}
      >
        <MDTypography variant="h6" textAlign="center" color="white">
          ስቶረ ውስጥ ያለ እቃ
        </MDTypography>
      </MDBox>
      <MDBox pt={2} pb={3} px={2} sx={{ borderRadius: "8px solid #016A70 " }}>
        <TableContainer
          component={Paper}
          style={{ border: "3px solid #206A5D" }}
        >
          <Table>
            <TableRow sx={{ backgroundColor: "#158467" }}>
              <TableCell>ተራ ቁጥር</TableCell>
              <TableCell>የእቃው ስም</TableCell>
              <TableCell>መለኪያ</TableCell>
              <TableCell>የቀረ እቃ ብዛት</TableCell>
            </TableRow>

            {fetchedData &&
              fetchedData.length > 0 &&
              fetchedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.measured_in}</TableCell>
                  <TableCell>{item.quantity_left}</TableCell>
                </TableRow>
              ))}
          </Table>
        </TableContainer>
        <MDBox textAlign="center">
          {loading ? <CircularProgress color="primary" /> : ""}
        </MDBox>
      </MDBox>
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          component={Link}
          count={lastPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

export default StockAmountTable;
