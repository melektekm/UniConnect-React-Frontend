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
  const isInputValid = (input) => {
    const letterRegex = /^[A-Za-z\s]*$/; // Allow letters and spaces, including an empty string
    return letterRegex.test(input);
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" || name === "approvedBy") {
      if (!isInputValid(value)) {
        return; // Prevent updating state for invalid input
      }
    }

    // Update the state directly based on the input name
    if (name === "name") {
      setItemName(value);
    } else if (name === "approvedBy") {
      setApprovedBy(value);
    } else {
      // For other input fields, you can handle them similarly
      // e.g., setQuantity(value), setItemPrice(value), etc.
    }
  };
  const handleFormSubmit = async () => {
    const newErrorMessages = {
      name: name ? "" : "Item Name is required.",
      quantity: quantity ? "" : "Quantity is required.",
      measuredIn: selectedMeasuredIn !== "" ? "" : "Measured In is required",
      itemPrice: itemPrice ? "" : "Item Price is required.",
      approvedBy: approvedBy ? "" : "Approved By is required.",
    };
    setErrorMessages(newErrorMessages);
    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("Please fill in all fields.");
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
        setErrorMessage("Items added successfully!");
        setOpen(true);
        setItemName("");
        setQuantity("");
        setSelectedMeasuredIn("");
        setItemPrice("");
        setApprovedBy("");
      } else {
        setErrorMessage("Registration response does not contain data.");
        setOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const serverErrorMessages = error.response.data.errors;
        let errorMessage = "Registration failed: ";
        for (const [key, value] of Object.entries(serverErrorMessages)) {
          errorMessage += `${key}: ${value[0]}, `;
        }
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("Registration failed: " + error);
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
      {userData.user.role === "cashier" ? (
        <DashboardNavbar absolute isMini />
      ) : (
        <NavbarForCommette />
      )}
      <CafeCommetteDashboard />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Inventory Items Entry
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Item Name"
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
                      label="Quantity"
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
                      label="Measured In"
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
                      label="Item Price"
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
                      label="Approved By"
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
                      {loading ? <CircularLoader /> : "Submit"}
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
