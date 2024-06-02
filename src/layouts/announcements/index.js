import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BASE_URL } from "../../appconfig";
import { CardContent } from "@mui/material";
import MainDashboard from "../MainDashboard";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl"; // Import FormControl
import InputLabel from "@mui/material/InputLabel"; // Import InputLabel
import Select from "@mui/material/Select"; // Import Select
import MenuItem from "@mui/material/MenuItem"; // Import MenuItem
import TextField from "@mui/material/TextField"; // Import TextField
import MDInput from "../../components/MDInput";
import colors from "../../assets/theme/base/colors";

function UploadAnnouncement() {
  const location = useLocation();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken; // Assuming accessToken is available in user data
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
    date: "",
    category: "registration",
    file: null,
  });
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null); // Define the file state variable

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFormValues({ ...formValues, file: selectedFile });
    setFile(selectedFile); // Set the file in the state
  };
  const handlePostAnnouncement = async () => {
    const newErrorMessages = {
      title: formValues.title ? "" : "title is required",
      category: formValues.category ? "" : "category name is required",
      content: formValues.content ? "" : "content description is required",
      date: formValues.date ? "" : "Due date is required",
    };

    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("All fields should be filled");
      setDialogOpen(true);
      return;
    }

    // Format date as YY-MM-DD
    const formattedDate = formValues.date.split("-").slice(0, 3).join("-");

    setLoading(true);
    try {
      const jsonData = {
        title: formValues.title,
        category: formValues.category,
        content: formValues.content,
        date: formattedDate, // Use the formatted date
        file: formValues.file,
      };

      const response = await axios.post(
        `${BASE_URL}/post-announcement`,
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setSuccessMessage("Announcement posted successfully!");
        setDialogOpen(true);
      } else {
        setErrorMessage("Failed to post announcement. Please try again.");
        setDialogOpen(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred while posting the announcement.");
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

  const fileInputStyle = {
    display: "inline-block",
    cursor: "pointer",
    padding: "10px 20px",
    backgroundColor: colors.dark.main,
    color: "white",
    borderRadius: "50px",
    border: "1px solid #007bff",
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Sidenav />
      <MainDashboard />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpen(false)} color="primary">
            Close
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{successMessage ? "Success" : "Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {successMessage ? successMessage : errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setDialogOpen(false)} color="primary">
            Close
          </MDButton>
        </DialogActions>
      </Dialog>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={2}
              mb={2}
              py={3}
              px={2}
              variant="gradient"
              bgColor="dark"
              borderRadius="lg"
              coloredShadow="info"
              textAlign="center"
              // style={{ display: "flex", justifyContent: "space-between" }}
            >
              <MDTypography variant="h5" color="white">
                Post Announcement
              </MDTypography>
            </MDBox>
            <Card>
              <MDBox pt={3} pb={3} px={2}>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    name="title"
                    label="Title"
                    variant="outlined"
                    fullWidth
                    value={formValues.title}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        title: e.target.value,
                      })
                    }
                    margin="normal"
                    required
                    error={!!errorMessages.title}
                    helperText={errorMessages.title}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    name="content"
                    label="Content"
                    variant="outlined"
                    fullWidth
                    value={formValues.content}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        content: e.target.value,
                      })
                    }
                    margin="normal"
                    required
                    error={!!errorMessages.content}
                    helperText={errorMessages.content}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <TextField
                    id="date"
                    name="date"
                    label="Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formValues.date}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        date: e.target.value,
                      })
                    }
                    margin="normal"
                    required
                    error={!!errorMessages.date}
                    helperText={errorMessages.date}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <select
                    value={formValues.category}
                    label="Category"
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        category: e.target.value,
                      })
                    }
                    name="category"
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid lightgray",
                      height: "40px",
                      borderRadius: "5px",
                    }}
                  >
                    <option value="registration">Registration</option>
                    <option value="upcoming_events">Upcoming Events</option>
                    <option value="class_related">Academic</option>
                  </select>
                </MDBox>
                <MDBox mb={2} style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="fileUpload" style={fileInputStyle}>
                    <input
                      type="file"
                      id="fileUpload"
                      accept="application/pdf"
                      // name="imageUrl"
                      onChange={handleFileUpload}
                      style={{
                        display: "none",
                        height: "40px",
                        borderRadius: "30px",
                      }}
                    />
                    <span>&#128206; {file ? file.name : "Choose File:"}</span>
                  </label>
                  <MDTypography variant="body2" ml={1}>
                    File must be 4 MB in PDF format.
                  </MDTypography>
                </MDBox>
                <MDBox mt={2} mb={1} textAlign="center">
                  <MDButton
                    variant="contained"
                    color="primary"
                    onClick={handlePostAnnouncement}
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload announcement"}
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default UploadAnnouncement;
