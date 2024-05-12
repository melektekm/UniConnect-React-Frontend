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
import MainDashboard from "../../layouts/MainDashboard";
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

function UploadAssignment() {
    const location = useLocation();
    const electron = window.require("electron");
    const ipcRenderer = electron.ipcRenderer;
    const userData = ipcRenderer.sendSync("get-user");
    const accessToken = userData.accessToken; // Assuming accessToken is available in user data
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [formValues, setFormValues] = useState({
        course_code: "",
        assignmentName: "",
        assignmentDescription: "",
        dueDate: "",
        file: null,
    });
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [file, setFile] = useState(null); // Define the file state variable

    useEffect(() => {
        // Fetch courses when the component mounts
        getCourses();
    }, []);
    console.log(accessToken);
    const getCourses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/get-all-courses`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Pass accessToken in headers
                },
            });
            if (response.data) {
                setCourses(response.data.courses);
            } else {
                setErrorMessage("Failed to fetch courses.");
                setOpen(true);
            }
        } catch (error) {
            setErrorMessage("Error fetching courses: " + error.message);
            setOpen(true);
        }
    };

    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        setFormValues({ ...formValues, file: selectedFile });
        setFile(selectedFile); // Set the file in the state
    };

    const handleAddToAssignment = async () => {
        const newErrorMessages = {
            course_code: formValues.course_code ? "" : "Course is required",
            assignmentName: formValues.assignmentName ? "" : "Assignment name is required",
            assignmentDescription: formValues.assignmentDescription
                ? ""
                : "Assignment description is required",
            dueDate: formValues.dueDate ? "" : "Due date is required",
        };

        setErrorMessages(newErrorMessages);

        if (Object.values(newErrorMessages).some((message) => message !== "")) {
            setErrorMessage("All fields should be filled");
            setDialogOpen(true);
            return;
        }

        setLoading(true);
        try {
            const jsonData = {
                course_code: formValues.course_code,
                assignmentName: formValues.assignmentName,
                assignmentDescription: formValues.assignmentDescription,
                dueDate: formValues.dueDate,
                file: formValues.file, // Assuming the file object is needed in JSON format
            };

            const response = await axios.post(`${BASE_URL}/upload-assignment`, jsonData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.data) {
                setSuccessMessage("Assignment uploaded successfully!");
                setDialogOpen(true);
            } else {
                setErrorMessage("Failed to upload assignment. Please try again.");
                setDialogOpen(true);
            }
        } catch (error) {
            setErrorMessage("An error occurred while uploading the assignment.");
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
        borderRadius: "5px",
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
                                Assignment Upload
                            </MDTypography>
                        </MDBox>
                        <Card>
                            <MDBox pt={3} pb={3} px={2}>
                                <MDBox component="form" role="form">
                                    <MDBox mb={2}>
                                        <FormControl variant="outlined" fullWidth style={{ marginTop: "16px" }}>
                                            <InputLabel htmlFor="course">Course</InputLabel>
                                            <Select
                                                value={formValues.course_code}
                                                onChange={(e) =>
                                                    setFormValues({ ...formValues, course_code: e.target.value })
                                                }
                                                label="Course"
                                                inputProps={{
                                                    name: "course_code",
                                                    id: "course",
                                                }}
                                                style={{ minHeight: "45px" }}
                                            >
                                                <MenuItem value="">Select Course</MenuItem>
                                                {courses.map((course) => (
                                                    <MenuItem key={course.id} value={course.code}>
                                                        {course.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </MDBox>
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        type="text"
                                        name="assignmentName"
                                        label="Assignment Name"
                                        variant="outlined"
                                        fullWidth
                                        value={formValues.assignmentName}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, assignmentName: e.target.value })
                                        }
                                        margin="normal"
                                        required
                                        error={!!errorMessages.assignmentName}
                                        helperText={errorMessages.assignmentName}
                                    />
                                </MDBox>
                                <MDBox mb={2}>
                                    <MDInput
                                        type="text"
                                        name="assignmentDescription"
                                        label="Assignment Description"
                                        variant="outlined"
                                        fullWidth
                                        value={formValues.assignmentDescription}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, assignmentDescription: e.target.value })
                                        }
                                        margin="normal"
                                        required
                                        error={!!errorMessages.assignmentDescription}
                                        helperText={errorMessages.assignmentDescription}
                                    />
                                </MDBox>
                                <MDBox mb={2}>
                                    <TextField
                                        id="dueDate"
                                        name="dueDate"
                                        label="Due Date"
                                        type="date"
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={formValues.dueDate}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, dueDate: e.target.value })
                                        }
                                        margin="normal"
                                        required
                                        error={!!errorMessages.dueDate}
                                        helperText={errorMessages.dueDate}
                                    />
                                </MDBox>
                                <MDBox mb={2} style={{ display: 'flex', alignItems: 'center' }}>
                                    <label htmlFor="fileUpload" style={fileInputStyle}>
                                        <input
                                            type="file"
                                            id="fileUpload"
                                            accept="application/pdf"
                                            // name="imageUrl"
                                            onChange={handleFileUpload}
                                            style={{ display: "none" }}
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
                                        onClick={handleAddToAssignment}
                                        disabled={loading}
                                    >
                                        {loading ? "Uploading..." : "Upload Assignment"}
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

export default UploadAssignment;
