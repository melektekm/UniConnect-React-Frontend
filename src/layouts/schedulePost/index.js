import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  MenuItem,
  TextField,
  Select,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
    scheduleType: "Class",
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
    requested_by: userData.user.id,
    recommendations: "",
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

  const handleCourseCodeChange = async (event) => {
    const course_code = event.target.value;
    setFormData({ ...formData, course_code });
    if (course_code) {
      try {
        const response = await axios.get(`${BASE_URL}/get-course-name`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { course_code },
        });
        if (response.data && response.data.course_name) {
          setFormData({ ...formData, course_name: response.data.course_name });
        } else {
          setFormData({ ...formData, course_name: "" });
          setErrorMessage("Course not found.");
          setOpen(true);
        }
      } catch (error) {
        setFormData({ ...formData, course_name: "" });
        setErrorMessage("Error fetching course name: " + error.message);
        setOpen(true);
      }
    } else {
      setFormData({ ...formData, course_name: "" });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addForm = () => {
    const errors = {};
    [
      "course_name",
      "course_code",
      "classroom",
      "labroom",
      "classDays",
      "labDays",
      "labInstructor",
      "classInstructor",
    ].forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) {
      setErrorMessage("Please fill in all fields");
      setOpen(true);
      return;
    }

    setFormList({
      ...formList,
      items: [...formList.items, formData],
    });
    setFormData({
      course_name: "",
      course_code: "",
      classroom: "",
      labroom: "",
      classDays: "",
      labDays: "",
      labInstructor: "",
      classInstructor: "",
      scheduleType: "Class",
    });
  };

  const submitForms = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/request`,
        JSON.stringify(formList),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      setErrorMessage("Schedule has been sent successfully");
      setOpen(true);
    } catch (error) {
      setErrorMessage("Error while sending schedule " + error.message);
      setOpen(true);
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
      const updatedFormList = { ...formList };
      updatedFormList.items.splice(removeIndex, 1);
      setFormList(updatedFormList);
      closeRemoveDialog();
    }
  };

  return (
    <DashboardLayout>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpen(false)}>Close</MDButton>
        </DialogActions>
      </Dialog>

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
                  />
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
                  <MDInput
                    type="text"
                    name="labroom"
                    label="Labroom"
                    value={formData.labroom}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.labroom}
                    helperText={errorMessages.labroom}
                  />
                  <MDInput
                    type="text"
                    name="labroom days"
                    label="Labroom"
                    value={formData.labDays}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.labroom}
                    helperText={errorMessages.labroom}
                  />
                  <MDInput
                    type="text"
                    name="labInstructor"
                    label="Lab Instructor"
                    value={formData.labInstructor}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.labInstructor}
                    helperText={errorMessages.labInstructor}
                  />
                  <MDInput
                    type="text"
                    name="classInstructor"
                    label="Class Instructor"
                    value={formData.classInstructor}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.classInstructor}
                    helperText={errorMessages.classInstructor}
                  />
                  <FormControl fullWidth margin="dense">
                    <Select
                      value={formData.scheduleType}
                      onChange={handleFormChange}
                      name="scheduleType"
                      displayEmpty
                    >
                      {scheduleTypeOptions.map((option, idx) => (
                        <MenuItem value={option} key={idx}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                      disabled={loading}
                    >
                      Submit
                    </MDButton>
                  </Grid>
                  <Grid item>{loading && <CircularProgress />}</Grid>
                </Grid>
              </MDBox>
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
                            <TableCell>{form.course_name}</TableCell>
                            <TableCell>{form.classDays}</TableCell>
                            <TableCell>{form.classroom}</TableCell>
                            <TableCell>{form.labDays}</TableCell>
                            <TableCell>{form.labroom}</TableCell>
                            <TableCell>{form.labInstructor}</TableCell>
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

export default ScheduleRequest;
