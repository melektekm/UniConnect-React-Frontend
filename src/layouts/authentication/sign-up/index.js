import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
// Authentication layout components
import CoverLayout from "../components/CoverLayout";

// Images
import bgImage from "../../../assets/images/image-6.png";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Button, TextField } from "@mui/material";
import { BASE_URL } from "../../../appconfig";

function Cover() {
  const [name, setName] = useState("");
  // const [department, setDepartment] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const departmentOptions = [
    "Department 1",
    "Department 2",
    "Department 3",
    // Add more departments as needed
  ];
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;

  const handleregister = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/admin/register`, // Corrected URL
        {
          name,
          department: selectedDepartment,
          position,
          email,
          password,
        }
      );

      ipcRenderer.send('save-user', { accessToken: response.data.accessToken, user: response.data.user });
      if(response.data.user.role == 'cashier'){
        navigate("/cashierDashboard");
      }else if(response.data.user.role == 'admin'){
        navigate("/mainDashboard");
      }else if(response.data.user.role == 'communittee_admin'){
        navigate("/cafeCommetteDashboard");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        let errorMessage = "";

        if (typeof errors === "string") {
          errorMessage = errors;
        } else {
          errorMessage = Object.values(errors)
            .map((errorArray) => errorArray.join(" "))
            .join(" ");
        }
        setErrorMessage(errorMessage);
        setOpen(true);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
        setOpen(true);
      } else {
        console.error("Registration failed", error);
      }
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Registration Error"}
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
            }}
            color="primary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </MDBox>
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
                label="position"
                variant="standard"
                fullWidth
                value={position}
                onChange={(e) => setPosition(e.target.value)}
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
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}></MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}></MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient" 
                color="info"
                fullWidth
                onClick={handleregister}
              >
                Sign up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  onClick={() => navigate("/authentication/sign-in")}
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                  style={{ cursor: "pointer" }}
                >
                  Login
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
