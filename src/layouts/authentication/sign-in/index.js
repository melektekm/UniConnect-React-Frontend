/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import BasicLayout from "../components/BasicLayout";
import bgImage from "../../../assets/images/image-6.png";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Button from "@mui/material/Button";
import { BASE_URL } from "../../../appconfig";
import CoordinatorDashboard from "../../CoordinatorDashboard";
import Store from "electron-store";
import CircularProgress from "@mui/material/CircularProgress";

function Basic() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [open, setOpen] = useState(false);
  const [loadingSign, setLoadingSign] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [loading, setLoading] = useState(false);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      setOpen(true);
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/admin/login`, // Corrected URL
        {
          email,
          password,
        }
      );

      //    session.defaultSession.setUserPreference('accessToken', response.data.accessToken);

      ipcRenderer.send("save-user", {
        accessToken: response.data.accessToken,
        user: response.data.user,
      });
      if (response.data.user.role == "coordinator") {
        navigate("/CoordinatorDashboard");
      } else if (response.data.user.role == "admin") {
        navigate("/mainDashboard");
      } else if (response.data.user.role == "student") {
        navigate("/StudentDashboard");
      } else if (response.data.user.role == "dean") {
        navigate("/cafeManagerDashboard");
      } else if (response.data.user.role == "instructor") {
        navigate("/storeKeeperdashboard");
      }
      setLoading(false);
      console.log(response.data.user.role);
      //ceNlXlqqa27MYEJsUE8hey352DeXrEdQJmqDEbaV
      // Redirect or perform other actions as needed
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
        setLoading(false);
      } else {
        setErrorMessage(" network error try again");
        setOpen(true);
        setLoading(false);
      }
    }
    setLoading(false);
  };

  return (
    <BasicLayout image={bgImage}>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="alert-dialog-title">
          {"registration error"}
        </DialogTitle>
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
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            login
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              {loading ? (
                <MDBox textAlign="center">
                  <CircularProgress color="info" />
                </MDBox>
              ) : (
                <MDButton
                  variant="gradient"
                  color="dark"
                  fullWidth
                  onClick={handleLogin}
                >
                  login
                </MDButton>
              )}
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                are you new here ?{" "}
                <MDTypography
                  onClick={() => navigate("/authentication/sign-up")}
                  variant="button"
                  color="primary"
                  fontWeight="medium"
                  textGradient
                  style={{ cursor: "pointer" }}
                >
                  signup
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
