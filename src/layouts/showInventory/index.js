import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, D_File_URL } from "../../appconfig";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import CircularProgress from "@mui/material/CircularProgress";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";

import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";

import storeKeeperSidenav from "../../examples/Sidenav/storeKeeperSidenav";
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
import IngredientApproval from "../ingredientApproval/index";

import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

import { Document, Page, Text, View, pdf } from "@react-pdf/renderer";
import { FaFilePdf, FaImage } from "react-icons/fa";
import {
  EthDateTime,
  dayOfWeekString,
  limits,
} from "ethiopian-calendar-date-converter";

import { useLocation, useNavigate } from "react-router-dom";

import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";

import Link from "@mui/material/Link";
import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import MDTypography from "../../components/MDTypography";

import colors from "../../assets/theme/base/colors";
function InventoryList({ entryId }) {
  const isHalf = entryId > 0;
  const navigate = useNavigate();
  const location = useLocation();

  const [entryList, setEntryList] = useState();
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const perPage = 1;

  const [hasRequest, setHasRequest] = useState(false);

  const [showR, setShowR] = useState(false);

  const [requestId, setRequestId] = useState(null);
  const [reqId, setReqId] = useState(0);

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const fetchData = async (page) => {
    setLoading(true);
    const api = isHalf
      ? `getinventory/${entryId}`
      : `getallinventory?page=${page}`;

    try {
      const response = await axios.get(`${BASE_URL}/${api}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (isHalf) {
        setEntryList(response.data.data);
      } else {
        if (response.data) {
          const submittedStartId =
            response.data.data.data[0].purchase_request_start_id;
          setHasRequest(submittedStartId > 0);
          setReqId(response.data.data.data[0].id);
          setEntryList(response.data.data.data);
          setCurrentPage(response.data.data.current_page);
          setLastPage(response.data.data.last_page);
        } else {
        }
      }
    } catch (error) {}
    setLoading(false);
  };

  const handlePageChange = (event, page) => {
    if (showR) {
      setShowR(!showR);
    }
    setCurrentPage(page);

    fetchData(page);
  };

  const handleViewChange = (requestID) => {
    setShowR(!showR);
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

  const renderSubPart = () => {
    if (loading) {
      return (
        <MDBox textAlign="center">
          <CircularProgress color="primary" />
        </MDBox>
      );
    }
    if (!entryList || entryList.length === 0) {
      return null; // Return null or handle the case when approvalRequests is empty
    }
    return (
      <>
        <TableContainer style={{ width: "100%" }}>
          <Box
            sx={{
              backgroundColor: colors.white.main,
              overflow: "scroll",
              maxHeight: "600px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <Table>
              <TableBody>
                <TableRow
                  sx={{
                    backgroundColor: colors.light.main,
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <TableCell>
                    <strong>ተራ ቁጥር </strong>
                  </TableCell>
                  <TableCell>
                    <strong>የእቃው አይነት</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ብዛት</strong>
                  </TableCell>
                  <TableCell>
                    <strong>መለኪያ</strong>
                  </TableCell>
                  <TableCell>
                    <strong>የአንዱ ዋጋ</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ጠቅላላ ዋጋ ብር</strong>
                  </TableCell>
                  <TableCell>
                    <strong>የጠቅላላ ዋጋ በፊደል</strong>
                  </TableCell>
                </TableRow>

                {entryList &&
                  entryList.length > 0 &&
                  entryList[0].related_requests.map((data, index) => (
                    <TableRow key={data.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data ? data.name : ""}</TableCell>
                      <TableCell>{data ? data.quantity : ""}</TableCell>
                      <TableCell>{data ? data.measured_in : ""}</TableCell>
                      <TableCell>{data ? data.price_per_item : ""}</TableCell>
                      <TableCell>
                        {data && data.quantity && data.price_per_item
                          ? parseFloat(data.quantity) *
                            parseFloat(data.price_per_item)
                          : ""}
                      </TableCell>
                      <TableCell>{data ? data.price_word : ""}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>
          <MDBox
            variant="gradient"
            style={{
              backgroundColor: "#DEDDDB",
              display: "block",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center !important",
              width: "60%",
              height: "100%",
              margin: "10px auto",
              padding: "10px",
              color: "black",
              border: "2px solid #000",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              borderRadius: "30px",
            }}
          >
            <TableRow
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TableCell style={{ border: "0px" }} colSpan={2}>
                ጠቅላላ ዋጋ:
              </TableCell>
              <TableCell style={{ border: "0px" }} align="right">
                {entryList[0].total_price_entry}
              </TableCell>
            </TableRow>

            <TableRow
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TableCell style={{ border: "0px" }} colSpan={2}>
                ተመላሽ ብር:
              </TableCell>
              <TableCell style={{ border: "0px" }} align="right">
                {entryList[0].returned_amount}
              </TableCell>
            </TableRow>

            <TableRow
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TableCell style={{ border: "0px" }} colSpan={2}>
                የጠያቂው ስም:{" "}
              </TableCell>
              <TableCell style={{ border: "0px" }} align="right">
                {entryList[0].entry_approved_by.name}
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TableCell style={{ border: "0px" }} colSpan={2}>
                ቀን፡{" "}
              </TableCell>
              <TableCell style={{ border: "0px" }} align="right">
                {convertToEthiopianDate(entryList[0].formatted_created_at)}
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TableCell style={{ border: "0px" }} colSpan={2}>
                የደረሰኝ ፋይል:{" "}
              </TableCell>
              <TableCell style={{ border: "0px" }} align="right">
                {entryList[0].file_path ? (
                  entryList[0].file_path.toLowerCase().endsWith(".pdf") ? (
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
                            entryList[0].file_data +
                            '"></iframe>'
                        );
                        newWindow.resizeTo(
                          window.innerWidth * 0.6,
                          window.innerHeight * 0.8
                        );
                      }}
                    >
                      <FaFilePdf cursor="pointer" size={50} />
                      <MDTypography style={{ marginLeft: "10px" }}>
                        {" "}
                        ፋይሉን ለማየት ምልክቱን ይጫኑ
                      </MDTypography>
                    </div>
                  ) : (
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
                            entryList[0].file_data +
                            '" style="width:100%;height:100%;" />'
                        );
                        newWindow.resizeTo(
                          window.innerWidth * 0.6,
                          window.innerHeight * 0.8
                        );
                      }}
                    >
                      <FaImage size={50} />
                      <MDTypography style={{ marginLeft: "10px" }}>
                        {" "}
                        ፋይሉን ለማየት ምልክቱን ይጫኑ
                      </MDTypography>
                    </div>
                  )
                ) : (
                  "ምንም ፋይል አልተገኘም"
                )}
              </TableCell>
            </TableRow>
          </MDBox>
        </TableContainer>
        {entryList && entryList.length > 0 && (
          <MDBox mt={2}>
            {hasRequest && !isHalf ? (
              <Button
                variant="contained"
                style={{
                  backgroundColor: showR
                    ? "rgb(204, 4, 17)"
                    : "rgb(12, 56, 71)",
                  color: "white",
                }}
                onClick={() => handleViewChange(requestId)}
              >
                {showR ? "ወደ በፊቱ ተመለስ" : "ተያያዥ የግዥ ጥያቄ"}
              </Button>
            ) : isHalf ? null : (
              <Typography mt={2} color="red">
                ግዥው ተያያዥ ጥያቄ የለውም!
              </Typography>
            )}
          </MDBox>
        )}
      </>
    );
  };

  const renderFullUi = () => {
    return (
      <DashboardLayout>
        {/* {userData.user.role == "student" ? (
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
            brandName="የምግብ ዝግጅት ክፍል መተገበሪያ"
          />
        ) : (
          <storeKeeperSidenav
            color="dark"
            brand=""
            brandName="የስቶር ክፍል መተግበሪያ"
          />
        )} */}
        <DashboardNavbar />
        <Sidenav />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={showR ? 6 : 12}>
              <Card style={{ border: "3px solid #206A5D", padding: "20px" }}>
                <MDBox
                  mx={2}
                  mt={-6}
                  mb={2}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="dark"
                  borderRadius="lg"
                  coloredShadow="info"
                  textAlign="center"
                  style={{ border: "3px solid #0779E4" }}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Typography style={{ color: "white" }} variant="h6">
                        የተፈጸመ ግዢ ዝርዝር
                      </Typography>
                    </Grid>
                  </Grid>
                </MDBox>

                {renderSubPart()}
              </Card>
            </Grid>
            {showR && (
              <Grid item xs={12} md={6}>
                <IngredientApproval reqId={reqId} />
              </Grid>
            )}
          </Grid>
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
  };

  return isHalf ? renderSubPart() : renderFullUi();
}

export default InventoryList;
