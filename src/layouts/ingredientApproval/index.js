import React, { useState, useEffect } from "react";
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import CafeCommetteDashboard from "../CafeCommetteDashboard";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button"; // Add this import
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import Link from "@mui/material/Link";

function IngredientApproval() {
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [lastPage, setLastPage] = useState(1);
  // const [perPage, setPerPage] = useState(10);
  const [approvedBy, setApprovedBy] = useState({}); // Add state for approvedBy
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  const handleTimeRangeChange = async (event) => {
    const selectedRange = event.target.value;
    setSelectedTimeRange(selectedRange);
  };

  const options = [
    { label: "Today", value: "today" },
    { label: "This week", value: "this week" },
  ];

  // const handlePageChange = (event, page) => {
  //   setCurrentPage(page);
  // };

  const fetchApprovalRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/allowedrequests`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          // per_page: perPage,
          time_range: selectedTimeRange,
        },
      });

      if (response.data) {
        setApprovalRequests(response.data["data"]);
        // setCurrentPage(response.data.current_page);
        // setLastPage(response.data.last_page);
      } else {
        console.log("Empty response");
      }
    } catch (error) {
      console.error("Failed to fetch request:", error);
    }
  };

  useEffect(() => {
    fetchApprovalRequests();
  }, [selectedTimeRange]);

  const handleApproveToggle = (id) => {
    // toggling the approval status between "Approved" and "Pending".
    const newStatus =
      approvalStatus[id] === "Approved" ? "Pending" : "Approved";
    setApprovalStatus({
      ...approvalStatus,
      [id]: newStatus,
    });

    // Set the approvedBy for this request to the current user
    setApprovedBy({
      ...approvedBy,
      [id]: newStatus === "Approved" ? userData.user.name : "",
    });
  };

  return (
    <DashboardLayout>
      {userData.user.role === "cashier" ? (
        <DashboardNavbar absolute isMini />
      ) : (
        <NavbarForCommette />
      )}
      <CafeCommetteDashboard />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={2}
                mb={2}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                textAlign="center"
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Typography style={{ color: "white" }} variant="h6">
                      Ingredient Approval
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControl>
                      <Typography
                        variant="h6"
                        style={{ marginRight: "8px", color: "white" }}
                      >
                        Time Range:
                      </Typography>
                      <Select
                        id="time-range"
                        value={selectedTimeRange}
                        style={{
                          minWidth: 120,
                          height: 40,
                          backgroundColor: "white",
                        }}
                        onChange={handleTimeRangeChange}
                      >
                        {options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </MDBox>
              <Paper>
                <TableContainer component={Box}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell align="center">
                          <strong>Item Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Quantity</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Measured In</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Item Price</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Total Price</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Total price in word</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Requested By</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>recommendation</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Approved By</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Action</strong>
                        </TableCell>
                      </TableRow>
                      {approvalRequests &&
                        approvalRequests.map((data) => (
                          <TableRow key={data.id}>
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.quantity}</TableCell>
                            <TableCell>{data.measuredIn}</TableCell>
                            <TableCell>{data.pricePerItem}</TableCell>
                            <TableCell>{data.totalPrice}</TableCell>
                            <TableCell>{data.totalPriceInWord}</TableCell>
                            <TableCell>{data.requestedBy}</TableCell>
                            <TableCell>{data.date}</TableCell>
                            <TableCell>{data.reccomendation}</TableCell>
                            <TableCell>
                              <Input
                                value={approvedBy[data.id] || ""}
                                onChange={(e) =>
                                  setApprovedBy({
                                    ...approvedBy,
                                    [data.id]: e.target.value,
                                  })
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleApproveToggle(data.id)}
                                variant="contained"
                                color={
                                  approvalStatus[data.id] === "Approved"
                                    ? "success"
                                    : "primary"
                                }
                              >
                                {approvalStatus[data.id] === "Approved"
                                  ? "Revoke Approval"
                                  : "Approve"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* <Box mt={2} display="flex" justifyContent="center">
                  <Pagination
                    component={Link}
                    count={lastPage}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                  />
                </Box> */}
              </Paper>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default IngredientApproval;
