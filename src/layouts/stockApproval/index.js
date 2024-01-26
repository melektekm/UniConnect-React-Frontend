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
import Button from "@mui/material/Button";
import MDTypography from "../../components/MDTypography";

import Link from "@mui/material/Link";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import storeKeeperSidenav from "../../examples/Sidenav/storeKeeperSidenav";
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import CircularProgress from "@mui/material/CircularProgress";
import MDButton from "../../components/MDButton";
import {
  EthDateTime,
  dayOfWeekString,
  limits,
} from "ethiopian-calendar-date-converter";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import colors from "../../assets/theme/base/colors";

function Approval() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [currentpage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const handleApproveRejConfirmation = (num) => {
    setConfirmed(num);
    setOpenDialog(true);
  };

  const handleConfirmation = () => {
    if (confirmed !== null) {
      handleApprove(confirmed);
      setOpenDialog(false);
    }
  };

  useEffect(() => {
    fetchRequests(currentpage);
  }, [currentpage]);

  const fetchRequests = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/requestfetch?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRequests(response.data.data);
      setLastPage(response.data.last_page);
    } catch (error) {}
    setLoading(false);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchRequests(page);
  };
  const handleApprove = async (num) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/stockapprove`,
        {
          approved_by: num === 0 ? 0 : userData.user.id,
          group_id: requests[0].group_id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        fetchRequests(currentpage);
      }
    } catch (error) {}
    setLoading(false);
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
          brandName="የምግብ ዝግጅት ክፍል መተግበሪያ"
        />
      ) : (
        <storeKeeperSidenav color="dark" brand="" brandName="የስቶር ክፍል መተግበሪያ" />
      )} */}
      <DashboardNavbar />
      <Sidenav />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <MDBox
            mx={2}
            mt={2}
            py={3}
            px={2}
            variant="gradient"
            bgColor="dark"
            borderRadius="lg"
            coloredShadow="info"
            style={{ border: "3px solid" }}
          >
            <MDTypography variant="h6" color="white" textAlign="center">
              የእቃ ማውጫ ጥያቄዎች
            </MDTypography>
          </MDBox>

          <TableContainer
            component={Paper}
            style={{ border: "3px solid #206A5D", marginTop: "20px" }}
          >
            {" "}
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
                <TableRow
                  sx={{
                    backgroundColor: colors.light.main,
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <TableCell>የእቃው ስም</TableCell>
                  <TableCell>ብዛት</TableCell>
                  <TableCell>መለኪያ</TableCell>
                </TableRow>

                {requests &&
                  requests.length > 0 &&
                  requests.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>{request.quantity}</TableCell>
                      <TableCell>{request.measured_in}</TableCell>
                    </TableRow>
                  ))}
              </Table>
            </Box>
          </TableContainer>
          <MDBox
            variant="gradient"
            style={{
              backgroundColor: "#DEDDDB",
              display: "block",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center !important",
              width: "60%",

              margin: "10px auto",
              padding: "10px",
              color: "black",
              border: "2px solid #000",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              borderRadius: "30px",
            }}
          >
            {requests && requests.length > 0 && (
              <div>
                <Typography>
                  የተላከበት ቀን ፡ {convertToEthiopianDate(requests[0].created_at)}{" "}
                  አ/ም
                </Typography>{" "}
                {requests &&
                  requests.length > 0 &&
                  requests[0].approved_by === 0 && (
                    <Typography color="error"> ሁኔታ፡ የተሰረዘ</Typography>
                  )}
                {requests &&
                  requests.length > 0 &&
                  requests[0].approved_by > 0 && (
                    <Typography color="primary">ሁኔታ፡ የጸደቀ</Typography>
                  )}
                <MDBox textAlign="center" mt={2}>
                  {requests &&
                    requests.length > 0 &&
                    requests[0].approved_by === null && (
                      <Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            backgroundColor: "rgb(12, 56, 71)",
                            color: "white",
                            marginRight: "20px",
                          }}
                          onClick={() => handleApproveRejConfirmation()}
                        >
                          እጽድቅ
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            backgroundColor: "rgb(204, 4, 17)",
                            color: "white",
                          }}
                          onClick={() => handleApproveRejConfirmation(0)}
                        >
                          ሰርዝ
                        </Button>
                      </Typography>
                    )}
                </MDBox>
              </div>
            )}
          </MDBox>

          <MDBox textAlign="center">
            {loading ? <CircularProgress color="primary" /> : ""}
          </MDBox>
        </Grid>
      </Grid>
      <Pagination
        component={Link}
        count={lastPage}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
        color="primary"
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      />
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="alert-dialog-title">የእቃ ማውጫ ማረጋገጫ </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ድርጊቱን ለማከናወን እርግጠኛ ነዎት ?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <MDButton onClick={() => setOpenDialog(false)} color="error">
            አይደለሁም
          </MDButton>
          <MDButton onClick={handleConfirmation} color="primary">
            አዎ
          </MDButton>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Approval;
