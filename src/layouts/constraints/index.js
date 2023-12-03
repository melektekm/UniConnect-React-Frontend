import React, { useState,  useEffect } from "react";
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



export default function Constraint() {
       const electron = window.require("electron");
    const ipcRenderer = electron.ipcRenderer;
    const userData = ipcRenderer.sendSync("get-user");
    const accessToken = userData.accessToken;
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  

    const [isEditable, setIsEditable] = useState(false);
    const [employeeBreakfastOrderMaxAmount, setEmployeeBreakfastOrderMaxAmount] =
      useState(1);
    const [guestBreakfastOrderMaxAmount, setGuestBreakfastOrderMaxAmount] =
      useState(1);
    const [employeeLunchOrderMaxAmount, setEmployeeLunchOrderMaxAmount] =
      useState(1);
    const [guestLunchOrderMaxAmount, setGuestLunchOrderMaxAmount] =
      useState(1);
    const [breakFastEndTime, setBreakfastEndTime] = useState("12:00");
    const [breakFastStartTime, setBreakfastStartTime] = useState("00:00");
    const [lunchStartTime, setLunchStartTime] = useState("00:00");
    const [lunchEndTime, setLunchEndTime] = useState("12:00");
    const [isOrderOpened, setIsOrderOpened] = useState(false);

 


  



  useEffect(() => {
    // Fetch constraints from the server when the component mounts
    const fetchConstraints = async () => {
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
      } catch (error) {
        console.error("Error fetching constraints:", error);
      }
    };
  
    fetchConstraints();
  }, []);

    const toggleOrderStatus = () => {
      setIsOrderOpened(!isOrderOpened);
    };
  
    const handleSave = async () => {
        if (isEditable) {
            console.log("access:"+accessToken);
          try {
            // Prepare the form data for debugging (you can remove this later)
            const formData = {
              employeeBreakfastOrderMaxAmount: parseInt(employeeBreakfastOrderMaxAmount),
              guestBreakfastOrderMaxAmount: parseInt(guestBreakfastOrderMaxAmount),
              employeeLunchOrderMaxAmount: parseInt(employeeLunchOrderMaxAmount),
              guestLunchOrderMaxAmount: parseInt(guestLunchOrderMaxAmount),
              breakfastOrderTimeStart: formatTime12To24(breakFastStartTime),
              breakfastOrderTimeEnd: formatTime12To24(breakFastEndTime),
              lunchOrderTimeStart: formatTime12To24(lunchStartTime),
              lunchOrderTimeEnd: formatTime12To24(lunchEndTime),
              orderOpened: isOrderOpened,
            };
          
            console.log('Form Data:', formData);
      
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
                setErrorMessage(`Guest order successful!`);
                 setOpen(true);
            } else {
                setErrorMessage(`invaid data`);
                setOpen(true);
            }
          } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(e.response.data.message);
                setOpen(true);;
            } else {
                setErrorMessage(e.message);
                setOpen(true);
            }
          }
        }
      
        setIsEditable(!isEditable);
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

  return (
        
    <DashboardLayout>
    {userData.user.role == 'cashier' ? <DashboardNavbar />  : <NavbarForCommette /> } 
    <CashierDashboard />
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
        <MDTypography variant="h6" color="white">
        Constraint
        </MDTypography>
      </MDBox>
      <Grid container spacing={5} justifyContent="center" style={{ Width: "100%"}} xs={12} alignItems="center" >
        <Grid style={{ Width: "100%", gap:"10px" }} spacing={4}  item xs={6}>
          <Card style={{ marginBottom: "15px"}}>
          <MDBox p={3}>
  <MDTypography variant="h6">Breakfast Order Time</MDTypography>
  <Divider />
  <MDBox mt={2}>
    <TextField
      label="Start Time"
      type="time"
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
  </MDBox>
  <MDBox mt={2}>
    <TextField
      label="End Time"
      type="time"
      value={breakFastEndTime}
      onChange={(e) => setBreakfastEndTime(e.target.value)}
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
</MDBox>

          </Card>

          <Card>
          <MDBox p={3}>
  <MDTypography variant="h6">Lunch Order Time</MDTypography>
  <Divider />
  <MDBox mt={2}>
    <TextField
      label="Start Time"
      type="time"
      value={lunchStartTime}
      onChange={(e) => setLunchStartTime(e.target.value)}
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
    <TextField
      label="End Time"
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
</MDBox>

          </Card>

        
        </Grid>

        <Grid spacing={10} item xs={6}>
         
        <Card style={{ marginBottom: "15px"}}>
            <MDBox p={3}>
              <MDTypography variant="h6">Employee Breakfast Order Amount</MDTypography>
              <Divider />
              <MDBox mt={2}>
                <MDInput
                  label="Amount"
                  type="number" 
                  value={employeeBreakfastOrderMaxAmount}
                  onChange={(e) => setEmployeeBreakfastOrderMaxAmount(e.target.value)}
                  disabled={!isEditable}
                  fullWidth
                />
              </MDBox>
            </MDBox>
          </Card>
          <Card style={{ marginBottom: "15px"}}>
            <MDBox p={3}>
              <MDTypography variant="h6">Employee Lunch Order Amount</MDTypography>
              <Divider />
              <MDBox mt={2}>
                <MDInput
                  label="Amount"
                  type="number" 
                  value={employeeLunchOrderMaxAmount}
                  onChange={(e) => setEmployeeLunchOrderMaxAmount(e.target.value)}
                  disabled={!isEditable}
                  fullWidth
                />
              </MDBox>
            </MDBox>
          </Card>
          <Card style={{ marginBottom: "15px"}}>
            <MDBox p={3}>
              <MDTypography variant="h6">Guest Breakfast Order Amount</MDTypography>
              <Divider />
              <MDBox mt={2}>
                <MDInput
                  label="Amount"
                  type="number" 
                  value={guestBreakfastOrderMaxAmount}
                  onChange={(e) => setGuestBreakfastOrderMaxAmount(e.target.value)}
                  disabled={!isEditable}
                  fullWidth
                />
              </MDBox>
            </MDBox>
          </Card>
          <Card style={{ marginBottom: "15px"}}>
            <MDBox p={3}>
              <MDTypography variant="h6">Guest Lunch Order Amount</MDTypography>
              <Divider />
              <MDBox mt={2}>
                <MDInput
                  label="Amount"
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
        
            <MDBox p={2} textAlign="center" style={{ marginRight: "10px"}}>
              <MDButton
                variant="contained"
                onClick={handleClick}
                fullWidth
                color={isEditable ? "primary" : "secondary"}
              >
                {isEditable ? "Save" : "Edit"}
              </MDButton>
            </MDBox>
          
          
          
            <MDBox p={2} textAlign="center" >
              <MDButton
                variant="contained"
                onClick={toggleOrderStatus}
                disabled={!isEditable}
                fullWidth
                color={isEditable ? "primary" : "secondary"}
              >
                { (isOrderOpened ? "Close Order" : "Open Order") }
              </MDButton>
             
            </MDBox>
            
          
          <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Notification"}</DialogTitle>
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
            }}
            color="primary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </Grid>
    </DashboardLayout>
  );
}
