import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import CashierDashboard from "../CashierDashboard";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import Footer from "../../examples/Footer";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { Button, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CashierSidenav from "../../examples/Sidenav/CashierSidenav";
import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
import CafeCommetteeSidenav from "../../examples/Sidenav/CafeCommeteeSidenav";
import CafeManagerSidenav from "../../examples/Sidenav/CafeManagerSidenav";

export default function Constraint() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorM, setErrorM] = useState(true);

  const [isEditable, setIsEditable] = useState(false);
  const [employeeBreakfastOrderMaxAmount, setEmployeeBreakfastOrderMaxAmount] =
    useState(1);
  const [guestBreakfastOrderMaxAmount, setGuestBreakfastOrderMaxAmount] =
    useState(1);
  const [employeeLunchOrderMaxAmount, setEmployeeLunchOrderMaxAmount] =
    useState(1);
  const [guestLunchOrderMaxAmount, setGuestLunchOrderMaxAmount] = useState(1);
  const [breakFastEndTime, setBreakfastEndTime] = useState("12:00");
  const [breakFastStartTime, setBreakfastStartTime] = useState("00:00");
  const [lunchStartTime, setLunchStartTime] = useState("00:00");
  const [lunchEndTime, setLunchEndTime] = useState("12:00");
  const [ethiopianTime, setEthiopianTime] = useState("");
  const [isOrderOpened, setIsOrderOpened] = useState(false);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Fetch constraints from the server when the component mounts

    fetchConstraints();
  }, []);
  const fetchConstraints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getConstraint`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data.constraints;

      // Update the state with received constraint data
      setEmployeeBreakfastOrderMaxAmount(data.employeeBreakfastOrderMaxAmount);
      setGuestBreakfastOrderMaxAmount(data.guestBreakfastOrderMaxAmount);
      setEmployeeLunchOrderMaxAmount(data.employeeLunchOrderMaxAmount);
      setGuestLunchOrderMaxAmount(data.guestLunchOrderMaxAmount);
      setBreakfastStartTime(data.breakfastOrderTimeStart);
      setBreakfastEndTime(data.breakfastOrderTimeEnd);
      setLunchStartTime(data.lunchOrderTimeStart);
      setLunchEndTime(data.lunchOrderTimeEnd);
      setIsOrderOpened(data.orderOpened);
    } catch (error) {}
    setLoading(false);
  };

  const toggleOrderStatus = () => {
    setIsOrderOpened(!isOrderOpened);
  };

  const handleSave = async () => {
    setLoading(true);
    if (isEditable) {
      try {
        // Prepare the form data for debugging (you can remove this later)
        const formData = {
          employeeBreakfastOrderMaxAmount: parseInt(
            employeeBreakfastOrderMaxAmount
          ),
          guestBreakfastOrderMaxAmount: parseInt(guestBreakfastOrderMaxAmount),
          employeeLunchOrderMaxAmount: parseInt(employeeLunchOrderMaxAmount),
          guestLunchOrderMaxAmount: parseInt(guestLunchOrderMaxAmount),
          breakfastOrderTimeStart: formatTime12To24(breakFastStartTime),
          breakfastOrderTimeEnd: formatTime12To24(breakFastEndTime),
          lunchOrderTimeStart: formatTime12To24(lunchStartTime),
          lunchOrderTimeEnd: formatTime12To24(lunchEndTime),
          orderOpened: isOrderOpened,
        };

        // Now send the form data in the Axios request
        const response = await axios.post(
          `${BASE_URL}/changeConstraint`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data && response.data.message) {
          setErrorMessage(`በተሳካ ሁኔታ ተሻሽሏል!`);
          setOpen(true);

          setIsEditable(!isEditable);
        } else {
          setErrorMessage(`ልክ ያልሆነ ግብዓት`);
          setOpen(true);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          setErrorM(false);

          setErrorMessage(error.response.data.message);
          setOpen(true);
        } else {
          setErrorMessage("የኔቶርክ ወይም የቴክኒክ ችግር ተፈጥሯል፡ እንደገና ይሞክሩ");
          setOpen(true);
        }
      }
    }
    fetchConstraints();
    setLoading(false);
  };

  // Function to format 12-hour time to 24-hour time
  const formatTime12To24 = (time12) => {
    const [time, period] = time12.split(" ");
    let [hours, minutes] = time.split(":");
    if (period === "PM") {
      hours = parseInt(hours) + 12;
    }
    return `${hours}:${minutes}`;
  };

  const handleClick = () => {
    if (isEditable) {
      handleSave();
    }
    setIsEditable(!isEditable);
  };

  function convertToEthiopianTime(inputTime) {
    const [hours, minutes] = inputTime.split(":").map(Number);

    let zone;
    let eHours;
    const eMinutes = minutes;
    if (hours > 6 && hours < 12) {
      eHours = hours - 6;
      zone = " ጠዋት ";
    } else if (hours >= 12 && hours < 18) {
      eHours = hours - 6;
      zone = " ከሰአት ";
    } else if (hours >= 18 && hours < 24) {
      eHours = hours - 18;
      zone = " ምሽት ";
      if (hours == 18) {
        eHours = 12;
      }
    } else {
      eHours = hours + 6;
      zone = " ሌሊት ";
    }
    if (eMinutes > 0) {
      return ` ${zone} ${eHours} ሰአት ከ ${eMinutes} ደቂቃ`;
    } else {
      return ` ${zone} ${eHours} ሰአት`;
    }
  }

  return (
    <DashboardLayout>
      {userData.user.role == "student" ? (
        <NavbarForCommette />
      ) : userData.user.role == "dean" ? (
        <CafeManagerDashboardNavbar />
      ) : (
        <DashboardNavbar />
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
        <CashierSidenav
          color="dark"
          brand=""
          brandName="የገንዘብ ተቀባይ ክፍል መተግበሪያ"
        />
      )}

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
          ገደብ ማስተካከያ
        </MDTypography>
      </MDBox>
      <Grid
        container
        spacing={5}
        justifyContent="center"
        style={{ Width: "100%" }}
      >
        <Grid style={{ Width: "100%", gap: "10px" }} item xs={6}>
          <MDBox
            textAlign="center"
            style={{ Width: "70%", gap: "10px", marginBottom: "30px" }}
          >
            {" "}
            {/* Set your desired background color */}
            {isEditable ? (
              <MDButton
                variant="contained"
                onClick={toggleOrderStatus}
                disabled={!isEditable}
                color="primary"
              >
                {isOrderOpened ? "ካፌውን ዝጋ" : "ትዕዛዝ ተቀበል"}
              </MDButton>
            ) : isOrderOpened ? (
              <MDBox p={1} bgColor="light" borderRadius={4}>
                <MDTypography variant="h4" color="success">
                  ካፌው በስራ ሰአት ላይ ነው
                </MDTypography>
              </MDBox>
            ) : (
              <MDBox p={1} bgColor="primary" borderRadius={4}>
                {" "}
                {/* Set your desired background color */}
                <MDTypography variant="h4" color="error">
                  ካፌው ዝግ ነው
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
          <Card style={{ marginBottom: "15px", border: "3px solid #206A5D" }}>
            <MDBox p={3} textAlign="center">
              <MDTypography variant="h5">የቁርስ ማዘዣ ጊዜ</MDTypography>
              <Divider />

              <MDBox mb={2} sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  label="የመጀመሪያ ጊዜ"
                  type="time"
                  style={{ marginRight: "10px" }}
                  value={breakFastStartTime}
                  onChange={(e) => setBreakfastStartTime(e.target.value)}
                  disabled={!isEditable}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5-minute intervals
                  }}
                />
                <TextField
                  label="የመጨረሻ ጊዜ"
                  type="time"
                  value={breakFastEndTime}
                  onChange={(e) => setBreakfastEndTime(e.target.value)}
                  disabled={!isEditable}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300,
                  }}
                />
              </MDBox>

              <MDBox mt={2} display="flex" alignItems="center">
                {breakFastStartTime && breakFastEndTime ? (
                  <MDTypography variant="body2" sx={{ marginLeft: 2 }}>
                    ከ {convertToEthiopianTime(breakFastStartTime)} እስከ{" "}
                    {convertToEthiopianTime(breakFastEndTime)}
                  </MDTypography>
                ) : (
                  ""
                )}
              </MDBox>
            </MDBox>
          </Card>

          <Card style={{ border: "3px solid #206A5D" }}>
            <MDBox p={3} textAlign="center">
              <MDTypography variant="h5" style={{ fontWieght: "bold" }}>
                የምሳ ማዘዣ ጊዜ
              </MDTypography>
              <Divider />
              <MDBox mb={2} sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  label="የመጀመሪያ ጊዜ"
                  type="time"
                  style={{ marginRight: "10px" }}
                  value={lunchStartTime}
                  onChange={(e) => setLunchStartTime(e.target.value)}
                  disabled={!isEditable}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300,
                  }}
                />
                <TextField
                  label="የመጨረሻ ጊዜ"
                  type="time"
                  value={lunchEndTime}
                  onChange={(e) => setLunchEndTime(e.target.value)}
                  disabled={!isEditable}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5-minute intervals
                  }}
                />
              </MDBox>
              <MDBox mt={2}>
                {lunchStartTime && lunchEndTime ? (
                  <MDTypography variant="body2" sx={{ marginLeft: 2 }}>
                    ከ {convertToEthiopianTime(lunchStartTime)} እስከ{" "}
                    {convertToEthiopianTime(lunchEndTime)}
                  </MDTypography>
                ) : (
                  ""
                )}
              </MDBox>
            </MDBox>
          </Card>
        </Grid>

        <Grid item xs={6} style={{ maxHeight: "800px", overflowY: "auto" }}>
          <Card style={{ marginBottom: "15px", border: "3px solid #206A5D" }}>
            <MDBox p={1} textAlign="center" style={{ height: "100%" }}>
              <MDTypography variant="h6">የሰራተኛ ቁርስ ማዘዣ መጠን</MDTypography>
              <Divider />
              <MDBox mt={2}>
                <MDInput
                  label="መጠን"
                  type="number"
                  value={employeeBreakfastOrderMaxAmount}
                  onChange={(e) =>
                    setEmployeeBreakfastOrderMaxAmount(e.target.value)
                  }
                  disabled={!isEditable}
                  fullWidth
                />
              </MDBox>
            </MDBox>
          </Card>
          <Card style={{ marginBottom: "15px", border: "3px solid #206A5D" }}>
            <MDBox p={1} textAlign="center" style={{ height: "100%" }}>
              <MDTypography variant="h6">የሰራተኛ ምሳ የትዕዛዝ መጠን</MDTypography>
              <Divider />
              <MDBox mt={2}>
                <MDInput
                  label="መጠን"
                  type="number"
                  value={employeeLunchOrderMaxAmount}
                  onChange={(e) =>
                    setEmployeeLunchOrderMaxAmount(e.target.value)
                  }
                  disabled={!isEditable}
                  fullWidth
                />
              </MDBox>
            </MDBox>
          </Card>
          <Card style={{ marginBottom: "15px", border: "3px solid #206A5D" }}>
            <MDBox p={1} textAlign="center" style={{ height: "100%" }}>
              <MDTypography variant="h6">የእንግዳ ቁርስ ማዘዣ መጠን</MDTypography>
              <Divider />
              <MDBox mt={2}>
                <MDInput
                  label="መጠን"
                  type="number"
                  value={guestBreakfastOrderMaxAmount}
                  onChange={(e) =>
                    setGuestBreakfastOrderMaxAmount(e.target.value)
                  }
                  disabled={!isEditable}
                  fullWidth
                />
              </MDBox>
            </MDBox>
          </Card>
          <Card style={{ marginBottom: "15px", border: "3px solid #206A5D" }}>
            <MDBox p={1} textAlign="center" style={{ height: "100%" }}>
              <MDTypography variant="h6">የእንግዳ ምሳ ትእዛዝ መጠን</MDTypography>
              <Divider />
              <MDBox mt={2}>
                <MDInput
                  label="መጠን"
                  type="number"
                  value={guestLunchOrderMaxAmount}
                  onChange={(e) => setGuestLunchOrderMaxAmount(e.target.value)}
                  disabled={!isEditable}
                  fullWidth
                />
              </MDBox>
            </MDBox>
          </Card>
        </Grid>

        <MDBox p={2} textAlign="center" style={{ marginRight: "10px" }}>
          {loading ? (
            <MDBox textAlign="center">
              <CircularProgress color="info" />
            </MDBox>
          ) : (
            <MDButton
              onClick={handleClick}
              fullWidth
              color={isEditable ? "secondary" : "primary"}
            >
              {isEditable ? "አረጋግጥ" : "ገደብ ቀይር"}
            </MDButton>
          )}
        </MDBox>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            sx={{ color: "dark", fontWeight: "bold" }}
            id="alert-dialog-title"
          >
            {errorM ? "ማረጋገጫ" : "ስህተት ተፈጥሯል"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {errorMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
                setErrorMessage("");
                setErrorM(true);
              }}
              color="success"
              variant="contained"
            >
              ዝጋ
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </DashboardLayout>
  );
}
