import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import AdminNavbar from "../../examples/Navbars/AdminNavbar";
import Footer from "../../examples/Footer";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import Icon from "@mui/material/Icon";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";

function Dashboard({ selectedEmployee }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    email: "",
    role: "",
  });

  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const CircularLoader = () => <CircularProgress size={24} color="inherit" />;

  const [formValues, setFormValues] = useState({
    name: selectedEmployee ? selectedEmployee.name : "",
    email: selectedEmployee ? selectedEmployee.email : "",
    role: selectedEmployee ? selectedEmployee.role : 0,
  });

  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [open, setOpen] = useState(false);

  const handleRegister = async () => {
    const newErrorMessages = {
      name: name ? "" : "name is required",
      role: role ? "" : "role is required",
      email: email ? "" : "email is required",
    };
    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("Please fill in all fields");
      setOpen(true);
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        name: name,
        email: email,
        role: role,
      };

      const response = await axios.post(
        `${BASE_URL}/auth/admin/addEmployee`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        resetState();
        setErrorMessage("");
        setSuccessMessage("Employee registered successfully");
        setOpen(true);
      } else {
        setErrorMessage("No response");
        setOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const serverErrorMessages = error.response.data.errors;
        let errorMessage = "user not registered";

        for (const [key, value] of Object.entries(serverErrorMessages)) {
          errorMessage += `${key}: ${value[0]}, `;
        }

        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("user not registered: " + error);
      }
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setName("");
    setRole(0);
    setEmail("");
  };
  return (
    <DashboardLayout>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {successMessage ? "notification" : "notification"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {successMessage || errorMessage}
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
            close
          </Button>
        </DialogActions>
      </Dialog>
      <AdminNavbar />
      <Sidenav />
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
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  add employee
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                <MDBox component="form" role="form">
                  <MDInput
                    type="text"
                    name="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    required
                    error={!!errorMessages.name}
                    helperText={errorMessages.name}
                  />

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      label="Role"
                    >
                      <MenuItem value="coordinator">Coordinator</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="dean">Dean</MenuItem>
                      <MenuItem value="instructor">Instructor</MenuItem>
                      <MenuItem value="registrar">Registrar</MenuItem>
                    </Select>
                  </FormControl>

                  <MDInput
                    type="email"
                    label="Email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    error={!!errorMessages.email}
                    helperText={errorMessages.email}
                  />

                  <MDBox mt={4} mb={1} textAlign="center">
                    <MDButton color="primary" onClick={handleRegister}>
                      add
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

export default Dashboard;
