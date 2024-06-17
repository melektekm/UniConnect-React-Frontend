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
    examDate: "",
    examTime: "",
    examRoom: "",
    examiner: "",
    schedule_type: "Class",
    status: "Pending",
    year: "",
    yearGroup: "",
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
  const statusOptions = ["Pending", "Approved"];
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
    const requiredFields = {
      Exam: [
        "course_code",
        "course_name",
        "examDate",
        "examTime",
        "examRoom",
        "examiner",
        "year",
        "yearGroup",
      ],
      Class: [
        "course_code",
        "course_name",
        "classDays",
        "classroom",
        "labDays",
        "labroom",
        "labInstructor",
        "classInstructor",
        "year",
        "yearGroup",
      ],
    };

    requiredFields[formData.schedule_type].forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const newFormData = { ...formData };

    if (formData.schedule_type === "Class") {
      delete newFormData.examDate;
      delete newFormData.examTime;
      delete newFormData.examRoom;
      delete newFormData.examiner;
    } else if (formData.schedule_type === "Exam") {
      delete newFormData.classroom;
      delete newFormData.labroom;
      delete newFormData.classDays;
      delete newFormData.labDays;
      delete newFormData.labInstructor;
      delete newFormData.classInstructor;
    }

    setFormList((prevFormList) => ({
      ...prevFormList,
      items: [...prevFormList.items, newFormData],
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
      examDate: "",
      examTime: "",
      examRoom: "",
      examiner: "",
      schedule_type: "Class",
      status: "Pending",
      year: "",
      yearGroup: "",
    });
  };

  const submitForms = async () => {
    setLoading(true);
    const payload = {
      scheduleRequests: formList.items.map((item) => {
        const filteredItem = { ...item };
        if (filteredItem.schedule_type === "Class") {
          delete filteredItem.examDate;
          delete filteredItem.examTime;
          delete filteredItem.examRoom;
          delete filteredItem.examiner;
        } else if (filteredItem.schedule_type === "Exam") {
          delete filteredItem.classroom;
          delete filteredItem.labroom;
          delete filteredItem.classDays;
          delete filteredItem.labDays;
          delete filteredItem.labInstructor;
          delete filteredItem.classInstructor;
        }
        return filteredItem;
      }),
    };

    console.log("Payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(
        `${BASE_URL}/schedule-requests`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setLoading(false);
        setErrorMessage("Schedule has been sent successfully");
      } else {
        setErrorMessage("Failed to post Schedule. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        console.error("Validation Errors:", error.response.data.errors);
      } else {
        console.error("Error:", error.message);
      }
      setErrorMessage("Error while sending schedule " + error.message);
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

  const renderFormFields = () => {
    if (formData.schedule_type === "Class") {
      return (
        <>
          <Grid item xs={12} md={3}>
            <MDInput
              label="Classroom"
              name="classroom"
              fullWidth
              value={formData.classroom}
              onChange={handleFormChange}
              error={Boolean(errorMessages.classroom)}
              helperText={errorMessages.classroom}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MDInput
              label="Class Days"
              name="classDays"
              fullWidth
              value={formData.classDays}
              onChange={handleFormChange}
              error={Boolean(errorMessages.classDays)}
              helperText={errorMessages.classDays}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MDInput
              label="Labroom"
              name="labroom"
              fullWidth
              value={formData.labroom}
              onChange={handleFormChange}
              error={Boolean(errorMessages.labroom)}
              helperText={errorMessages.labroom}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MDInput
              label="Lab Days"
              name="labDays"
              fullWidth
              value={formData.labDays}
              onChange={handleFormChange}
              error={Boolean(errorMessages.labDays)}
              helper          Text={errorMessages.labDays}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MDInput
                label="Lab Instructor"
                name="labInstructor"
                fullWidth
                value={formData.labInstructor}
                onChange={handleFormChange}
                error={Boolean(errorMessages.labInstructor)}
                helperText={errorMessages.labInstructor}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MDInput
                label="Class Instructor"
                name="classInstructor"
                fullWidth
                value={formData.classInstructor}
                onChange={handleFormChange}
                error={Boolean(errorMessages.classInstructor)}
                helperText={errorMessages.classInstructor}
              />
            </Grid>
          </>
        );
      } else if (formData.schedule_type === "Exam") {
        return (
          <>
            <Grid item xs={12} md={3}>
              <MDInput
                label="Exam Date"
                name="examDate"
                fullWidth
                value={formData.examDate}
                onChange={handleFormChange}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errorMessages.examDate)}
                helperText={errorMessages.examDate}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MDInput
                label="Exam Time"
                name="examTime"
                fullWidth
                value={formData.examTime}
                onChange={handleFormChange}
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errorMessages.examTime)}
                helperText={errorMessages.examTime}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MDInput
                label="Exam Room"
                name="examRoom"
                fullWidth
                value={formData.examRoom}
                onChange={handleFormChange}
                error={Boolean(errorMessages.examRoom)}
                helperText={errorMessages.examRoom}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MDInput
                label="Examiner"
                name="examiner"
                fullWidth
                value={formData.examiner}
                onChange={handleFormChange}
                error={Boolean(errorMessages.examiner)}
                helperText={errorMessages.examiner}
              />
            </Grid>
          </>
        );
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
                <MDBox pt={3}>
                  <MDBox px={2}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={3}>
                        <MDInput
                          label="Course Code"
                          name="course_code"
                          fullWidth
                          value={formData.course_code}
                          onChange={handleCourseCodeChange}
                          error={Boolean(errorMessages.course_code)}
                          helperText={errorMessages.course_code}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <MDInput
                          label="Course Name"
                          name="course_name"
                          fullWidth
                          value={formData.course_name}
                          onChange={handleFormChange}
                          error={Boolean(errorMessages.course_name)}
                          helperText={errorMessages.course_name}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                          <Select
                            name="schedule_type"
                            value={formData.schedule_type}
                            onChange={handleFormChange}
                          >
                            {scheduleTypeOptions.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                          <Select
                            label="Year"
                            name="year"
                            value={formData.year}
                            onChange={handleFormChange}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                          >
                            <MenuItem value="">Select Year</MenuItem>
                            {[1, 2, 3, 4].map((yearOption) => (
                              <MenuItem key={yearOption} value={yearOption}>
                                {yearOption}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <MDInput
                          label="Year - Group"
                          name="yearGroup"
                          fullWidth
                          value={formData.yearGroup}
                          onChange={handleFormChange}
                          error={Boolean(errorMessages.yearGroup)}
                          helperText={errorMessages.yearGroup}
                        />
                      </Grid>
                      {renderFormFields()}
                      <Grid item xs={12}>
                        <MDButton
                          variant="contained"
                          color="primary"
                          onClick={addForm}
                        >
                          Add Schedule
                        </MDButton>
                      </Grid>
                      <Grid item xs={12}>
                        {errorMessage && (
                          <MDTypography color="error">
                            {errorMessage}
                          </MDTypography>
                        )}
                      </Grid>
                    </Grid>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card style={{ border: "3px solid #206A5D" }}>
                <MDBox pt={3}>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        {formList.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.course_code}</TableCell>
                            <TableCell>{item.course_name}</TableCell>
                            <TableCell>{item.year}</TableCell>
                            <TableCell>{item.yearGroup}</TableCell>
                            <TableCell>{item.classroom}</TableCell>
                            <TableCell>{item.classDays}</TableCell>
                            <TableCell>{item.labroom}</TableCell>
                            <TableCell>{item.labDays}</TableCell>
                            <TableCell>{item.labInstructor}</TableCell>
                            <TableCell>{item.classInstructor}</TableCell>
                            <TableCell>{item.examDate}</TableCell>
                            <TableCell>{item.examTime}</TableCell>
                            <TableCell>{item.examRoom}</TableCell>
                            <TableCell>{item.examiner}</TableCell>
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
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <MDButton
                variant="contained"
                color="primary"
                onClick={openConfirmationDialog}
              >
                Submit Schedule
              </MDButton>
              {loading && <CircularProgress />}
            </Grid>
          </Grid>
  
          <Dialog open={confirmationOpen} onClose={closeConfirmationDialog}>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to submit the schedule?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeConfirmationDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSendForm} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
  
          <Dialog open={removeIndex !== null} onClose={closeRemoveDialog}>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to remove this schedule?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeRemoveDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmRemoveForm} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }
  
  export default ScheduleRequest;
  
