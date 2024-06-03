import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import AdminNavbar from "../../examples/Navbars/AdminNavbar";
import Footer from "../../examples/Footer";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import { BASE_URL } from "../../appconfig";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import colors from "../../assets/theme/base/colors";
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
import CoordinatorSidenav from "../../examples/Sidenav/CoordinatorSidenav";
import StudentSidenav from "../../examples/Sidenav/Studentsidenav";
import DeanSidenav from "../../examples/Sidenav/DeanSidenav";
import InstructorSidenav from "../../examples/Sidenav/InstructorSidenav";

function AddCourseMaterial() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [courseName, setCourseName] = useState("");
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [formValues, setFormValues] = useState({
    course_code: "",
    materialTitle: "",
    file: null,
  });
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(null);
  const [formList, setFormList] = useState({
    items: [],
  });

  useEffect(() => {
    const previousRoute = sessionStorage.getItem("preRouteData");
    if (previousRoute) {
      setFormList({
        ...formList,
        id: parseInt(previousRoute),
        type: "entry",
      });
      sessionStorage.removeItem("preRouteData");
    }
  }, []);

  const addForm = () => {
    const newErrorMessages = {};
    ["course_code", "materialTitle", "file"].forEach((field) => {
      if (!formValues[field]) {
        newErrorMessages[field] = `${field.replace(
          /([A-Z])/g,
          " $1"
        )} is required`;
      }
    });

    setErrorMessages(newErrorMessages);

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessage("Please fill in all fields");
      setOpen(true);
      return;
    }

    setFormList({
      ...formList,
      items: [...formList.items, formValues],
    });
    setFormValues({
      course_code: "",
      materialTitle: "",
      file: null,
    });
    setFile(null);
  };

  const handleUploadMaterial = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/upload-material`,
        JSON.stringify(formList),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setErrorMessage("Material uploaded successfully!");
      } else {
        setErrorMessage("Failed to upload material. Please try again.");
      }
      setOpen(true);
    } catch (error) {
      setErrorMessage("An error occurred while uploading the material.");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmationDialog = () => setConfirmationOpen(true);
  const closeConfirmationDialog = () => setConfirmationOpen(false);
  const handleSendForm = () => {
    closeConfirmationDialog();
    handleUploadMaterial();
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFormValues({ ...formValues, file: selectedFile });
    setFile(selectedFile);
  };

  const handleCourseCodeChange = async (event) => {
    const course_code = event.target.value;
    setFormValues({ ...formValues, course_code });

    if (course_code) {
      try {
        const response = await axios.get(`${BASE_URL}/get-course-name`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            course_code,
          },
        });

        if (response.data && response.data.course_name) {
          setCourseName(response.data.course_name);
        } else {
          setCourseName("");
          setErrorMessage("Course not found.");
          setOpen(true);
        }
      } catch (error) {
        setCourseName("");
        setErrorMessage("Error fetching course name: " + error.message);
        setOpen(true);
      }
    } else {
      setCourseName("");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const openRemoveDialog = (index) => setRemoveIndex(index);
  const closeRemoveDialog = () => setRemoveIndex(null);
  const confirmRemoveForm = () => {
    if (removeIndex !== null) {
      const updatedFormList = { ...formList };
      updatedFormList.items.splice(removeIndex, 1);
      setFormList(updatedFormList);
      closeRemoveDialog();
    }
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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Message"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpen(false)} color="primary" autoFocus>
            Close
          </MDButton>
        </DialogActions>
      </Dialog>
      <DashboardNavbar />
      {userData.user.role == "coordinator" ? (
        <CoordinatorSidenav />
      ) : (
        // ) : userData.user.role == "admin" ? (
        //   <Sidenav />
        // ) : userData.user.role == "student" ? (
        //   <StudentSidenav />
        // ) : userData.user.role == "dean" ? (
        //   <DeanSidenav />
        <InstructorSidenav />
      )}
      <MainDashboard />
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
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <MDTypography variant="h5" color="white">
                  Add Course Material
                </MDTypography>
              </Grid>
            </MDBox>
            <Card>
              <CardContent>
                <MDBox mb={2}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    style={{ marginTop: "16px" }}
                  >
                    <MDInput
                      type="text"
                      label="Course Code"
                      variant="outlined"
                      fullWidth
                      value={formValues.course_code}
                      onChange={handleCourseCodeChange}
                      margin="normal"
                      required
                      inputProps={{
                        name: "course_code",
                        id: "course_code",
                      }}
                    />
                  </FormControl>
                </MDBox>
                <MDBox mb={2}>
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
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Material Title"
                    variant="outlined"
                    fullWidth
                    value={formValues.materialTitle}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                    inputProps={{
                      name: "materialTitle",
                      id: "materialTitle",
                    }}
                  />
                </MDBox>
                <MDBox mb={2} style={{ display: "flex", alignItems: "center" }}>
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
                  <Grid container spacing={2}>
                    <Grid item>
                      <MDButton
                        color="primary"
                        onClick={addForm}
                        disabled={loading}
                      >
                        Add Form
                      </MDButton>
                    </Grid>
                    <Grid item>
                      <MDButton
                        variant="contained"
                        color="info"
                        onClick={openConfirmationDialog}
                        disabled={loading}
                      >
                        Submit
                      </MDButton>
                    </Grid>
                    <Grid item>{loading && <CircularProgress />}</Grid>
                  </Grid>
                </MDBox>
              </CardContent>
            </Card>
            <Card style={{ border: "3px solid #206A5D", marginTop: "20px" }}>
              <MDBox
                mx={2}
                mt={-5}
                py={3}
                px={2}
                variant="gradient"
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="dark"
              >
                <MDTypography variant="h6" color="white">
                  Entered Forms
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                {formList.items.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableBody>
                        {formList.items.map((form, index) => (
                          <TableRow key={index}>
                            <TableCell>{form.course_code}</TableCell>
                            <TableCell>{form.materialTitle}</TableCell>
                            <TableCell>
                              <Button
                                color="secondary"
                                onClick={() => openRemoveDialog(index)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <MDTypography>No forms added yet</MDTypography>
                )}
              </MDBox>
            </Card>

            <Dialog open={confirmationOpen} onClose={closeConfirmationDialog}>
              <DialogTitle>Confirm Submission</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to submit the forms?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeConfirmationDialog}>Cancel</Button>
                <Button onClick={handleSendForm} color="primary">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={removeIndex !== null} onClose={closeRemoveDialog}>
              <DialogTitle>Remove Form</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to remove this form?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeRemoveDialog}>Cancel</Button>
                <Button onClick={confirmRemoveForm} color="secondary">
                  Remove
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AddCourseMaterial;
