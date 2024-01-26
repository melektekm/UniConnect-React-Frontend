import React, { useState, useEffect } from "react";
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MDButton from "../../components/MDButton";
import Box from "@mui/material/Box";
import { MenuItem, Pagination } from "@mui/material";
import Link from "@mui/material/Link";
import CafeManagerSidenav from "../../examples/Sidenav/CafeManagerSidenav";
import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
import CashierSidenav from "../../examples/Sidenav/CashierSidenav";
import { EditIcon } from "@chakra-ui/icons";
import IconButton from "@mui/material/IconButton";
import MDBadge from "../../components/MDBadge";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import {
  EthDateTime,
  dayOfWeekString,
  limits,
} from "ethiopian-calendar-date-converter";
import CircularProgress from "@mui/material/CircularProgress";
import MDTypography from "../../components/MDTypography";
import { Grid } from "@mui/material";
import { Badge } from "reactstrap";

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "16px",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "16px",
    marginRight: "16px",
    editButton: {
      position: "absolute",
      top: "8px",
      right: "8px",
    },
    border: "3px solid #206A5D",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: "8px",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  separator: {
    borderTop: "1px solid #ccc",
    margin: "8px 0",
  },
};

function Billing({ showEditColumn }) {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [guestOrders, setGuestOrders] = useState([]);
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 20;
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [ordersStatus, setOrdersStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, perPage, selectedTimeRange]);

  const fetchData = async (page) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/getGuestOrders?page=${page}`,
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

      if (response.data) {
        const newOrdersStatus = {};
        response.data.data.forEach((order) => {
          newOrdersStatus[order.id] = order.status;
        });
        setOrdersStatus(newOrdersStatus);
        setGuestOrders(response.data.data);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
        setLoading(false);
      } else {
      }
    } catch (error) {}
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const options = [
    { label: " የዛሬው", value: "today" },
    { label: "የዚህ ሳምንት", value: "this_week" },
    { label: "የዚህ ወር", value: "this_month" },
    { label: "ሁሉም", value: "all" },
  ];

  const [anchorEl, setAnchorEl] = useState(null);

  const handleEditClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOrderStatusChange = async (event) => {
    try {
      const newStatus = event.currentTarget.dataset.value;
      const response = await axios.post(
        `${BASE_URL}/guestOrderStatus/${selectedOrderId}`,
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
    } catch (error) {}
    setAnchorEl(null);
  };
  const handleClick = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
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
      if (ethDateTime.hour === 0) {
        ethDateTime.hour = 12;
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

  return (
    <DashboardLayout>
      {userData.user.role == "coordinator" ? (
        <DashboardNavbar />
      ) : (
        <CafeManagerDashboardNavbar />
      )}
      {userData.user.role == "coordinator" ? (
        <CashierSidenav
          color="dark"
          brand=""
          brandName="የገንዘብ ተቀባይ ክፍል መተግበሪያ"
        />
      ) : (
        <CafeManagerSidenav
          color="dark"
          brand=""
          brandName="የምግብ ዝግጅት ክፍል መተግበሪያ"
        />
      )}
      <MDBox
        mx={0}
        mt={2}
        mb={1}
        py={3}
        px={1}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="info"
        textAlign="center"
      >
        {options.map((option, index) => (
          <MDButton
            style={{ marginRight: "30px" }}
            variant={
              selectedTimeRange === option.value ? "contained" : "outlined"
            }
            onClick={() => setSelectedTimeRange(option.value, setLoading(true))}
            key={index}
          >
            {option.label}
          </MDButton>
        ))}
      </MDBox>

      {loading ? (
        <MDBox textAlign="center">
          <CircularProgress color="info" />
          <MDTypography sx={{ fontSize: "0.7em" }}>በሒደት ላይ....</MDTypography>
        </MDBox>
      ) : guestOrders.length === 0 ? (
        <MDBox textAlign="center">
          <Typography variant="h5">ምንም መረጃ አልተገኝም</Typography>
        </MDBox>
      ) : (
        <Grid container spacing={1}>
          {guestOrders.map((order, index) => (
            <Grid item key={order.id} xs={12} sm={6}>
              <Card key={index} style={styles.card}>
                <div style={styles.header}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      flexDirection: "row",
                      alignItems: "end",
                    }}
                  >
                    <Typography variant="h4" fontWeight="medium">
                      {order.guest_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      fontWeight="small"
                      style={{ marginLeft: 10, marginBottom: 5 }}
                    >
                      ( {order.date_human} )
                    </Typography>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Badge
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
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
                        {order.id in ordersStatus
                          ? ordersStatus[order.id] === "UnServed"
                            ? "ያልቀረበ"
                            : ordersStatus[order.id] === "Processing"
                            ? "እየተዘጋጀ ያለ"
                            : "የቀረበ"
                          : order.status}
                      </MDTypography>
                    </Badge>
                    <div style={{ marginLeft: "8px" }}>
                      {showEditColumn &&
                        ordersStatus[order.id] !== "Served" && (
                          <IconButton
                            style={styles.editButton}
                            color="info"
                            aria-label="Edit"
                            onClick={(event) => handleClick(event, order.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                    </div>
                  </div>
                </div>
                <div>
                  <Typography variant="caption">
                    የትእዛዝ መለያ ኮድ: {order.coupon_code}
                  </Typography>
                  {order.ordered_items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <Typography variant="body2">
                        {item.name} : {item.quantity} x {item.price_for_guest}{" "}
                        ብር
                      </Typography>
                    </div>
                  ))}
                </div>
                <div style={styles.separator}></div>
                <div style={styles.total}>
                  <Typography variant="body2">
                    ጠቅላላ ድምር: {order.total_price} ብር
                  </Typography>
                  <Typography variant="body2">
                    ቀን: {convertToEthiopianDate(order.created_at)}
                  </Typography>
                </div>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
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
                    {" "}
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
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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

      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
