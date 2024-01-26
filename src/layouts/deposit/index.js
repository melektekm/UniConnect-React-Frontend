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
import CashierSidenav from "../../examples/Sidenav/CashierSidenav";
import EmployeeInfo from "./employeeInfo";
function MoneyTransaction() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeFullName, setEmployeeFullName] = useState("");
  const [moneyAmount, setMoneyAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const accessToken = userData.accessToken;
  const CircularLoader = () => <CircularProgress size={24} color="inherit" />;
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [showDepositConfirmation, setShowDepositConfirmation] = useState(false);
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] =
    useState(false);
  const [showRefundConfirmation, setShowRefundConfirmation] = useState(false);

  const handleOpenDepositConfirmation = () => {
    setShowDepositConfirmation(true);
  };

  const handleOpenWithdrawConfirmation = () => {
    setShowWithdrawConfirmation(true);
  };

  const handleOpenRefundConfirmation = () => {
    setShowRefundConfirmation(true);
  };

  const handleDepositTransaction = () => {
    handleTransaction("deposit");

    // Close the deposit confirmation dialog
    setShowDepositConfirmation(false);
  };

  const handleWithdrawTransaction = () => {
    handleTransaction("withdraw");

    // Close the withdraw confirmation dialog
    setShowWithdrawConfirmation(false);
  };

  const handleRefundTransaction = () => {
    handleTransaction("refund");

    // Close the refund confirmation dialog
    setShowRefundConfirmation(false);
  };

  useEffect(() => {
    const previousRoute = sessionStorage.getItem("previous Search");

    if (previousRoute) {
      const employeeIdValue = parseInt(previousRoute, 10);

      setEmployeeId(employeeIdValue);
      sessionStorage.removeItem("previous Route");
    }
  }, []);

  useEffect(() => {
    if (employeeId !== "") {
      handleFindEmployee();
    }
  }, [employeeId]);

  const handleFindEmployee = async () => {
    try {
      setIsSearching(true);

      const responseEmployee = await axios.get(
        `${BASE_URL}/getEmployeeById/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (responseEmployee.data && responseEmployee.data.employeeFullName) {
        const employeeFullName = responseEmployee.data.employeeFullName;

        // Fetch the account balance
        const responseAccount = await axios.get(
          `${BASE_URL}/getAccount/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (responseAccount.data && responseAccount.data.account) {
          const currentBalance = responseAccount.data.account;

          setEmployeeInfo({
            name: employeeFullName,
            id: employeeId,
            balance: currentBalance,
          });
        } else {
          setEmployeeInfo(null);
        }
      } else {
        setEmployeeInfo(null);
      }
    } catch (error) {
      setEmployeeInfo(null);
    }
    setIsSearching(false);
  };

  const handleTransaction = async (transactionType) => {
    // Check if the employeeId is entered
    if (!employeeId) {
      setErrorMessage("እባክዎ መጀመሪያ የሰራተኛ መታወቂያ ቁጥሩን ያስገቡ።");
      setOpen(true);
      return;
    }

    // Validate and process the money transaction (deposit, withdraw, refund)
    setLoading(true);

    try {
      let response;

      if (transactionType === "deposit") {
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
      } else if (transactionType === "withdraw") {
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
      } else if (transactionType === "refund") {
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
        setErrorMessage(`${transactionType} ስኬታማ ነው።!`);
        setOpen(true);
        // Clear form fields
        setEmployeeId("");
        setEmployeeFullName("");
        setMoneyAmount("");
      } else {
        setErrorMessage(`${transactionType} አልተሳካም: ምንም የምላሽ የለም`);
        setOpen(true);
      }
    } catch (error) {
      setErrorMessage(`${transactionType} አልተሳካም፡ እባክዎ እንደገና ይሞክሩ`);
      setOpen(true);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {userData.user.role == "coordinator" ? (
        <DashboardNavbar />
      ) : (
        <NavbarForCommette />
      )}
      <CashierSidenav color="dark" brand="" brandName="የገንዘብ ተቀባይ ክፍል መተግበሪያ" />
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
          ገቢ ገንዘብ
        </MDTypography>
      </MDBox>
      <MDBox
        sx={{
          border: "8px solid #016A70",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          padding: "20px",
        }}
        mx={4}
        my={3}
      >
        <MDBox>
          <MDInput
            type="text"
            label="የሰራተኛ መታወቂያ ቁጥር"
            fullWidth
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            sx={{ width: "100%" }}
          />

          <MDBox display="flex" alignItems="center" my={2}></MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="የገንዘብ መጠን"
              sx={{ width: "100%" }}
              fullWidth
              value={moneyAmount}
              onChange={(e) => setMoneyAmount(e.target.value)}
              required
            />
          </MDBox>

          <MDBox display="flex" mt={3}>
            <MDButton
              variant="contained"
              color="primary"
              onClick={handleOpenDepositConfirmation}
            >
              አስገባ
            </MDButton>
            <MDBox mx={2}></MDBox> {/* Add spacing */}
            <MDButton
              variant="contained"
              color="error"
              onClick={handleOpenWithdrawConfirmation}
            >
              ማውጣት
            </MDButton>
            <MDBox mx={2}></MDBox> {/* Add spacing */}
            <MDButton
              variant="contained"
              color="dark"
              onClick={handleOpenRefundConfirmation}
            >
              ተመላሽ ገንዘብ
            </MDButton>
          </MDBox>
        </MDBox>

        <MDBox
          sx={{
            border: "3px solid #016A70",
            padding: "10px",
            display: `${employeeId ? "" : "none"}`,
          }}
        >
          <EmployeeInfo info={employeeInfo} isSearching={isSearching} />
        </MDBox>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{ style: { padding: "15px" } }}
        >
          <DialogTitle id="alert-dialog-title">{"ማስታወቂያ"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {errorMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MDButton
              onClick={() => {
                setOpen(false);
                setErrorMessage("");
              }}
              color="primary"
              variant="contained"
              style={{ borderRadius: "10%" }}
            >
              <h4 style={{ color: "white" }}> ዝጋ </h4>
            </MDButton>
          </DialogActions>
        </Dialog>
        <Dialog
          open={showDepositConfirmation}
          onClose={() => setShowDepositConfirmation(false)}
          aria-labelledby="deposit-confirmation-dialog-title"
          aria-describedby="deposit-confirmation-dialog-description"
          PaperProps={{ style: { padding: "15px" } }}
        >
          <DialogTitle id="deposit-confirmation-dialog-title">
            {"ማረጋገጫ"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="deposit-confirmation-dialog-description">
              የገንዘብ ማስገባት ሒደቱን ለማከናዎን እርግጠኛ ነዎት?
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ justifyContent: "space-between" }}>
            <MDButton
              onClick={() => setShowDepositConfirmation(false)}
              color="error"
              variant="contained"
              style={{ borderRadius: "10%" }}
            >
              <h4 style={{ color: "white" }}>አይ</h4>
            </MDButton>
            <MDButton
              onClick={handleDepositTransaction} // Confirm the deposit transaction
              color="primary"
              variant="contained"
              style={{ borderRadius: "10%" }}
            >
              <h4 style={{ color: "white" }}>አዎ</h4>
            </MDButton>
          </DialogActions>
        </Dialog>

        <Dialog
          open={showWithdrawConfirmation}
          onClose={() => setShowWithdrawConfirmation(false)}
          aria-labelledby="withdraw-confirmation-dialog-title"
          aria-describedby="withdraw-confirmation-dialog-description"
          PaperProps={{ style: { padding: "15px" } }}
        >
          <DialogTitle id="withdraw-confirmation-dialog-title">
            {"ማረጋገጫ"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="withdraw-confirmation-dialog-description">
              የገንዘብ ማውጣት ሒደቱን ለማከናዎን እርግጠኛ ነዎት?
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ justifyContent: "space-between" }}>
            <MDButton
              onClick={() => setShowWithdrawConfirmation(false)}
              color="error"
              variant="contained"
              style={{ borderRadius: "10%" }}
            >
              <h4 style={{ color: "white" }}>አይ</h4>
            </MDButton>
            <MDButton
              onClick={handleWithdrawTransaction} // Confirm the withdraw transaction
              color="primary"
              variant="contained"
              style={{ borderRadius: "10%" }}
            >
              <h4 style={{ color: "white" }}>አዎ</h4>
            </MDButton>
          </DialogActions>
        </Dialog>
        <Dialog
          open={showRefundConfirmation}
          onClose={() => setShowRefundConfirmation(false)}
          aria-labelledby="refund-confirmation-dialog-title"
          aria-describedby="refund-confirmation-dialog-description"
          PaperProps={{ style: { padding: "15px" } }}
        >
          <DialogTitle id="refund-confirmation-dialog-title">
            {"ማረጋገጫ"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="refund-confirmation-dialog-description">
              ገንዘብ ተመላሽ የማድረግ ሒደቱን ለማከናዎን እርግጠኛ ነዎት?
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ justifyContent: "space-between" }}>
            <MDButton
              onClick={() => setShowRefundConfirmation(false)}
              color="error"
              variant="contained"
              style={{ borderRadius: "10%" }}
            >
              <h4 style={{ color: "white" }}>አይ</h4>
            </MDButton>
            <MDButton
              onClick={handleRefundTransaction} // Confirm the refund transaction
              color="primary"
              variant="contained"
              style={{ borderRadius: "15%" }}
            >
              <h4 style={{ color: "white" }}>አዎ</h4>
            </MDButton>
          </DialogActions>
        </Dialog>
      </MDBox>
    </DashboardLayout>
  );
}

export default MoneyTransaction;
