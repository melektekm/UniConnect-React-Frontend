import React, { useState, useEffect, useRef } from "react";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import { Grid } from "@mui/material";
// Material Dashboard 2 React examples
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import CashierDashboard from "../../CashierDashboard";
import MDTypography from "../../../components/MDTypography";
import axios from "axios";
import { BASE_URL, D_File_URL } from "../../../appconfig";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MDButton from "../../../components/MDButton";
import CafeCommetteDashboard from "../../CafeCommetteDashboard";
import Box from "@mui/material/Box";
import { Pagination } from "@mui/material";
import Link from "@mui/material/Link";
import CafeManagerSidenav from "../../../examples/Sidenav/CafeManagerSidenav";
import CafeManagerDashboardNavbar from "../../../examples/Navbars/CafeManagerNavbar";
import CashierSidenav from "../../../examples/Sidenav/CashierSidenav";
import {
  EthDateTime,
  dayOfWeekString,
  limits,
} from "ethiopian-calendar-date-converter";
import { Document, Page, Text, View, pdf } from "@react-pdf/renderer";
import { FaFilePdf, FaImage } from "react-icons/fa";
import { BrowserWindow } from "electron";
import CircularProgress from "@mui/material/CircularProgress";
import colors from "../../../assets/theme/base/colors";

