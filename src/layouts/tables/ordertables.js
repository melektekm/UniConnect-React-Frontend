import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { BASE_URL } from "../../appconfig";
import { Pagination } from "@mui/material";
import Link from "@mui/material/Link";
import { Dropdown } from "@mui/base/Dropdown";
import { FormControl, MenuItem, Select } from "@mui/material";
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
import CircularProgress from '@mui/material/CircularProgress';
import {
  EthDateTime,
  dayOfWeekString,
  limits,
} from "ethiopian-calendar-date-converter";

import { connect } from "react-redux";
import {
  selectNewOrderCount,
  setNewOrderCount,
} from "../../stateManagment/OrderSlice";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {Badge} from "reactstrap";
import MDTypography from "../../components/MDTypography";

const OrderTables = ({ showEditColumn, setNewOrderCount, newOrderCount }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [ordersStatus, setOrdersStatus] = useState({});
  const [perPage, setPerPage] = useState(20);
  const [selectedMenuType, setSelectedMenuType] = useState("All");
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const [searchedOrder, setSearchedOrder] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingS, setLoadingS] = useState(false);


  const [emptySearchErrorMessage, setEmptySearchErrorMessage] = useState("");
  const [noMatchErrorMessage, setNoMatchErrorMessage] = useState("");
  const [openEmptySearchDialog, setOpenEmptySearchDialog] = useState(false);
  const [openNoMatchDialog, setOpenNoMatchDialog] = useState(false);

  const accessToken = userData.accessToken;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchOrders = async () => {
    setLoadingS(true)
    if (searchTerm.trim() === "") {
      setEmptySearchErrorMessage("Please enter at least 1 character.");
      setOpenEmptySearchDialog(true);
      
      
      return;
    }
    const response = await axios.get(`${BASE_URL}/searchCoupon`, {
      params: {
        coupon_code: searchTerm,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const searchData = response.data;

    if (searchData.length === 0) {
      setNoMatchErrorMessage("No matched results found.");
      setOpenNoMatchDialog(true);
    } else {
      setSearchedOrder(searchData);
    }
    setLoadingS(false)
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
      const response = await axios.post(
        `${BASE_URL}/orderstatuschange/${selectedOrderId}`,
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
      setEmptySearchErrorMessage("Please try again")
      setOpenEmptySearchDialog(true);
    }
    setAnchorEl(null);


  };

  const fetchOrders = async () => {
    setLoading(true)
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
      const newOrdersCount = response.data.data.filter(
        (order) => !ordersStatus[order.id]
      ).length;

      setNewOrderCount(newOrdersCount);

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

    }
    setLoading(false)
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
      setOrders(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {

    }
  };

  const handleStatusFiltering = (type) => {
    if (type === "UnServed") {
      setSelectedMenuType("UnServed");
      setFilteredOrders(orders.filter((order) => order.status === "UnServed"));
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
  function convertToEthiopianDate(inputDate) {
    // Parse the input date string into a JavaScript Date object
    const parsedDate = new Date(inputDate);

    // Check if the parsedDate is a valid date object
    if (!isNaN(parsedDate.getTime())) {
      // Convert the parsedDate to Ethiopian date using the package
      const ethDateTime = EthDateTime.fromEuropeanDate(parsedDate);
      const dayOfWeek = ethDateTime.getDay(); // This will give you the day of the week as a number (0 to 6)
      ethDateTime.hour = (ethDateTime.hour + 6) % 12;
      if(ethDateTime.hour===0){
        ethDateTime.hour =12
       }


      // Get the day name based on the dayOfWeek value
      const dayOfWeekStrings = [
        "እሁድ",
        "ሰኞ",
        "ማክሰኞ",
        "ረቡእ",
        "ሐሙስ",
        "አርብ",
        "ቅዳሜ",
      ];
      const dayName = dayOfWeekStrings[dayOfWeek];

      // Format Ethiopian date
      const ethiopianDateStr = `${ethDateTime.year}-${ethDateTime.month}-${ethDateTime.date} ${ethDateTime.hour}:${ethDateTime.minute}:${ethDateTime.second}`;

      // Return the formatted Ethiopian date with the day name
      return `${dayName}, ${ethiopianDateStr}`;
    } else {
      // Handle invalid date input
      return "Invalid Date";
    }
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  const options = [
    { label: " የዛሬው", value: "today" },
    { label: "የዚህ ሳምንት", value: "this_week" },
    { label: "የዚህ ወር", value: "this_month" },
    { label: "ሁሉም", value: "all" },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          {" "}
          <label htmlFor="time-range" style={{ marginTop: 8, marginRight: 10 }}>
            የጊዜ ገደብ:
          </label>
          <FormControl>
            <Select
              id="time-range"
              value={selectedTimeRange}
              style={{ minWidth: 200, minHeight: 50, border: "3px solid blue" }}
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
            placeholder="በኩፖን ቁጥር ይፈልጉ"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginRight: "10px", width: "300px", color: "white" }}
          />
         {loadingS?


        <CircularProgress color="primary"/>

: <IconButton
            onClick={searchOrders}
            style={{
              backgroundColor: "blue",
              color: "white",
              borderRadius: "30%",
            }}
          >
            <SearchIcon color="white" />
          </IconButton>}

        </div>
      </div>
      {selectedTimeRange === "today" && (
        <MDBox
          mx={1}
          mt={1}
          mb={2}
          py={3}
          px={2}
          variant="gradient"
          bgColor="dark"
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
            variant={selectedMenuType === "UnServed" ? "contained" : "outlined"}
            onClick={() => handleStatusFiltering("UnServed")}
          >
            ያልቀረበ
          </MDButton>

          <MDButton
            style={{
              marginRight: "30px",
              color: "black",
              backgroundColor: " #FFC107",
              fontWeight: "bold",
            }}
            variant={
              selectedMenuType === "Processing" ? "contained" : "outlined"
            }
            onClick={() => handleStatusFiltering("Processing")}
          >
            እየተዘጋጀ ነው
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
            ምግቡ ቀርቦላቸዋል
          </MDButton>
          <MDButton
            style={{ marginRight: "30px" }}
            variant="outlined"
            onClick={() => handleStatusFiltering("All")}
          >
            ሁሉም
          </MDButton>
        </MDBox>
      )}
      <TableContainer>
        <Table>
          <TableBody
            sx={{
              fontSize: "1.7em",
              color: "white !important",
            }}
          >
            <TableRow sx={{ backgroundColor: "#158467" }}>
              <TableCell align="center">
                <h3 style={{ color: "dark" }}>የኩፖን ማዘዣ ቁጥር </h3>
              </TableCell>
              <TableCell align="center">
                <h3 style={{ color: "dark" }}>የሰራተኛ ስም</h3>
              </TableCell>
              <TableCell align="center">
                <h3 style={{ color: "dark" }}>ዋጋ</h3>
              </TableCell>
              <TableCell align="center">
                <h3 style={{ color: "dark" }}>ቀን</h3>
              </TableCell>
              <TableCell align="center">
                <h3 style={{ color: "dark" }}>የታዘዙ ዕቃዎች</h3>
              </TableCell>
              <TableCell align="center">
                <h3 style={{ color: "dark" }}>የትዕዛዝ ሁኔታ</h3>
              </TableCell>
              {showEditColumn && <TableCell></TableCell>}
            </TableRow>

            {searchedOrder.length > 0 ? (
              searchedOrder.map((order) => (
                <TableRow key={order.id} sx={{ backgroundColor: "#158467" }}>
                  <TableCell align="center">
                    <h4 style={{ color: "#07031A" }}>{order.coupon_code} </h4>
                  </TableCell>
                  <TableCell align="center">
                    <h4 style={{ color: "#07031A" }}>{order.employee_name}</h4>
                  </TableCell>
                  <TableCell align="center">
                    <h4 style={{ color: "black" }}>{order.total_price}</h4>
                  </TableCell>
                  <TableCell align="center">
                    <h4>{convertToEthiopianDate(order.created_at)}</h4>
                    <h4>({order.created_at})</h4>
                  </TableCell>
                  <TableCell align="center">
                    <ul>
                      {order.menu_items.map((item, index) => (
                        <li key={index}>
                          {item.name} ("ብዛት": {item.quantity})
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell align="center">
                    <Badge
                        style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                      <div
                          style={{
                            width: 25,
                            height: 25,

                            borderRadius: "50%",
                            backgroundColor:
                                ordersStatus[order.id] === "UnServed"
                                    ? "#f44336"
                                    : ordersStatus[order.id] === "Processing"
                                        ? "#ff9800"
                                        : "#4caf50",
                            marginRight: 8,
                          }}
                      />
                      <MDTypography variant="h5">
                        {order.id in ordersStatus?
                            ordersStatus[order.id] === "UnServed"
                                ? "ያልቀረበ"
                                : ordersStatus[order.id] === "Processing"
                                    ? "እየተዘጋጀ ያለ"
                                    : "የቀረበ"
                            : order.status}
                      </MDTypography>


                    </Badge>
                  </TableCell>
                  {showEditColumn && ordersStatus[order.id] !== "Served" && (
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
                          ያልቀረበ
                        </MenuItem>
                        <MenuItem
                          onClick={(event) =>
                            handleOrderStatusChange(event, order.id)
                          }
                          data-value="Processing"
                        >
                          እየተዘጋጀ ነው
                        </MenuItem>
                        <MenuItem
                          onClick={(event) =>
                            handleOrderStatusChange(event, order.id)
                          }
                          data-value="Served"
                        >
                          ምግቡ ቀርቦላቸዋል
                        </MenuItem>
                      </Menu>

                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              selectedMenuType === "All" || filteredOrders.length > 0 ? (
                (Array.isArray(filteredOrders) && filteredOrders.length > 0
                  ? filteredOrders
                  : orders
                ).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell align="center">
                      <h4 style={{ color: "#07031A" }}>{order.coupon_code}</h4>
                    </TableCell>
                    <TableCell align="center">
                      <h4 style={{ color: "#07031A" }}>
                        {" "}
                        {order.employee_name}
                      </h4>
                    </TableCell>
                    <TableCell align="center">
                      <h4 style={{ color: "black" }}>
                        {order.total_price} ብር{" "}
                      </h4>
                    </TableCell>
                    <TableCell align="center">
                      <h4 style={{ color: "#07031A" }}>
                        {convertToEthiopianDate(order.created_at)}
                      </h4>
                      <h4 style={{ color: "#07031A" }}>({order.created_at})</h4>
                    </TableCell>
                    <TableCell align="center">
                      <ol style={{ color: "#07031A" }}>
                        {order.menu_items.map((item, index) => (
                          <li key={index}>
                            <h4 style={{ color: "#07031A" }}>
                              {item.name} (ብዛት: {item.quantity})
                            </h4>
                          </li>
                        ))}
                      </ol>
                    </TableCell>
                    <TableCell align="center">
                      <Badge
                          style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                      >
                        <div
                            style={{
                              width: 25,
                              height: 25,

                              borderRadius: "50%",
                              backgroundColor:
                                  ordersStatus[order.id] === "UnServed"
                                      ? "#f44336"
                                      : ordersStatus[order.id] === "Processing"
                                          ? "#ff9800"
                                          : "#4caf50",
                              marginRight: 8,
                            }}
                        />
                        <MDTypography variant="h5">
                          {order.id in ordersStatus?
                              ordersStatus[order.id] === "UnServed"
                                  ? "ያልቀረበ"
                                  : ordersStatus[order.id] === "Processing"
                                      ? "እየተዘጋጀ ያለ"
                                      : "የቀረበ"
                              : order.status}
                        </MDTypography>


                      </Badge>
                    </TableCell>
                    {showEditColumn && ordersStatus[order.id] !== "Served" && (
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
                            ያልቀረበ
                          </MenuItem>
                          <MenuItem
                            onClick={(event) =>
                              handleOrderStatusChange(event, order.id)
                            }
                            data-value="Processing"
                          >
                            እየተዘጋጀ ነው
                          </MenuItem>
                          <MenuItem
                            onClick={(event) =>
                              handleOrderStatusChange(event, order.id)
                            }
                            data-value="Served"
                          >
                            ምግቡን ቀርቦላቸዋል
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>ምንም ትዕዛዞች አልተገኙም</TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell colSpan={7}>ምንም ትዕዛዞች አልተገኙም</TableCell>
              </TableRow>
            )}
            {searchedOrder.length > 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <MDButton
                    variant="contained"
                    onClick={() => setSearchedOrder([])}
                    color={"secondary"}
                  >
                    የፍለጋ ውጤቶችን ሰርዝ
                  </MDButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {loading ?
        <MDBox textAlign = "center">

        <CircularProgress color="primary"/>

</MDBox>:''}
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          component={Link}
          count={lastPage}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </Box>
      <Dialog
        open={openEmptySearchDialog}
        onClose={() => setOpenEmptySearchDialog(false)}
        aria-labelledby="empty-search-dialog-title"
        aria-describedby="empty-search-dialog-description"
        PaperProps={{ sx: { padding: "20px" } }}
      >
        <DialogTitle id="empty-search-dialog-title">{"ማስታወቂያ"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="empty-search-dialog-description">
            {emptySearchErrorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={() => {
              
              setOpenEmptySearchDialog(false);
              setEmptySearchErrorMessage("");
              
            }}
            color="primary"
            variant="contained"
          >
            ዝጋ
          </MDButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openNoMatchDialog}
        onClose={() => setOpenNoMatchDialog(false)}
        aria-labelledby="no-match-dialog-title"
        aria-describedby="no-match-dialog-description"
        PaperProps={{ sx: { padding: "20px" } }}
      >
        <DialogTitle id="no-match-dialog-title">{"ማስታወቂያ"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="no-match-dialog-description">
            {noMatchErrorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenNoMatchDialog(false);
              setNoMatchErrorMessage("");
            }}
            color="error"
            variant="text"
          >
            ዝጋ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
const mapDispatchToProps = {
  setNewOrderCount,
};

export default connect(null, mapDispatchToProps)(OrderTables);
