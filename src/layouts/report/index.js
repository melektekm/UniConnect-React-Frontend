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
  const [selectedTimeRange, setSelectedTimeRange] = useState("2023");
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [reportData, setReportData] = useState([]);
  const [customReportData, setCustomReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = ipcRenderer.sendSync("get-user");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const accessToken = userData.accessToken;

  const handleTimeRangeChange = async (event) => {
    const selectedRange = event.target.value;
    setSelectedTimeRange(selectedRange);
  };

  const options = [
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
  ];

  const fetchReportData = async () => {
    setLoading(true);
    const response = await axios.get(`${BASE_URL}/report`, {
      params: {
        selected_year: selectedTimeRange,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setReportData(response.data);
    setLoading(false);
  };

  const fetchCustomReportData = async () => {
    setLoading(true);
    const response = await axios.get(`${BASE_URL}/custom/report`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setCustomReportData([response.data]);
    setLoading(false);
  };

  useEffect(() => {
    fetchReportData();
    Font.register({
      family: "Nokia Pure Headline",
      src: "../src/assets/fonts/nokia.ttf",
    });
  }, [selectedTimeRange]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setErrorMessage("እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ።");
      setOpen(true);
    } else if (startDate > endDate) {
      setErrorMessage("የመጀመሪያ ቀን እና የመጨረሻ ቀን ያስተካክሉ");
      setOpen(true);
    } else {
      fetchCustomReportData();
    }
  };

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
  function getEthiopianMonthIntervals(year, monthName) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthIndex = monthNames.indexOf(monthName);
    if (monthIndex === -1) {
      return "Invalid Month";
    }

    const lastDaysArray = [
      31,
      isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();

    const startDate = `${year}-${(monthIndex + 1)
      .toString()
      .padStart(2, "0")}-01`;

    const endDate = `${year}-${(monthIndex + 1).toString().padStart(2, "0")}-${
      lastDaysArray[monthIndex]
    }`;
    // const endDate = new Date(year, monthIndex, lastDayOfMonth); // Last day of the month

    const ethiopianStartDate = convertToEthiopianDate(startDate);
    const ethiopianEndDate = convertToEthiopianDate(endDate);

    return `${ethiopianStartDate} እስከ ${ethiopianEndDate}`;
  }

  function convertToEthiopianDate(inputDate) {
    console.log(inputDate);
    const parsedDate = new Date(inputDate);

    if (!isNaN(parsedDate.getTime())) {
      const ethDateTime = EthDateTime.fromEuropeanDate(parsedDate);
      const dayOfWeek = ethDateTime.getDay();

      const ethiopianDateStr = ` ${ethDateTime.toDateString()}`;

      return `${ethiopianDateStr}`;
    } else {
      return "Invalid Date";
    }
  }

  const getPDF = async () => {
    const columnMargin = 10;
    const pdfContent = (
      <Document>
        <Page size="A2">
          <View style={{ padding: 20, fontSize: 13 }}>
            <Text
              style={{
                marginBottom: 10,
                textAlign: "center",
                fontSize: 16,
                fontFamily: "Nokia Pure Headline",
              }}
            >
              ሚንት ካፌ አመታዊ የ{selectedTimeRange} ወርሃዊ ሪፖርት
            </Text>
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
                  ወር
                </Text>
              </View>
              <View style={{ flex: 1, marginRight: columnMargin }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Nokia Pure Headline",
                  }}
                >
                  ጠቅላላ የሰራተኛ/የእንግዳ/የክፍል ትዕዛዞች
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
                  ጠቅላላ የሰራተኛ ገቢ
                </Text>
              </View>

              <View style={{ flex: 1, marginRight: columnMargin }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Nokia Pure Headline",
                  }}
                >
                  ጠቅላላ የእንግዳ ገቢ
                </Text>
              </View>
              <View style={{ flex: 1, marginRight: columnMargin }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Nokia Pure Headline",
                  }}
                >
                  ጠቅላላ የክፍል ገቢ
                </Text>
              </View>
              <View style={{ flex: 1, marginRight: columnMargin }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Nokia Pure Headline",
                  }}
                >
                  አጠቃላይ ወጪ
                </Text>
              </View>
              <View style={{ flex: 1, marginRight: columnMargin }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Nokia Pure Headline",
                  }}
                >
                  አጠቃላይ ገቢ
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Nokia Pure Headline",
                  }}
                >
                  አጠቃላይ ትርፍ
                </Text>
              </View>
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
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Nokia Pure Headline",
                    }}
                  >
                    {data.month}
                    <br></br>
                    (ከ{" "}
                    {getEthiopianMonthIntervals(
                      selectedTimeRange,
                      data.month
                    )}{" "}
                    )
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    marginRight: columnMargin,
                    fontSize: "16pt",
                  }}
                >
                  <Text>
                    {data.employee_total_orders} / {data.guest_total_orders} /{" "}
                    {data.department_count}
                  </Text>
                </View>
                <View style={{ flex: 1, marginRight: columnMargin }}>
                  <Text style={{ fontFamily: "Nokia Pure Headline" }}>
                    {data.employee_total_revenue} ብር
                  </Text>
                </View>
                <View style={{ flex: 1, marginRight: columnMargin }}>
                  <Text style={{ fontFamily: "Nokia Pure Headline" }}>
                    {data.guest_total_revenue} ብር
                  </Text>
                </View>
                <View style={{ flex: 1, marginRight: columnMargin }}>
                  <Text style={{ fontFamily: "Nokia Pure Headline" }}>
                    {data.department_total_price} ብር
                  </Text>
                </View>
                <View style={{ flex: 1, marginRight: columnMargin }}>
                  <Text style={{ fontFamily: "Nokia Pure Headline" }}>
                    {Number(data.guest_total_revenue) +
                      Number(data.employee_total_revenue) +
                      Number(data.department_total_price)}{" "}
                    ብር
                  </Text>
                </View>
                <View style={{ flex: 1, marginRight: columnMargin }}>
                  <Text style={{ fontFamily: "Nokia Pure Headline" }}>
                    {data.total_expense} ብር
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Nokia Pure Headline" }}>
                    {Number(data.guest_total_revenue) +
                      Number(data.employee_total_revenue) +
                      Number(data.department_total_price) -
                      Number(data.total_expense)}{" "}
                    ብር
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(pdfContent).toBlob();
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const newWindowWidth = 1500;
    const newWindowHeight = 1000;

    const newWindow = window.open(
      "",
      "",
      `width=${newWindowWidth}, height=${newWindowHeight}`
    );
    newWindow.document.write(
      `<iframe src="${pdfUrl}" width="100%" height="100%"></iframe>`
    );
  };
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
              ሪፖርቶች
            </Typography>
            <FormControl>
              <Typography
                variant="h6"
                style={{ marginRight: "8px", color: "white" }}
              >
                የጊዜ ገደብ:
              </Typography>
              <Select
                id="time-range"
                value={selectedTimeRange}
                style={{ minWidth: 120, height: 40, backgroundColor: "white" }}
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
          <Grid item>
            <MDButton variant={"contained"} color={"error"} onClick={getPDF}>
              PDF ሪፖርት ያግኙ
            </MDButton>
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
