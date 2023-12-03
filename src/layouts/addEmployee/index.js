import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import AdminNavbar from "../../examples/Navbars/AdminNavbar";
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
import { Dropdown } from "@mui/base/Dropdown";

function AddEmployee() {
  const [name, setName] = useState("");
  // const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    department: "",
    position: "",
    email: "",
  });
  const departmentOptions = [
    "Department 1",
    "Department 2",
    "Department 3",
    // Add more departments as needed
  ];
  
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [loading, setLoading] = useState(false);
  const CircularLoader = () => <CircularProgress size={24} color="inherit" />;

  // ...

  // Get the access token
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken
  const handleRegister = async () => {
    const newErrorMessages = {
      name: name ? "" : "Name is required.",
      department: selectedDepartment ? "" : "Department is required.",
      position: position ? "" : "Position is required.",
      email: email ? "" : "Email is required.",
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
        `${BASE_URL}/auth/admin/addEmployee`,
        {
          name,
          department: selectedDepartment,
          position,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Other headers...
          },
        }
      );

      if (response.data) {
        // Clear the input fields after successful registration
        setName("");
        // setDepartment("");
        setSelectedDepartment("");
        setPosition("");
        setEmail("");

        setErrorMessage("Employee added successfully!");
        setOpen(true);
      } else {
        setErrorMessage("Registration response does not contain data.");
        setOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Parse the error messages from the server's response
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
    } finally {
      // Reset loading state when registration finishes (whether it succeeded or failed)
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
      <AdminNavbar />
      <MainDashboard />
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
                  Register
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Name"
                      variant="standard"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      margin="normal"
                      required
                      error={!!errorMessages.name}
                      helperText={errorMessages.name}
                    />
                  </MDBox>
                  {/* <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Department"
                      variant="outlined"
                      fullWidth
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      margin="normal"
                      required
                      error={!!errorMessages.department}
                      helperText={errorMessages.department}
                    />
                  </MDBox> */}
                   <MDBox mb={2}>
              <TextField
                select
                label="Department"
                variant="standard"
                fullWidth
                value={selectedDepartment}
                onChange={(event) =>
                  setSelectedDepartment(event.target.value)
                }
                margin="normal"
                required
                error={!!errorMessages.department}
                helperText={errorMessages.department}
              >
                {departmentOptions.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </TextField>
            </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Position"
                      variant="standard"
                      fullWidth
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      margin="normal"
                      required
                      error={!!errorMessages.position}
                      helperText={errorMessages.position}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="email"
                      label="Email"
                      variant="standard"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      margin="normal"
                      required
                      error={!!errorMessages.email}
                      helperText={errorMessages.email}
                    />
                  </MDBox>
                  <MDBox mt={4} mb={1} textAlign="center">
                    <MDButton
                      variant="gradient"
                      color="info"
                      onClick={handleRegister}
                    >
                      {loading ? <CircularLoader /> : "Register"}
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

export default AddEmployee;
