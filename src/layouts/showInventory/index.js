import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CashierDashboard from "../CashierDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import Footer from "../../examples/Footer";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import MDBox from "../../components/MDBox";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import { Document, Page, Text, View, pdf, Font } from "@react-pdf/renderer";
import MDButton from "../../components/MDButton";
import { EthDateTime } from "ethiopian-calendar-date-converter";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import MDTypography from "../../components/MDTypography";

function ReportList() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [reportData, setReportData] = useState([]);
  const [assignmentList, setAssignmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = ipcRenderer.sendSync("get-user");

  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const accessToken = userData.accessToken;

  const fetchReportData = async () => {
    setLoading(true);
    const response = await axios.get(`${BASE_URL}/getallassignments`, {
      try {
        const response = await axios.get(`${BASE_URL}/${api}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
  
        setAssignmentList(response.data.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
  
      setLoading(false);
    };

  useEffect(() => {
    fetchReportData();
  }, []);
            <View
              style={{
                flexDirection: "row",
                borderBottom: 1,
                borderColor: "#000",
                paddingBottom: 10,
                paddingTop: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginRight: columnMargin,
                  textAlign: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Nokia Pure Headline",
                  }}
                >
                  Assignment Id
                </Text>
              </View>
              <View style={{ flex: 1, marginRight: columnMargin }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Nokia Pure Headline",
                  }}
                >
                  Assignment Name
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  marginRight: columnMargin,
                  fontFamily: "Nokia Pure Headline",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Nokia Pure Headline",
                  }}
                >
                 Couse Name
                </Text>
              </View>

              <View style={{ flex: 1, marginRight: columnMargin }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Nokia Pure Headline",
                  }}
                >
                  Due Date
                </Text>
              </View>
              <View style={{ flex: 1, marginRight: columnMargin }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Nokia Pure Headline",
                  }}
                >
                  Uploaded File
                </Text>
              </View>
            {reportData.map((data) => (
              <View
                key={data.month}
                style={{
                  flexDirection: "row",
                  paddingBottom: 10,
                  paddingTop: 10,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    marginRight: columnMargin,
                    textAlign: "center",
                  }}
                >
                </View>
                <View
                  style={{
                    flex: 1,
                    marginRight: columnMargin,
                    fontSize: "16pt",
                  }}
                >  
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );
  return (
    <DashboardLayout>
      {/* {userData.user.role == "coordinator" ? (
        <CashierDashboard />
      ) : userData.user.role == "dean" ? (
        <CafeManagerSidenav
          color="dark"
          brand=""
          brandName="የምግብ ዝግጅት ክፍል መተግበሪያ"
        />
      ) : (
        <CafeCommetteeSidenav
          color="dark"
          brand=""
          brandName="የኮሚቴ ክፍል መተገበሪያ"
        />
      )} */}
      <DashboardNavbar />
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
        style={{ border: "3px solid #0779E4" }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent={"space-between"}
          spacing={2}
        >
          <Grid
            item
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
          >
            <Typography
              style={{ color: "white", marginRight: 25 }}
              variant="h5"
            >
              Assignment List
            </Typography>
          </Grid>
        </Grid>
      </MDBox>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{"ማስታወቂያ"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            color="light"
            variant="contained"
          >
            ዝጋ
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer
        component={Paper}
        elevation={3}
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <Table>
          <TableBody>
            <TableRow sx={{ backgroundColor: "#    " }}>
              <TableCell align={"center"}>
                <strong>ወር</strong>
              </TableCell>
              <TableCell align="center">
                <strong>ጠቅላላ የሰራተኛ/የእንግዳ/የክፍል ትዕዛዞች</strong>
              </TableCell>
              <TableCell align="center">
                <strong>ጠቅላላ የሰራተኛ ገቢ</strong>
              </TableCell>
              <TableCell align="center">
                <strong>ጠቅላላ የእንግዳ ገቢ</strong>
              </TableCell>
              <TableCell>
                <strong>ጠቅላላ የክፍል ገቢ</strong>
              </TableCell>
              <TableCell align="center">
                <strong>አጠቃላይ ገቢ</strong>
              </TableCell>
              <TableCell align="center">
                <strong>አጠቃላይ ወጪ</strong>
              </TableCell>
              <TableCell align="center">
                <strong>አጠቃላይ ትርፍ</strong>
              </TableCell>
            </TableRow>
            {reportData.map((data) => (
              <TableRow key={data.month}>
                <TableCell align="center">
                  {" "}
                  <strong>{data.month}</strong>
                  <br></br>
                  <strong>
                    (ከ{" "}
                    {getEthiopianMonthIntervals(selectedTimeRange, data.month)}{" "}
                    )
                  </strong>
                </TableCell>
                <TableCell align="center" style={{ fontSize: "16pt" }}>
                  {data.employee_total_orders} / {data.guest_total_orders} /{" "}
                  {data.department_count}
                </TableCell>
                <TableCell align="center">
                  {data.employee_total_revenue} ብር
                </TableCell>
                <TableCell align="center">
                  {data.guest_total_revenue} ብር
                </TableCell>
                <TableCell align="center">
                  {data.department_total_price} ብር
                </TableCell>
                <TableCell align="center">
                  {Number(data.guest_total_revenue) +
                    Number(data.employee_total_revenue) +
                    Number(data.department_total_price)}{" "}
                  ብር
                </TableCell>
                <TableCell align="center">{data.total_expense} ብር</TableCell>
                <TableCell align="center">
                  {Number(data.guest_total_revenue) +
                    Number(data.employee_total_revenue) +
                    Number(data.department_total_price) -
                    Number(data.total_expense)}{" "}
                  ብር
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer
        component={Paper}
        sx={{
          display: "block",
          margin: "0 auto",
          border: "3px solid #206A5D",
          borderBottom: "2px solid #000",
          width: "80%",
          textAlign: "center",
        }}
      >
        <div
          align="center"
          style={{ backgroundColor: "#158467", fontSize: "24px" }}
        >
          ሪፖርት አመንጪ
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                sx={{ paddingX: "20%" }}
                align="center"
                style={{ fontSize: "18px", fontWeight: "bold" }}
              >
                <MDBox mb={2} sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    required
                    fullWidth
                    label="የመጀመሪያ ቀን"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  {startDate && (
                    <MDTypography variant="body2" sx={{ marginLeft: 2 }}>
                      {convertToEthiopianDate(startDate)}
                    </MDTypography>
                  )}
                </MDBox>
                <MDBox mb={2} sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    required
                    fullWidth
                    label="የመጨረሻ ቀን"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  {endDate && (
                    <MDTypography variant="body2" sx={{ marginLeft: 2 }}>
                      {convertToEthiopianDate(endDate)}
                    </MDTypography>
                  )}
                </MDBox>
                <MDButton
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSubmit} // Replace with your function
                >
                  ሪፖርት አምጣ
                </MDButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {customReportData.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={3}
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          <Table>
            <TableBody>
              <TableRow sx={{ backgroundColor: "#    " }}>
                <TableCell align={"center"}>
                  <strong>የጊዜ ገደብ</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>ጠቅላላ የሰራተኛ/የእንግዳ/የክፍል ትዕዛዞች</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>ጠቅላላ የሰራተኛ ገቢ</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>ጠቅላላ የእንግዳ ገቢ</strong>
                </TableCell>
                <TableCell>
                  <strong>ጠቅላላ የክፍል ገቢ</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>አጠቃላይ ገቢ</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>አጠቃላይ ወጪ</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>አጠቃላይ ትርፍ</strong>
                </TableCell>
              </TableRow>
              {customReportData.map((data) => (
                <TableRow>
                  <TableCell align="center">
                    {" "}
                    <strong>
                      {" "}
                      {convertToEthiopianDate(data.start_date)} -{" "}
                      {convertToEthiopianDate(data.end_date)}
                    </strong>
                    <br></br>
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "16pt" }}>
                    {data.employee_total_orders} / {data.guest_total_orders} /{" "}
                    {data.department_count}
                  </TableCell>
                  <TableCell align="center">
                    {data.employee_total_revenue} ብር
                  </TableCell>
                  <TableCell align="center">
                    {data.guest_total_revenue} ብር
                  </TableCell>
                  <TableCell align="center">
                    {data.department_total_price} ብር
                  </TableCell>
                  <TableCell align="center">
                    {Number(data.guest_total_revenue) +
                      Number(data.employee_total_revenue) +
                      Number(data.department_total_price)}{" "}
                    ብር
                  </TableCell>
                  <TableCell align="center">{data.total_expense} ብር</TableCell>
                  <TableCell align="center">
                    {Number(data.guest_total_revenue) +
                      Number(data.employee_total_revenue) +
                      Number(data.department_total_price) -
                      Number(data.total_expense)}{" "}
                    ብር
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        ""
      )}
      {loading ? (
        <MDBox textAlign="center">
          <CircularProgress color="primary" />
        </MDBox>
      ) : (
        ""
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default ReportList;
