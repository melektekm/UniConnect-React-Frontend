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
import axios from "axios";
import { BASE_URL } from "../../appconfig";
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

function AddEmployee() {
  const location = useLocation();
  const selectedEmployee = location.state?.selectedEmployee;
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    email: "",
    role: "",
  });

  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [loading, setLoading] = useState(false);
  const CircularLoader = () => <CircularProgress size={24} color="inherit" />;

  const [formValues, setFormValues] = useState({
    name: selectedEmployee ? selectedEmployee.name : "",
    email: selectedEmployee ? selectedEmployee.email : "",
    role: selectedEmployee ? selectedEmployee.role : "",
  });

  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  const handleRegister = async () => {
    const newErrorMessages = {
      name: formValues.name ? "" : "Name is required",
      email: formValues.email ? "" : "Email is required",
      role: formValues.role ? "" : "Role is required",
    };
    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("Please fill all fiedls!!");
      setOpen(true);
      return;
    }

    setLoading(true);

    try {
      let response;
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("email", formValues.email);
      formData.append("role", formValues.role);

      if (selectedEmployee) {
        response = await axios.post(
          `${BASE_URL}/auth/admin/updateEmployee/${selectedEmployee.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/auth/admin/addEmployee`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.data) {
        resetState();
        setErrorMessage({});
        setSuccessMessage(
          ` ሰራተኛውን በተሳካ ሁኔታ! ${selectedEmployee ? " ተስተካክሏል" : "ገብቷል"}`
        );
        setOpen(true);
      } else {
        setErrorMessage("ምላሽ ምንም አልያዘም።");
        setOpen(true);
      }
    } catch (error) {
      setErrorMessage("ምላሽ እትም አልተሳካም፦ " + error);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setFormValues({
      name: "",
      email: "",
      role: "",
    });
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
          {successMessage ? "ማረጋገጫ" : "ማስታወቂያ"}
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
            ዝጋ
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
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  {selectedEmployee ? "የሰራተኛ መረጃን ቀይር" : "ሰራተኛን ጨምር"}
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      name="name"
                      label="ስም"
                      variant="outlined"
                      fullWidth
                      value={formValues.name}
                      onChange={(e) =>
                        setFormValues({ ...formValues, name: e.target.value })
                      }
                      margin="normal"
                      required
                      error={!!errorMessages.name}
                      helperText={errorMessages.name}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="email"
                      label="ኢሜይል"
                      name="email"
                      variant="outlined"
                      fullWidth
                      value={formValues.email}
                      onChange={(e) =>
                        setFormValues({ ...formValues, email: e.target.value })
                      }
                      margin="normal"
                      required
                      error={!!errorMessages.email}
                      helperText={errorMessages.email}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="እትም"
                      name="role"
                      variant="outlined"
                      fullWidth
                      value={formValues.role}
                      onChange={(e) =>
                        setFormValues({ ...formValues, role: e.target.value })
                      }
                      margin="normal"
                      required
                      error={!!errorMessages.role}
                      helperText={errorMessages.role}
                    />
                  </MDBox>
                  <MDBox mt={4} mb={1} textAlign="center">
                    <MDButton color="primary" onClick={handleRegister}>
                      {loading ? <CircularLoader /> : "ጨምር"}
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