function DepartmentBilling() {
  const electron = window.require("electron");

  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [lastPage, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedData, setLoadedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const perPage = 5;

  const [orders, setOrders] = useState(null);

  const styles = {
    separator: {
      borderTop: "2px solid #ccc",
    },
  };

  function convertToEthiopianDate(inputDate) {
    const parsedDate = new Date(inputDate);

    if (!isNaN(parsedDate.getTime())) {
      const ethDateTime = EthDateTime.fromEuropeanDate(parsedDate);
      const dayOfWeek = ethDateTime.getDay();
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

      const ethiopianDateStr = `${dayName}, ${ethDateTime.toDateString()}`;

      return `${ethiopianDateStr}`;
    } else {
      return "Invalid Date";
    }
  }

  const fetchData = async (page) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/departmentOrders?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setOrders(response.data.data);
        setLastPage(response.data.last_page);
        setLoading(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  function openNewWindow(url, width, height) {
    window.open(url, "_blank", `width=${width},height=${height},fullscreen=no`);
  }

  return (
    <DashboardLayout>
      {/* {userData.user.role == "coordinator" ? ( */}
      <DashboardNavbar />
      {/* ) : (
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
      )} */}
      <Sidenav />
      <MDBox
        mx={2}
        mt={2}
        mb={2}
        py={3}
        px={2}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="info"
        textAlign="center"
      >
        <MDTypography variant="h6" color="white">
          የዲፓርትመንት ምግብ ግዥ መረጃ
        </MDTypography>
      </MDBox>

      {loading ? (
        <MDBox textAlign="center">
          <CircularProgress color="info" />
          <MDTypography sx={{ fontSize: "0.7em" }}>በሒደት ላይ ....</MDTypography>
        </MDBox>
      ) : (
        <Grid container spacing={3}>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <Grid item key={order.id} xs={12} sm={6}>
                <Card style={{ margin: "15px" }}>
                  <div style={{ backgroundColor: "#2c3c58", padding: "20px" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "-20px",
                        left: "10px",
                      }}
                    >
                      <MDBox>
                        {order.file_path ? (
                          order.file_path.toLowerCase().endsWith(".pdf") ? (
                            <div
                              onClick={() => {
                                const newWindow = window.open(
                                  "",
                                  "_blank",
                                  `width=${window.innerWidth * 0.6},height=${
                                    window.innerHeight * 0.8
                                  }`
                                );
                                newWindow.document.write(
                                  '<iframe width="100%" height="100%" src="data:application/pdf;base64,' +
                                    order.file_data +
                                    '"></iframe>'
                                );
                                newWindow.resizeTo(
                                  window.innerWidth * 0.6,
                                  window.innerHeight * 0.8
                                );
                              }}
                            >
                              <FaFilePdf size={50} color={"#8f93a9"} />
                              <Text
                                style={{
                                  marginLeft: "10px",
                                  color: "#8f93a9",
                                }}
                              >
                                {" "}
                                ፋይሉን ለማየት ምልክቱን ይጫኑ
                              </Text>
                            </div>
                          ) : (
                            <MDBox bgColor="dark">
                              <div
                                onClick={() => {
                                  const newWindow = window.open(
                                    "",
                                    "_blank",
                                    `width=${window.innerWidth * 0.6},height=${
                                      window.innerHeight * 0.8
                                    }`
                                  );
                                  newWindow.document.write(
                                    '<img src="data:image;base64,' +
                                      order.file_data +
                                      '" style="width:100%;height:100%;" />'
                                  );
                                  newWindow.resizeTo(
                                    window.innerWidth * 0.6,
                                    window.innerHeight * 0.8
                                  );
                                }}
                              >
                                <FaImage
                                  size={50}
                                  color={colors.badgeColors.primary.main}
                                />
                                <Text
                                  style={{
                                    marginLeft: "10px",
                                    color: "#8f93a9",
                                  }}
                                >
                                  {" "}
                                  ፋይሉን ለማየት ምልክቱን ይጫኑ
                                </Text>
                              </div>
                            </MDBox>
                          )
                        ) : (
                          "ምንም ፋይል አልተገኘም"
                        )}
                      </MDBox>
                    </div>
                    <MDTypography
                      color={"white"}
                      variant="h4"
                      mb={2}
                      textAlign="center"
                      style={{ paddingTop: "20px", marginTop: "10px" }}
                    >
                      የዲፓርትመንት ስም: {order.department_name}
                    </MDTypography>
                    <MDTypography
                      color={"white"}
                      variant="h7"
                      mb={2}
                      textAlign="center"
                      style={{ paddingTop: "10px", marginTop: "10px" }}
                    >
                      የግዥ ፈጻሚ ስም: {order.buyer_name}
                    </MDTypography>
                  </div>

                  <div style={styles.separator}></div>

                  <div
                    style={{
                      display: "flex",
                      marginTop: "10px",
                      padding: "20px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <MDTypography
                        mb={1}
                        sx={{ fontSize: "0.7em", fontWeight: "bold" }}
                      >
                        የሰው ብዛት : {order.number_of_people}
                      </MDTypography>
                      <MDTypography
                        mb={1}
                        sx={{ fontSize: "0.7em", fontWeight: "bold" }}
                      >
                        የቀናት ብዛት : {order.number_of_days}
                      </MDTypography>
                      <MDTypography
                        mb={1}
                        sx={{ fontSize: "0.7em", fontWeight: "bold" }}
                      >
                        ጠቅላላ ዋጋ :{" "}
                        {parseFloat(order.number_of_days) *
                          parseFloat(order.number_of_people) *
                          parseFloat(order.lunch_price_per_person) +
                          parseFloat(order.number_of_days) *
                            parseFloat(order.number_of_people) *
                            parseFloat(order.refreshment_price_per_person) *
                            parseFloat(order.refreshment_per_day)}{" "}
                        ብር
                      </MDTypography>
                    </div>
                    <div style={{ flex: 1 }}>
                      <MDTypography
                        mb={1}
                        sx={{ fontSize: "0.7em", fontWeight: "bold" }}
                      >
                        የምሳ ዋጋ በአንድ ሰው :{order.lunch_price_per_person} ብር
                      </MDTypography>
                      <MDTypography
                        mb={1}
                        sx={{ fontSize: "0.7em", fontWeight: "bold" }}
                      >
                        የመክሰስ ዋጋ በአንድ ሰው: {order.refreshment_price_per_person}{" "}
                        ብር
                      </MDTypography>
                      <MDTypography
                        mb={1}
                        sx={{ fontSize: "0.7em", fontWeight: "bold" }}
                      >
                        በቀን ውስጥ የመክሰስ መጠን : {order.refreshment_per_day}
                      </MDTypography>
                    </div>
                  </div>
                  <div style={styles.separator}></div>
                  <MDBox
                    variant="gradient"
                    style={{
                      backgroundColor: "#DEDDDB",
                      padding: "20px",
                    }}
                  >
                    <MDTypography
                      mb={1}
                      sx={{ fontSize: "0.6em", fontWeight: "bold" }}
                    >
                      የአገልግሎት መጀመሪያ ቀን፡-{" "}
                      {convertToEthiopianDate(order.serving_date_start)} አ/ም (
                      {order.serving_date_start} እ/ኤ/አ)
                    </MDTypography>
                    <MDTypography
                      mb={1}
                      sx={{ fontSize: "0.6em", fontWeight: "bold" }}
                    >
                      የአገልግሎት መጨረሻ ቀን፡-{" "}
                      {convertToEthiopianDate(order.serving_date_end)} አ/ም (
                      {order.serving_date_end} እ/ኤ/አ)
                    </MDTypography>
                  </MDBox>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Card>
                <MDBox p={2}>ምንም ትዕዛዞች የሉም።</MDBox>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
      {/* Pagination */}
      <MDBox mt={4} sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={lastPage}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default DepartmentBilling;
