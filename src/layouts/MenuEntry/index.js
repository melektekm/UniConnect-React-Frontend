import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import MainDashboard from "../../layouts/MainDashboard";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { BASE_URL } from "../../appconfig";

const AddMenuItem = () => {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  const initialFormValues = {
    course_code: "",
    course_name: "",
    course_description: "",
    credit_hours: "",
    year: "",
    semester: "",
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  useEffect(() => {
    // Additional logic if there's any selectedMenu
  }, [location]);

  const handleAddToMenu = async () => {
    const newErrorMessages = {
      course_code: formValues.course_code ? "" : "Course code is required.",
      course_name: formValues.course_name ? "" : "Course name is required.",
      course_description: formValues.course_description
        ? ""
        : "Course description is required.",
      credit_hours: formValues.credit_hours
        ? ""
        : "Course credit hour is required.",
      year: formValues.year ? "" : "Year is required",
      semester: formValues.semester ? "" : "Semester is required.",
    };

    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("Fill all required fields.");
      setDialogOpen(true);
      return;
    }

    setLoading(true);
    try {
      const jsonData = {
        course_code: formValues.course_code,
        course_name: formValues.course_name,
        course_description: formValues.course_description,
        credit_hour: parseFloat(formValues.credit_hours),
        year: formValues.year,
        semester: formValues.semester,
      };

      const response = await axios.post(`${BASE_URL}/upload-course`, jsonData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // Handle success
      if (response.data.message) {
        setSuccessMessage(response.data.message);
        setDialogOpen(true);
        setFormValues(initialFormValues); // Clear the form fields on success
        setErrorMessages({});
      } else {
        setErrorMessage("Failed to upload course.");
        setDialogOpen(true);
      }
    } catch (error) {
      // Handle error
      setErrorMessage("Error uploading course: " + error.message);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Sidenav />
      <MainDashboard />
      <MDBox
        mx={2}
        mt={1}
        mb={2}
        py={3}
        px={2}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="info"
        textAlign="center"
      >
        <MDTypography variant="h5" color="white">
          Upload Course
        </MDTypography>
      </MDBox>
      <Card>
        <CardContent>
          <form>
            <TextField
              required
              fullWidth
              label="Course Code"
              value={formValues.course_code}
              onChange={(e) =>
                setFormValues({ ...formValues, course_code: e.target.value })
              }
              style={{ marginTop: "16px" }}
            />
            <TextField
              required
              fullWidth
              label="Course Name"
              value={formValues.course_name}
              onChange={(e) =>
                setFormValues({ ...formValues, course_name: e.target.value })
              }
              style={{ marginTop: "16px" }}
            />
            <TextField
              required
              fullWidth
              label="Course Description"
              value={formValues.course_description}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  course_description: e.target.value,
                })
              }
              style={{ marginTop: "16px" }}
            />
            <TextField
              required
              fullWidth
              label="Credit Hours"
              type="number"
              InputLabelProps={{ shrink: true }}
              value={formValues.credit_hours}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  credit_hours: parseInt(e.target.value),
                })
              }
              style={{ marginTop: "16px" }}
            />
            <TextField
              required
              fullWidth
              label="Year"
              type="number"
              InputLabelProps={{ shrink: true }}
              value={formValues.year}
              onChange={(e) =>
                setFormValues({ ...formValues, year: parseInt(e.target.value) })
              }
              style={{ marginTop: "16px" }}
            />
            <TextField
              required
              fullWidth
              label="Semester"
              type="number"
              InputLabelProps={{ shrink: true }}
              value={formValues.semester}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  semester: parseInt(e.target.value),
                })
              }
              style={{ marginTop: "16px" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <MDButton
                variant="contained"
                color="secondary"
                type="button"
                onClick={handleAddToMenu}
                style={{ color: "white" }}
              >
                Upload Course
              </MDButton>
            </div>
          </form>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{successMessage ? "Success" : "Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {successMessage || errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleDialogClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default AddMenuItem;
