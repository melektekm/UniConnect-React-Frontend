
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import CashierDashboard from "../CashierDashboard";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
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
import { Button } from "@mui/material";


import CircularProgress from "@mui/material/CircularProgress";
function MoneyTransaction() {
    const electron = window.require("electron");
    const ipcRenderer = electron.ipcRenderer;
    const userData = ipcRenderer.sendSync("get-user");
  const [employeeId, setEmployeeId] = useState('');
  const [employeeFullName, setEmployeeFullName] = useState('');
  const [moneyAmount, setMoneyAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const accessToken = userData.accessToken
  const CircularLoader = () => <CircularProgress size={24} color="inherit" />;


  useEffect(() => {
    const previousRoute = sessionStorage.getItem("previous Route");
  
    if (previousRoute) {
      const employeeIdValue = parseInt(previousRoute, 10);
  
      (async () => {
        setEmployeeId(employeeIdValue);
        sessionStorage.removeItem("previous Route");
      })();
    }
  }, []);
  
  useEffect(() => {
    if (employeeId !== "") {
      handleFindEmployee();
    }
  }, [employeeId]);
  
  
  const handleFindEmployee = async () => {
    // Fetch the employee's full name based on the employee ID
    try {
        const response = await axios.get(`${BASE_URL}/getEmployeeById/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data && response.data.employeeFullName) {
          setEmployeeFullName("Employee Name: " + response.data.employeeFullName);
        } else {
          setEmployeeFullName('Employee not found'); // Handle the case where the employee is not found
        }
      } catch (error) {
        setEmployeeFullName('Employee not found'); // Handle the error
      }
      
  };

  const handleTransaction = async (transactionType) => {
    // Validate and process the money transaction (deposit, withdraw, refund)
    setLoading(true);
   
    try {
      let response;
      console.log(transactionType);
      if (transactionType === 'deposit') {
        console.log(transactionType);
        response = await axios.post(
          `${BASE_URL}/depositMoney/${employeeId}`,
          {
            amount: moneyAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else if (transactionType === 'withdraw') {
        response = await axios.post(
          `${BASE_URL}/withdrawMoney/${employeeId}`,
          {
            amount: moneyAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else if (transactionType === 'refund') {
        response = await axios.post(
          `${BASE_URL}/addRefund/${employeeId}`,
          {
            amount: moneyAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
  
      setLoading(false);
  
      if (response.data) {
        // Handle success
        setErrorMessage(`${transactionType} successful!`);
        setOpen(true);
        // Clear form fields
        setEmployeeId('');
        setEmployeeFullName('');
        setMoneyAmount('');
      } else {
        setErrorMessage(`${transactionType} failed: No response data.`);
        setOpen(true);
      }
    } catch (error) {
   
      setErrorMessage(`${transactionType} failed: ${error.message}`);
      setOpen(true);
      setLoading(false);
    }
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
        Deposit
        </MDTypography>
      </MDBox>
    <MDBox mx={4} my={3}>
    <MDBox mb={2}>
  <MDInput
    type="text"
    label="Employee ID"
    fullWidth
    value={employeeId}
    onChange={(e) => setEmployeeId(e.target.value)}
    required
    sx={{ width: '150px' }} 
  />
</MDBox>
<MDBox display="flex" alignItems="center" my={2}> {/* Add my={2} for 16px vertical spacing */}
  <MDButton variant="contained" color="secondary" onClick={handleFindEmployee}>
    Find Employee
  </MDButton>
  <MDTypography variant="body1" ml={2}>
    {employeeFullName}
  </MDTypography>
</MDBox>
<MDBox mb={2}>
  <MDInput
    type="text"
    label="Money Amount"
    sx={{ width: '150px' }} 
    fullWidth
    value={moneyAmount}
    onChange={(e) => setMoneyAmount(e.target.value)}
    required
  />
</MDBox>

      <MDBox display="flex"  mt={3}>
  <MDButton variant="contained" color="secondary" onClick={() => handleTransaction('deposit')}>
    Deposit
  </MDButton>
  <MDBox mx={2}></MDBox> {/* Add spacing */}
  <MDButton variant="contained" color="secondary" onClick={() => handleTransaction('withdraw')}>
    Withdraw
  </MDButton>
  <MDBox mx={2}></MDBox> {/* Add spacing */}
  <MDButton variant="contained" color="secondary" onClick={() => handleTransaction('refund')}>
    Refund
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
    </MDBox>

    </DashboardLayout>
  );

}

export default MoneyTransaction;

