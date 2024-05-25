import React, { useState } from "react";
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
import TextField from "@mui/material/TextField";
import MDInput from "../../components/MDInput";
import colors from "../../assets/theme/base/colors";
import FormControl from "@mui/material/FormControl";

function SubmitAssignment() {
    const location = useLocation();
    const electron = window.require("electron");
    const ipcRenderer = electron.ipcRenderer;
    const userData = ipcRenderer.sendSync("get-user");
    const accessToken = userData.accessToken; // Assuming accessToken is available in user data
    const [loading, setLoading] = useState(false);
    const [courseName, setCourseName] = useState("");
    const [formValues, setFormValues] = useState({
        course_code: "",
        assignmentName: "",
        
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
    console.log(accessToken);
    const handleAddToAssignment = async () => {
        const newErrorMessages = {
            course_name: formValues.course_name ? "" : "Course name is required",
            ass_name: formValues.ass_name ? "" : "Assignment name is required",
            student_name: formValues.student_name
                ? ""
                : "Name is required",
            student_id: formValues.student_id ? "" : "ID is required",
            file: formValues.file ? "" : "File is required",
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
                ass_name: formValues.ass_name,
                student_name: formValues.student_name,
                student_id: formValues.student_id,
                file: formValues.file, // Assuming the file object is needed in JSON format
            };

            const response = await axios.post(`${BASE_URL}/upload-assignment`, JSON.stringify(jsonData), {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.data) {
                resetState();
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

    // const handleCourseCodeChange = async (event) => {
    //     const course_code = event.target.value;
    //     setFormValues({ ...formValues, course_code });

    //     if (course_code) {
    //         try {
    //             const response = await axios.get(`${BASE_URL}/get-course-name`, {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`,
    //                 },
    //                 params: {
    //                     course_code,
    //                 },
    //             });

    //             if (response.data && response.data.course_name) {
    //                 setCourseName(response.data.course_name);
    //             } else {
    //                 setCourseName("");
    //                 setErrorMessage("Course not found.");
    //                 setOpen(true);
    //             }
    //         } catch (error) {
    //             setCourseName("");
    //             setErrorMessage("Error fetching course name: " + error.message);
    //             setOpen(true);
    //         }
    //     } else {
    //         setCourseName("");
    //     }
    // };

    const fileInputStyle = {
        display: "inline-block",
        cursor: "pointer",
        padding: "10px 20px",
        backgroundColor: colors.dark.main,
        color: "white",
        borderRadius: "5px",
        border: "1px solid #007bff",
    };

    const resetState = () => {
        setFormValues({
            course_code: "",
            ass_name: "",
            student_name: "",
            student_id: "",
            file: null,
        });
        setFile(null);
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
                                            <MDInput
                                                type="text"
                                                name="course_name"
                                                label="Course Name"
                                                variant="outlined"
                                                fullWidth
                                                value={formValues.course_name}
                                                onChange={(e) =>
                                                    setFormValues({ ...formValues, course_name: e.target.value })
                                                }
                                                margin="normal"
                                                required
                                                error={!!errorMessages.course_name}
                                                helperText={errorMessages.course_name}
                                            />
                                        </FormControl>
                                    </MDBox>
                                    {/* <MDBox mb={2}>
                                        <MDInput
                                            type="text"
                                            label="Course Name"
                                            variant="outlined"
                                            fullWidth
                                            value={courseName}
                                            margin="normal"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </MDBox> */}
                                    <MDBox mb={2}>
                                        <MDInput
                                            type="text"
                                            name="ass_name"
                                            label="Assignment Name"
                                            variant="outlined"
                                            fullWidth
                                            value={formValues.ass_name}
                                            onChange={(e) =>
                                                setFormValues({ ...formValues, ass_name: e.target.value })
                                            }
                                            margin="normal"
                                            required
                                            error={!!errorMessages.ass_name}
                                            helperText={errorMessages.ass_name}
                                        />
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <MDInput
                                            type="text"
                                            name="student_name"
                                            label="Student Name"
                                            variant="outlined"
                                            fullWidth
                                            value={formValues.student_name}
                                            onChange={(e) =>
                                                setFormValues({ ...formValues, student_name: e.target.value })
                                            }
                                            margin="normal"
                                            required
                                            error={!!errorMessages.student_name}
                                            helperText={errorMessages.student_name}
                                        />
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <TextField
                                            type="text"
                                            name="student_id"
                                            label="Student ID"
                                            fullWidth
                                            variant="outlined"
                                            value={formValues.student_id}
                                            onChange={(e) =>
                                                setFormValues({ ...formValues, student_id: e.target.value })
                                            }
                                            margin="normal"
                                            required
                                            error={!!errorMessages.student_id}
                                            helperText={errorMessages.student_id}
                                        />
                                    </MDBox>
                                    <MDBox mb={2} style={{ display: 'flex', alignItems: 'center' }}>
                                        <label htmlFor="fileUpload" style={fileInputStyle}>
                                            <input
                                                type="file"
                                                id="fileUpload"
                                                accept="application/pdf"
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
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default SubmitAssignment;
