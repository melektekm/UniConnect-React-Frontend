import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FormControl, FormHelperText } from "@mui/material";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import CircularProgress from "@mui/material/CircularProgress";
// Authentication layout components
import CoverLayout from "../components/CoverLayout";
import { Select, MenuItem } from "@mui/material";
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
  const [loadingSign, setLoadingSign] = useState(false);
  const [role, setRole] = useState('');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const[roleError, setRoleError] = useState("");

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [loading, setLoading] = useState(false);

  const validatePassword = (value) => {
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;

    if (!value) {
      setPasswordError("Password is required");
    } else if (!regex.test(value)) {
      setPasswordError(
        "Password must include at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleregister = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/admin/register`, // Corrected URL
        {
          name,
          role,
          email,
          password,
        }
      );

      ipcRenderer.send("save-user", {
        accessToken: response.data.accessToken,
        user: response.data.user,
      });
      if (response.data.user.role == "coordinator") {
        navigate("/cashierDashboard");
      } else if (response.data.user.role == "admin") {
        navigate("/mainDashboard");
      } else if (response.data.user.role == "student") {
        navigate("/cafeCommetteDashboard");
      } else if (response.data.user.role == "dean") {
        navigate("/cafeManagerDashboard");
      } else if (response.data.user.role == "instructor") {
        navigate("/storeKeeperdashboard");
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
        setErrorMessage("network error. try again");
        setOpen(true);
      }
    }

    setLoading(false);
  };

  return (
    <CoverLayout image={bgImage}>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="alert-dialog-title">Registration error</DialogTitle>
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
            color="error"
            style={{ borderRadius: "15%" }}
          >
            close
          </MDButton>
        </DialogActions>
      </Dialog>

      <Card>
        <MDBox
          variant="gradient"
          bgColor="dark"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography display="block" variant="button" color="white" my={1}>
            Sign Up
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="name"
                variant="standard"
                fullWidth
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth error={!!roleError} margin="normal">
              <FormControl fullWidth margin="normal">
                <Select
                  label="Role"
                  variant="standard"
                  fullWidth
                  value={role}
                  name="role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="coordinator">Coordinator</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="dean">Dean</MenuItem>
                  <MenuItem value="instructor">Instructor</MenuItem>
                </Select>
                {roleError && <FormHelperText>{roleError}</FormHelperText>}
                {/* <FormHelperText>{passwordError}</FormHelperText> */}
              </FormControl>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="email"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth error={!!passwordError} margin="normal">
                <MDInput
                  type="password"
                  label="password"
                  variant="standard"
                  fullWidth
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                />
                <FormHelperText>{passwordError}</FormHelperText>
              </FormControl>
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}></MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}></MDBox>
            <MDBox mt={4} mb={1}>
              {loading ? (
                <MDBox textAlign="center">
                  <CircularProgress />
                </MDBox>
              ) : (
                <MDButton
                  variant="gradient"
                  color="dark"
                  fullWidth
                  onClick={handleregister}
                >
                  ተመዝገቡ
                </MDButton>
              )}
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Do you have an account?{" "}
                <MDTypography
                  onClick={() => navigate("/authentication/sign-in")}
                  variant="button"
                  color="primary"
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
