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
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CafeCommetteDashboard from "../CafeCommetteDashboard";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { Button, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function StockRequest() {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    // itemPrice: "",
    requestedBy: "",
    measuredIn: "",
    date: "",
  });
  const [selectedmeasuredIn, setSelectMeasuredIn] = useState("");
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    quantity: "",
    // itemPrice: "",
    requestedBy: "",
    measuredIn: "",
    date: "",
  });
  const measuredInOptions = ["kg", "packet", "liter"];
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;

  // State to track the index of the form to be removed
  const [removeIndex, setRemoveIndex] = useState(null);

  // Function to open the confirmation dialog for remove
  const openRemoveDialog = (index) => {
    setRemoveIndex(index);
  };

  // Function to close the confirmation dialog for remove
  const closeRemoveDialog = () => {
    setRemoveIndex(null);
  };

  // Function to remove a form after confirmation
  const confirmRemoveForm = () => {
    if (removeIndex !== null) {
      const updatedFormList = [...formList];
      updatedFormList.splice(removeIndex, 1);
      setFormList(updatedFormList);
      closeRemoveDialog(); // Close the confirmation dialog
    }
  };

  const isInputValid = (input) => {
    const letterRegex = /^[A-Za-z\s]+$/;

    return letterRegex.test(input);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" || name === "requestedBy") {
      if (!isInputValid(value)) {
        // Reset the state for this input to clear the first letter
        setFormData({
          ...formData,
          [name]: "",
        });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  const addForm = () => {
    const newErrorMessages = {
      name: formData.name ? "" : "Item Name is required.",
      quantity: formData.quantity ? "" : "Quantity is required.",
      measuredIn: formData.measuredIn ? "" : "Measured In is required.",
      // itemPrice: formData.itemPrice ? "" : "Item Price is required.",
      requestedBy: formData.requestedBy ? "" : "Requested By is required.",
      date: formData.date ? "" : "Date is required.",
    };
    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("Please fill in all fields.");
      setOpen(true);
      return;
    }

    setFormList([...formList, formData]);
    setFormData({
      name: "",
      quantity: "",
      // itemPrice: "",
      requestedBy: "",
      measuredIn: "",
      date: "",
    });
  };

  const submitForms = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/stockrequest`,
        JSON.stringify(formList),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Handle the response

      setLoading(false);
      setErrorMessage("Forms submitted successfully!");
      setOpen(true);
      setFormList([]);
    } catch (error) {
      setErrorMessage("Submission failed: " + error);
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
      {userData.user.role == "cashier" ? (
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
                  stock Items Entry
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                <MDBox component="form" role="form">
                  <MDInput
                    type="text"
                    name="name"
                    label="Item Name"
                    variant="standard"
                    fullWidth
                    value={formData.name}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.name}
                    helperText={errorMessages.name}
                  />
                  <MDInput
                    type="number"
                    name="quantity"
                    label="Quantity"
                    variant="standard"
                    fullWidth
                    value={formData.quantity}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.quantity}
                    helperText={errorMessages.quantity}
                  />
                  <MDBox mb={2}>
                    <TextField
                      select
                      label="Measured In"
                      variant="standard"
                      fullWidth
                      value={formData.measuredIn || ""}
                      onChange={handleFormChange}
                      name="measuredIn"
                      margin="dense"
                      required
                      error={!!errorMessages.measuredIn}
                      helperText={errorMessages.measuredIn}
                    >
                      <MenuItem value="">Select Units</MenuItem>
                      {measuredInOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </MDBox>
                  {/* <MDInput
                    type="number"
                    name="itemPrice"
                    label="Item Price"
                    variant="outlined"
                    fullWidth
                    value={formData.itemPrice}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.itemPrice}
                    helperText={errorMessages.itemPrice}
                  /> */}
                  <MDInput
                    type="text"
                    name="requestedBy"
                    label="Requested By"
                    variant="standard"
                    fullWidth
                    value={formData.requestedBy}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.requestedBy}
                    helperText={errorMessages.requestedBy}
                  />
                  <MDInput
                    type="date"
                    name="date"
                    label="Date"
                    variant="standard"
                    fullWidth
                    value={formData.date}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.date}
                    helperText={errorMessages.date}
                  />
                  <MDBox mt={4} mb={1} textAlign="center">
                    <MDButton variant="gradient" color="info" onClick={addForm}>
                      Add Form
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Display the list of forms */}
      <Card>
        <MDBox pt={3} pb={3} px={2}>
          <TableContainer
            component={Paper}
            elevation={3}
            style={{ marginTop: 20 }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Item Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Quantity</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Measured In</strong>
                  </TableCell>
                  {/* <TableCell>Item Price</TableCell> */}
                  <TableCell>
                    <strong>Requested By</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableBody>
                {formList.map((form, index) => (
                  <TableRow key={index}>
                    <TableCell>{form.name}</TableCell>
                    <TableCell>{form.quantity}</TableCell>
                    <TableCell>{form.measuredIn}</TableCell>
                    {/* <TableCell>{form.itemPrice}</TableCell> */}
                    <TableCell>{form.requestedBy}</TableCell>
                    <TableCell>{form.date}</TableCell>
                    <TableCell align="center">
                      <MDButton
                        variant="outlined"
                        color="error"
                        onClick={() => openRemoveDialog(index)}
                      >
                        Remove
                      </MDButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MDBox>
      </Card>

      {/* Confirmation Dialog for Remove */}
      <Dialog
        open={removeIndex !== null}
        onClose={closeRemoveDialog}
        aria-labelledby="remove-dialog-title"
        aria-describedby="remove-dialog-description"
      >
        <DialogTitle id="remove-dialog-title">Remove Item</DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-dialog-description">
            Are you sure you want to remove this item from the list?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRemoveDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmRemoveForm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit button */}
      <MDBox mt={4} mb={1} textAlign="center">
        <MDButton
          variant="gradient"
          color="info"
          onClick={submitForms}
          disabled={formList.length === 0 || loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Forms"}
        </MDButton>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default StockRequest;
