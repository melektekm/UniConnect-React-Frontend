import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table"; // Import Material UI Table component
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { BASE_URL } from "../../appconfig";
import { Pagination } from "@mui/material";
import Link from "@mui/material/Link";
import { Dropdown } from "@mui/base/Dropdown";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";
import MDBadge from "../../components/MDBadge";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import MDInput from "../../components/MDInput";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";

const OrderTables = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [ordersStatus, setOrdersStatus] = useState({});
  const [perPage, setPerPage] = useState(3);
  const [selectedMenuType, setSelectedMenuType] = useState("All");
  const [selectedTimeRange, setSelectedTimeRange] = useState("today"); // Default time range is 'today'
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const [searchedOrder, setSearchedOrder] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const accessToken = userData.accessToken

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };



  const searchOrders = async () => {

      const response = await axios.get(
          `${BASE_URL}/searchCoupon`,
          {
              params: {
                  coupon_code: searchTerm
              },
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              }
          });

      setSearchedOrder(response.data);
      console.log(`searcgeddd is ${searchedOrder.length}`);
  };




  const handleClick = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOrderStatusChange = async (event) => {
    try {
      const newStatus = event.currentTarget.dataset.value;
      const response = await axios.put(
        `${BASE_URL}/orders/${selectedOrderId}`,
        {
          status: event.currentTarget.dataset.value,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setOrdersStatus((prevStatus) => ({
        ...prevStatus,
        [selectedOrderId]: newStatus,
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setAnchorEl(null);
  };

  const fetchOrders = async () => {
    console.log(`from orders ${accessToken}`);
    try {
      const response = await axios.get(
        `${BASE_URL}/orders?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            per_page: perPage,
            time_range: selectedTimeRange,
          },
        }
      );
      const newOrdersStatus = {};
      response.data.data.forEach((order) => {
        newOrdersStatus[order.id] = order.status;
      });
      setOrdersStatus(newOrdersStatus);
      setOrders(response.data.data);

      let filteredOrders = response.data.data;
      if (selectedMenuType === "UnServed") {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === "UnServed"
        );
      } else if (selectedMenuType === "Processing") {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === "Processing"
        );
      } else if (selectedMenuType === "Served") {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === "Served"
        );
      }

      setFilteredOrders(filteredOrders);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, perPage, selectedTimeRange]);

  const handleTimeRangeChange = async (event) => {
    const selectedRange = event.target.value;
    setSelectedTimeRange(selectedRange);
    setCurrentPage(1); // Reset the current page to 1 when the time range is changed

    try {
      const response = await axios.get(`${BASE_URL}/orders?page=1`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          per_page: perPage,
          time_range: event.target.value,
        },
      });
      console.log(response.data);
      setOrders(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusFiltering = (type) => {
    if (type === "UnServed") {
      setSelectedMenuType("UnServed");
      setFilteredOrders(orders.filter((order) => order.status === "UnServed"));
      console.log(`emppptyy ${filteredOrders.length} && ${selectedMenuType}`);
    } else if (type === "Processing") {
      setSelectedMenuType("Processing");
      setFilteredOrders(
        orders.filter((order) => order.status === "Processing")
      );
    } else if (type === "Served") {
      setSelectedMenuType("Served");
      setFilteredOrders(orders.filter((order) => order.status === "Served"));
    } else {
      setSelectedMenuType("All");
      setFilteredOrders([]);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  const options = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "All", value: "all" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center",justifyContent:'space-between', marginBottom: 20 }}>

      <div>  <label htmlFor="time-range" style={{ marginTop: 8, marginRight: 10 }}>
          Time Range:
        </label>
        <FormControl>
          <Select
              id="time-range"
              value={selectedTimeRange}
              style={{ minWidth: 200, minHeight: 50 }}
              onChange={handleTimeRangeChange}
              IconComponent={Dropdown}
          >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

        <div>

            <MDInput
                placeholder="Search by Coupon"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginRight: "10px", width: "300px", color: "white" }}
            />
            <MDButton variant="gradient" onClick={searchOrders} color={"secondary"}>
              <IconButton
                  onClick={searchOrders}
              >
                <SearchIcon color="info" />
              </IconButton>

            </MDButton>

        </div>
      </div>
      {selectedTimeRange === "today" && (
        <MDBox
          mx={2}
          mt={1}
          mb={2}
          py={3}
          px={2}
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          textAlign="center"
        >
          <MDButton
            style={{
              marginRight: "30px",
              color: "white",
              backgroundColor: "#F44336",
              fontWeight: "bold",
            }}
            variant="outlined"
            onClick={() => handleStatusFiltering("UnServed")}
          >
            UnServed
          </MDButton>

          <MDButton
            style={{
              marginRight: "30px",
              color: "black",
              backgroundColor: " #FFC107",
              fontWeight: "bold",
            }}
            variant="outlined"
            onClick={() => handleStatusFiltering("Processing")}
          >
            Processing
          </MDButton>
          <MDButton
            style={{
              marginRight: "30px",
              color: "white",
              backgroundColor: "#4CAF50",
              fontWeight: "bold",
            }}
            variant="outlined"
            onClick={() => handleStatusFiltering("Served")}
          >
            Served
          </MDButton>
          <MDButton
            style={{ marginRight: "30px" }}
            variant="outlined"
            onClick={() => handleStatusFiltering("All")}
          >
            All
          </MDButton>
        </MDBox>
      )}
      <Paper elevation={3} sx={{ marginTop: 2, padding: 2 }}>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell align="center">Order Coupon</TableCell>
                <TableCell align="center">Employee Name</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Ordered Items</TableCell>
                <TableCell align="center">Order Status</TableCell>
                <TableCell></TableCell>
              </TableRow>


              {


                  (searchedOrder.length > 0) ?(

                      searchedOrder.map((order) =>(
                          <TableRow key={order.id}>
                              <TableCell align="center">{order.coupon_code}</TableCell>
                              <TableCell align="center">
                                  {order.employee_name}
                              </TableCell>
                              <TableCell align="center">{order.total_price}</TableCell>
                              <TableCell align="center">{order.created_at}</TableCell>
                              <TableCell align="center">
                                  <ul>
                                      {order.menu_items.map((item, index) => (
                                          <li key={index}>
                                              {item.name} ("amount": {item.quantity})
                                          </li>
                                      ))}
                                  </ul>
                              </TableCell>
                              <TableCell align="center">
                                  <MDBox ml={-1}>
                                      <MDBadge
                                          badgeContent={
                                              order.id in ordersStatus
                                                  ? ordersStatus[order.id]
                                                  : order.status
                                          }
                                          color={
                                              ordersStatus[order.id] === "UnServed"
                                                  ? "error"
                                                  : ordersStatus[order.id] === "Processing"
                                                      ? "warning"
                                                      : "success"
                                          }
                                          variant="gradient"
                                          size="lg"
                                      />
                                  </MDBox>
                              </TableCell>
                              <TableCell>
                                  <IconButton
                                      onClick={(event) => handleClick(event, order.id)}
                                  >
                                      <EditIcon color="primary" />
                                  </IconButton>

                                  <Menu
                                      id={`simple-menu-${order.id}`}
                                      anchorEl={anchorEl}
                                      keepMounted
                                      open={Boolean(anchorEl)}
                                      onClose={handleClose}
                                  >
                                      <MenuItem
                                          onClick={(event) =>
                                              handleOrderStatusChange(event, order.id)
                                          }
                                          data-value="UnServed"
                                      >
                                          UnServed
                                      </MenuItem>
                                      <MenuItem
                                          onClick={(event) =>
                                              handleOrderStatusChange(event, order.id)
                                          }
                                          data-value="Processing"
                                      >
                                          Processing
                                      </MenuItem>
                                      <MenuItem
                                          onClick={(event) =>
                                              handleOrderStatusChange(event, order.id)
                                          }
                                          data-value="Served"
                                      >
                                          Served
                                      </MenuItem>
                                  </Menu>
                              </TableCell>
                          </TableRow>
                      )


                      )
                  ) :
                  orders.length > 0 ? (
                selectedMenuType === "All" || filteredOrders.length > 0 ? (
                  (Array.isArray(filteredOrders) && filteredOrders.length > 0
                    ? filteredOrders
                    : orders
                  ).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell align="center">{order.coupon_code}</TableCell>
                      <TableCell align="center">
                        {order.employee_name}
                      </TableCell>
                      <TableCell align="center">{order.total_price}</TableCell>
                      <TableCell align="center">{order.created_at}</TableCell>
                      <TableCell align="center">
                        <ul>
                          {order.menu_items.map((item, index) => (
                            <li key={index}>
                              {item.name} ("amount": {item.quantity})
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell align="center">
                        <MDBox ml={-1}>
                          <MDBadge
                            badgeContent={
                              order.id in ordersStatus
                                ? ordersStatus[order.id]
                                : order.status
                            }
                            color={
                              ordersStatus[order.id] === "UnServed"
                                ? "error"
                                : ordersStatus[order.id] === "Processing"
                                ? "warning"
                                : "success"
                            }
                            variant="gradient"
                            size="lg"
                          />
                        </MDBox>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleClick(event, order.id)}
                        >
                          <EditIcon color="primary" />
                        </IconButton>

                        <Menu
                          id={`simple-menu-${order.id}`}
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                        >
                          <MenuItem
                            onClick={(event) =>
                              handleOrderStatusChange(event, order.id)
                            }
                            data-value="UnServed"
                          >
                            UnServed
                          </MenuItem>
                          <MenuItem
                            onClick={(event) =>
                              handleOrderStatusChange(event, order.id)
                            }
                            data-value="Processing"
                          >
                            Processing
                          </MenuItem>
                          <MenuItem
                            onClick={(event) =>
                              handleOrderStatusChange(event, order.id)
                            }
                            data-value="Served"
                          >
                            Served
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>No orders found.</TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>No orders found.</TableCell>
                </TableRow>
              )


              }
              {
                  searchedOrder.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <MDButton variant="gradient" onClick={() => setSearchedOrder([])} color={"secondary"}>
                            Clear Search Results
                          </MDButton>
                        </TableCell>
                      </TableRow>
                  )
              }
            </TableBody>
          </Table>

        </TableContainer>

      <Box mt={2} display="flex" justifyContent="center">
      <Pagination
        component={Link}
        count={lastPage}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
        // sx={{
        //   display: "flex",
        //   justifyContent: "center",
        //   marginTop: "20px",
        //   "& .MuiPaginationItem-root": {
        //     color: "primary", // Set the color to "primary"
        //   },
        // }}
        color="primary"
      />
      </Box>
      </Paper>
    </div>
  );
};

export default OrderTables;
