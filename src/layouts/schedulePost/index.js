import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CircularProgress,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  MenuItem,
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import axios from "axios";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import { BASE_URL } from "../../appconfig";

function ScheduleRequest() {
  const [formData, setFormData] = useState({
    course_name: "",
    course_code: "",
    classroom: "",
    labroom: "",
    classDays: "",
    labDays: "",
    labInstructor: "",
    classInstructor: "",
    schedule_type: "Class",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(null);

  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  const scheduleTypeOptions = ["Exam", "Class"];

  const [formList, setFormList] = useState({
    items: [],
    recommendations: "",
  });

  useEffect(() => {
    const previousRoute = sessionStorage.getItem("preRouteData");
    if (previousRoute) {
      setFormList({
        ...formList,
        type: "entry",
      });
      sessionStorage.removeItem("preRouteData");
    }
  }, []);

  const handleCourseCodeChange = async (event) => {
    const course_code = event.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, course_code }));

    if (course_code) {
      try {
        const response = await axios.get(
          `${BASE_URL}/course/name/${course_code}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (response.data && response.data.course_name) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            course_name: response.data.course_name,
          }));
          setErrorMessage("");
        } else {
          setFormData((prevFormData) => ({ ...prevFormData, course_name: "" }));
          setErrorMessage("Course not found.");
        }
      } catch (error) {
        setFormData((prevFormData) => ({ ...prevFormData, course_name: "" }));
        setErrorMessage("Error fetching course name: " + error.message);
      }
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, course_name: "" }));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const addForm = () => {
    const errors = {};
    [
      "course_name",
      "course_code",
      "classroom",
      "classDays",
      "classInstructor",
    ].forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setFormList((prevFormList) => ({
      ...prevFormList,
      items: [...prevFormList.items, formData],
    }));
    setFormData({
      course_name: "",
      course_code: "",
      classroom: "",
      labroom: "",
      classDays: "",
      labDays: "",
      labInstructor: "",
      classInstructor: "",
      schedule_type: "Class",
    });
  };

  const submitForms = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/schedule-requests`,
        { items: formList.items },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        setLoading(false);
        setFormList({ items: [], recommendations: "" });
        setErrorMessage("Schedule has been sent successfully.");
      } else {
        setErrorMessage("Failed to post schedule. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage("Error while sending schedule: " + error.message);
      setLoading(false);
    }
  };

  const openConfirmationDialog = () => setConfirmationOpen(true);
  const closeConfirmationDialog = () => setConfirmationOpen(false);
  const handleSendForm = () => {
    closeConfirmationDialog();
    submitForms();
  };

  const openRemoveDialog = (index) => setRemoveIndex(index);
  const closeRemoveDialog = () => setRemoveIndex(null);
  const confirmRemoveForm = () => {
    if (removeIndex !== null) {
      setFormList((prevFormList) => {
        const updatedItems = [...prevFormList.items];
        updatedItems.splice(removeIndex, 1);
        return { ...prevFormList, items: updatedItems };
      });
      closeRemoveDialog();
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Sidenav />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card style={{ border: "3px solid #206A5D" }}>
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
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <MDTypography variant="h6" color="white">
                    Schedule Upload
                  </MDTypography>
                </Grid>
              </MDBox>

              <MDBox pt={3} pb={3} px={2}>
                <MDBox mt={2} mb={2}>
                  <FormControl fullWidth>
                    <MDTypography>Schedule Type:</MDTypography>
                    <Select
                      name="schedule_type"
                      value={formData.schedule_type}
                      onChange={handleFormChange}
                    >
                      {scheduleTypeOptions.map((option, idx) => (
                        <MenuItem value={option} key={idx}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </MDBox>
                <MDBox component="form" role="form">
                  <FormControl variant="outlined" fullWidth margin="normal">
                    <MDInput
                      type="text"
                      name="course_code"
                      label="Course Code"
                      value={formData.course_code}
                      onChange={handleCourseCodeChange}
                      required
                      error={!!errorMessages.course_code}
                      helperText={errorMessages.course_code}
                    />
                  </FormControl>
                  <MDInput
                    type="text"
                    name="course_name"
                    label="Course Name"
                    value={formData.course_name}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.course_name}
                    helperText={errorMessages.course_name}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  {errorMessage && (
                    <MDTypography color="error">{errorMessage}</MDTypography>
                  )}
                  <MDInput
                    type="text"
                    name="classDays"
                    label="Class Days"
                    value={formData.classDays}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.classDays}
                    helperText={errorMessages.classDays}
                  />
                  <MDInput
                    type="text"
                    name="classroom"
                    label="Classroom No"
                    value={formData.classroom}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.classroom}
                    helperText={errorMessages.classroom}
                  />
                  {formData.schedule_type === "Class" && (
                    <>
                      <MDInput
                        type="text"
                        name="labroom"
                        label="Labroom"
                        value={formData.labroom}
                        onChange={handleFormChange}
                        margin="dense"
                        error={!!errorMessages.labroom}
                        helperText={errorMessages.labroom}
                      />
                      <MDInput
                        type="text"
                        name="labDays"
                        label="Lab Days"
                        value={formData.labDays}
                        onChange={handleFormChange}
                        margin="dense"
                        error={!!errorMessages.labDays}
                        helperText={errorMessages.labDays}
                      />
                      <MDInput
                        type="text"
                        name="labInstructor"
                        label="Lab Instructor"
                        value={formData.labInstructor}
                        onChange={handleFormChange}
                        margin="dense"
                        error={!!errorMessages.labInstructor}
                        helperText={errorMessages.labInstructor}
                      />
                    </>
                  )}
                  <MDInput
                    type="text"
                    name="classInstructor"
                    label={
                      formData.schedule_type === "Exam"
                        ? "Examiner"
                        : "Class Instructor"
                    }
                    value={formData.classInstructor}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.classInstructor}
                    helperText={errorMessages.classInstructor}
                  />
                </MDBox>
              </MDBox>

              <MDBox pb={3} px={2}>
                <Grid container spacing={2}>
                  <Grid item>
                    <MDButton
                      variant="contained"
                      color="success"
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
                      disabled={loading || formList.items.length === 0}
                    >
                      Submit
                    </MDButton>
                  </Grid>
                  <Grid item>{loading && <CircularProgress />}</Grid>
                </Grid>
              </MDBox>
            </Card>

            <Card
              style={{
                border: "3px solid #206A5D",
                marginTop: "20px",
              }}
            >
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
                            <TableCell>{form.course_name}</TableCell>
                            <TableCell>{form.classDays}</TableCell>
                            <TableCell>{form.classroom}</TableCell>
                            {form.schedule_type === "Class" && (
                              <>
                                <TableCell>{form.labDays}</TableCell>
                                <TableCell>{form.labroom}</TableCell>
                                <TableCell>{form.labInstructor}</TableCell>
                              </>
                            )}
                            <TableCell>{form.classInstructor}</TableCell>
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

            <Dialog
              open={confirmationOpen}
              onClose={closeConfirmationDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Confirm Submission
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to submit the forms?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeConfirmationDialog} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSendForm} color="primary" autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={removeIndex !== null}
              onClose={closeRemoveDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Remove Form</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to remove this form?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeRemoveDialog} color="secondary">
                  Cancel
                </Button>
                <Button onClick={confirmRemoveForm} color="primary" autoFocus>
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

export default ScheduleRequest;
