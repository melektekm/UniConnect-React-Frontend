import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import CafeCommetteDashboard from "../CafeCommetteDashboard";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";

function InventoryList() {
  const [inventoryList, setInventoryList] = useState([]); // Initialize as an empty array
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  const fetchInventoryList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getinventory`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
      setInventoryList(response.data[`data`]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInventoryList();
  }, []);

  return (
    <DashboardLayout>
      {userData.user.role == "cashier" ? (
        <DashboardNavbar absolute isMini />
      ) : (
        <NavbarForCommette />
      )}
      <CafeCommetteDashboard />
      <TableContainer component={Paper} elevation={3} style={{ marginTop: 20 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><strong>Item Name</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Measured In</strong></TableCell>
              <TableCell><strong>Item Price</strong></TableCell>
              <TableCell><strong>Approved By</strong></TableCell>
            </TableRow>
            {inventoryList.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.quantity}</TableCell>
                <TableCell>{data.measuredIn}</TableCell>
                <TableCell>{data.itemPrice}</TableCell>
                <TableCell>{data.approvedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardLayout>
  );
}

export default InventoryList;
