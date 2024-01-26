import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import axios from "axios";
import { BASE_URL } from "../../appconfig";

import CafeCommetteDashboard from "../CafeCommetteDashboard";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Button, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import storeKeeperSidenav from "../../examples/Sidenav/storeKeeperSidenav";

function InventoryEntry() {
  const [name, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [selectedMeasuredIn, setSelectedMeasuredIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    quantity: "",
    itemPrice: "",
    approvedBy: "",
  });
  const measuredInOptions = ["kg", "packet", "liter"];
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const CircularLoader = () => <CircularProgress size={24} color="inherit" />;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const isInputValid = (input, fieldName) => {
    if (fieldName === "name" || fieldName === "approvedBy") {
      // Allow letters and spaces in "Item Name" and "Approved By"
      const letterRegex = /^[A-Za-z\s]*$/;
      return letterRegex.test(input);
    } else if (fieldName === "quantity" || fieldName === "itemPrice") {
      // Allow numbers in "Quantity" and "Item Price"
      const numberRegex = /^[0-9]*$/;
      return numberRegex.test(input);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (!isInputValid(value, name)) {
      return; // Prevent updating state for invalid input
    }

    // Update the state directly based on the input name
    if (name === "name") {
      setItemName(value);
    } else if (name === "approvedBy") {
      setApprovedBy(value);
    } else {
      // For other input fields, you can handle them similarly
      if (name === "quantity") {
        setQuantity(value);
      } else if (name === "itemPrice") {
        setItemPrice(value);
      }
    }
  };

  const handleFormSubmit = async () => {
    const newErrorMessages = {
      name: name ? "" : "የእቃው አይነት ስም ያስፈልጋል",
      quantity: quantity ? "" : "ብዛት ያስፈልጋል",
      measuredIn: selectedMeasuredIn !== "" ? "" : "መለኪያ አይነት",
      itemPrice: itemPrice ? "" : "የአንዱ ዋጋ ያስፈልጋል",
      approvedBy: approvedBy ? "" : "የፈቀደው ስም ያስፈልጋል",
    };
    setErrorMessages(newErrorMessages);
    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("እባክዎ ሁሉንም መስኮች ይሙሉ።");
      setOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/inventory`,
        {
          name,
          quantity,
          measuredIn: selectedMeasuredIn,
          itemPrice,
          approvedBy,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setLoading(false);
      if (response.data) {
        setErrorMessage("እቃዎች በተሳካ ሁኔታ ታክለዋል!");
        setOpen(true);
        setItemName("");
        setQuantity("");
        setSelectedMeasuredIn("");
        setItemPrice("");
        setApprovedBy("");
      } else {
        setErrorMessage("የምዝገባ ምላሽ አልያዘም።");
        setOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const serverErrorMessages = error.response.data.errors;
        let errorMessage = "ምዝገባ አልተሳካም: ";
        for (const [key, value] of Object.entries(serverErrorMessages)) {
          errorMessage += `${key}: ${value[0]}, `;
        }
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("ምዝገባ አልተሳካም: " + error);
      }
      setOpen(true);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"ማስታወቂያ"}</DialogTitle>
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
            ዝጋ
          </Button>
        </DialogActions>
      </Dialog>
      <DashboardNavbar />
      <Sidenav />
      {/* <NavbarForCommette />
      <storeKeeperSidenav color="dark" brand="" brandName="የስቶር ክፍል መተግበሪያ" /> */}
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={2}
                py={3}
                px={2}
                variant="gradient"
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  የእቃዎች ማስገቢያ ቅጽ
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="የእቃው አይነት ስም"
                      variant="standard"
                      fullWidth
                      value={name}
                      name="name"
                      onChange={handleFormChange}
                      margin="normal"
                      required
                      error={!!errorMessages.name}
                      helperText={errorMessages.name}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="number"
                      label="ብዛት"
                      variant="standard"
                      fullWidth
                      value={quantity}
                      name="quantity"
                      onChange={handleFormChange}
                      margin="normal"
                      required
                      error={!!errorMessages.quantity}
                      helperText={errorMessages.quantity}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <TextField
                      select
                      label="መለኪያ"
                      variant="standard"
                      fullWidth
                      value={selectedMeasuredIn}
                      name="measuredIn"
                      onChange={(event) =>
                        setSelectedMeasuredIn(event.target.value)
                      }
                      margin="normal"
                      required
                      error={!!errorMessages.measuredIn}
                      helperText={errorMessages.measuredIn}
                    >
                      {measuredInOptions.map((measuredIn, index) => (
                        <MenuItem key={index} value={measuredIn}>
                          {measuredIn}
                        </MenuItem>
                      ))}
                    </TextField>
                  </MDBox>

                  <MDBox mb={2}>
                    <MDInput
                      type="number"
                      label="የአንዱ ዋጋ"
                      variant="standard"
                      fullWidth
                      value={itemPrice}
                      name="itemPrice"
                      onChange={handleFormChange}
                      margin="normal"
                      required
                      error={!!errorMessages.itemPrice}
                      helperText={errorMessages.itemPrice}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="የፈቀደው ስም"
                      variant="standard"
                      fullWidth
                      value={approvedBy}
                      name="approvedBy"
                      onChange={handleFormChange}
                      margin="normal"
                      required
                      error={!!errorMessages.approvedBy}
                      helperText={errorMessages.approvedBy}
                    />
                  </MDBox>

                  <MDBox mt={4} mb={1} textAlign="center">
                    <MDButton
                      variant="gradient"
                      color="info"
                      onClick={handleFormSubmit}
                    >
                      {loading ? <CircularLoader /> : "አስገባ"}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default InventoryEntry;
