import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import axios from "axios";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import { BASE_URL } from "../../appconfig";
import colors from "../../assets/theme/base/colors";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { Button, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import storeKeeperSidenav from "../../examples/Sidenav/storeKeeperSidenav";
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function ScheduleRequest() {
  const [course_name, setcourse_name] = useState("");
  const [courseId, setCourseId] = useState("");
  const [classroom, setClassroom] = useState("");
  const [labroom, setLabroom] = useState("");
  const [classDays, setClassDays] = useState([]);
  const [labDays, setLabDays] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [classInstructor, setClassInstructor] = useState("");
  const [labInstructor, setLabInstructor] = useState("");
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  // const [file, setFile] = useState(null);
  const [totalPrice, setTotalPrice] = useState("");
  const [formData, setFormData] = useState({
    course_name: "",
    courseId: "",
    classroom: "",
    labroom: "",
    classDays: "",
    labDays: "",
    labInstructor: "",
    classInstructor: "",
  });
  const [type, setType] = useState("request"); // Default value is "request", you can change it if needed
  const scheduleTypeOptions = ["Exam", "Class"];

  const [formList, setFormList] = useState({
    items: [],
    requested_by: userData.user.id,
    recommendations: "",
  });
  const [formListEntry, setFormListEntry] = useState({
    items: [],

    id: "",
    entry_approved_by: userData.user.id,
    recommendations: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    course_name: "",
    courseId: "",
    classroom: "",
    labroom: "",
    classDays: "",
    labDays: "",
    labInstructor: "",
    classInstructor: "",
  });
  const typeOptions = ["Exam", "class"];

  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useEffect(() => {
    const previousRoute = sessionStorage.getItem("preRouteData");

    if (previousRoute) {
      setSId(parseInt(previousRoute));
      setType("entry");
      sessionStorage.removeItem("preRouteData");
    }
    setFormList({
      ...formList,
    });
  }, [formList.items, formListEntry.items, type]);

  const [removeIndex, setRemoveIndex] = useState(null);

  const openRemoveDialog = (index) => {
    setRemoveIndex(index);
  };

  const closeRemoveDialog = () => {
    setRemoveIndex(null);
  };
  const openConfirmationDialog = () => {
    setConfirmationOpen(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmationOpen(false);
  };

  const handleSendForm = () => {
    closeConfirmationDialog(); // Close the confirmation dialog
    submitForms(); // Send the form
  };

  // Function to remove a form after confirmation
  const confirmRemoveForm = () => {
    if (removeIndex !== null && Array.isArray(formList.items)) {
      const updatedFormList = { ...formList }; // Create a shallow copy of formList
      updatedFormList.items = [...formList.items]; // Create a shallow copy of the items array
      updatedFormList.items.splice(removeIndex, 1); // Remove an item from the items array
      setFormList(updatedFormList); // Update formList with the modified items array
      closeRemoveDialog(); // Close the confirmation dialog
    }
  };

  const fetchCourseName = async (courseId) => {
    try {
      const response = await fetch(`${BASE_URL}/courses/${courseId}`);
      const data = await response.json();
      if (response.ok) {
        // Return the course name from the response data
        return data.course_name;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error fetching course name:", error);
      throw error;
    }
  };

  // const handleFormChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: finalValue,
  //   });

  //    if (name === 'courseId') {
  //     try {
  //       const courseName = await fetchCourseName(value);
  //       setFormData({
  //         ...formData,
  //         course_name: courseName,
  //       });
  //     } catch (error) {
  //       setErrorMessages({
  //         ...errorMessages,
  //         name: 'Error fetching course name.',
  //       });
  //     }
  //   }
  // };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "courseId") {
      fetchCourseName(value)
        .then((courseName) => {
          setFormData({
            ...formData,
            course_name: courseName,
          });
        })
        .catch((error) => {
          setErrorMessages({
            ...errorMessages,
            name: "Error fetching course name.",
          });
        });
    }
  };
  const accessToken = userData.accessToken;

  const addForm = () => {
    const newErrorMessages = {
      course_name: course_name ? "" : "course name is required",
      courseId: courseId ? "" : "course ID is required",
      classroom: classroom ? "" : "classroom is required",
      labroom: labroom ? "" : "labroom is required",
      classDays: classDays ? "" : "class days is required",
      labDays: labDays ? "" : "lab days is required",
      labInstructor: labInstructor ? "" : "lab instructor is required",
      classInstructor: classInstructor ? "" : "class instructor is required",
      scheduleType: selectedType !== "" ? "" : "Type of schedule is required",
    };
    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("please fill in all fields");
      setOpen(true);
      return;
    }
    setFormList({
      ...formList,
      items: [...formList.items, formData],
    });
    setFormData({
      course_name: "",
      courseId: "",
      classroom: "",
      labroom: "",
      classDays: "",
      labDays: "",
      labInstructor: "",
      classInstructor: "",
      scheduleType: "class",
    });
    setTotalPrice("");
  };

  const submitForms = async () => {
    setLoading(true);

    try {
      let response;
      response = await axios.post(
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
      handleTypeChange();
    } catch (error) {
      setErrorMessage("Error while sending schedule " + error);
      setOpen(true);
      setLoading(false);
    }
  };

  const handleTypeChange = (event) => {
    if (event) {
      const selectedType = event.target.value;
      setType(selectedType);
    }

    setFile(null);
    setFormList({
      items: [],
      requested_by: userData.user.id,
      recommendations: "",
    });
    setFormListEntry({
      items: [],
      id: "",
      entry_approved_by: userData.user.id,
      recommendations: "",
    });
    setFormData({
      course_name: "",
      courseId: "",
      classroom: "",
      labroom: "",
      classDays: "",
      labDays: "",
      labInstructor: "",
      classInstructor: "",
      scheduleType: "class",
    });
    setSId(null);
  };

  return (
    <DashboardLayout>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="alert-dialog-title">{"Notification"}</DialogTitle>
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
            variant="contained"
            color="primary"
            style={{ borderRadius: "10%" }}
          >
            close
          </MDButton>
        </DialogActions>
      </Dialog>
      {/* {userData.user.role == "student" ? (
        <NavbarForCommette />
      ) : userData.user.role == "dean" ? (
        <CafeManagerDashboardNavbar />
      ) : (
        <NavbarForCommette />
      )}
      {userData.user.role == "student" ? (
        <CafeCommetteeSidenav
          color="dark"
          brand=""
          brandName="የኮሚቴ ክፍል መተገበሪያ"
        />
      ) : userData.user.role == "dean" ? (
        <CafeManagerSidenav
          color="dark"
          brand=""
          brandName="የምግብ ዝግጅት ክፍል መተግበሪያ"
        />
      ) : (
        <storeKeeperSidenav color="dark" brand="" brandName="የስቶር ክፍል መተግበሪያ" />
      )} */}
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
                style={{
                  border: "  ",
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  spacing={2}
                  justifyContent="space-between"
                  paddingRight="15px"
                >
                  Schedule upload
                </Grid>
              </MDBox>

              <MDBox pt={3} pb={3} px={2}>
                <MDBox component="form" role="form">
                  <MDInput
                    type="text"
                    name="courseId"
                    label="Course Code"
                    variant="standard"
                    fullWidth
                    value={formData.courseId}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.name}
                    helperText={errorMessages.name}
                  />
                  <MDInput
                    type="text"
                    name="course_name"
                    label="Course Name"
                    variant="standard"
                    fullWidth
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
                    label="class days"
                    variant="standard"
                    fullWidth
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
                    label="classroom No"
                    variant="standard"
                    fullWidth
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
                    label="labroom"
                    variant="standard"
                    fullWidth
                    value={formData.labroom}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.labroom}
                    helperText={errorMessages.labroom}
                  />
                  <MDInput
                    type="text"
                    name="labInstructor"
                    label="lab Instructor"
                    variant="standard"
                    fullWidth
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
                    label="class Instructor"
                    variant="standard"
                    fullWidth
                    value={formData.classInstructor}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.classInstructor}
                    helperText={errorMessages.classInstructor}
                  />
                  <MDInput
                    type="text"
                    name="labDays"
                    label="Lab Days"
                    variant="standard"
                    fullWidth
                    value={formData.labDays}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.labDays}
                    helperText={errorMessages.labDays}
                  />

                  <MDBox mb={2}>
                    <TextField
                      select
                      label="Schedule Type"
                      variant="standard"
                      fullWidth
                      value={formData.scheduleType || ""}
                      onChange={handleFormChange}
                      name="scheduleType"
                      margin="dense"
                      required
                      error={!!errorMessages.scheduleType}
                      helperText={errorMessages.scheduleType}
                    >
                      <MenuItem value="">choose type of schedule</MenuItem>
                      {scheduleTypeOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </MDBox>
                  <MDBox mt={4} mb={1} textAlign="center">
                    <MDButton
                      variant="contained"
                      color="primary"
                      style={{ border: "3px solid #07689F" }}
                      onClick={addForm}
                      disabled={formList.length === 0 || loading}
                    >
                      Add
                    </MDButton>
                    <Dialog
                      open={confirmationOpen}
                      onClose={closeConfirmationDialog}
                      aria-labelledby="confirmation-dialog-title"
                      PaperProps={{ style: { padding: "15px" } }}
                    >
                      <DialogTitle id="confirmation-dialog-title">
                        {" "}
                        notification
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          are you sure you want to send the schedule?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <MDButton
                          onClick={closeConfirmationDialog}
                          style={{ borderRadius: "15%" }}
                          color="error"
                        >
                          No
                        </MDButton>
                        <MDButton
                          onClick={handleSendForm}
                          style={{ borderRadius: "15%" }}
                          color="primary"
                        >
                          yes
                        </MDButton>
                      </DialogActions>
                    </Dialog>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Display the list of forms */}
      <Card style={{ border: "3px solid #206A5D" }}>
        <MDBox pt={3} pb={3} px={2}>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow sx={{ backgroundColor: "#    " }}>
                  <TableCell>
                    <strong>No</strong>
                  </TableCell>
                  <TableCell>
                    <strong>course name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>course id</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Classroom</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Labroom</strong>
                  </TableCell>
                  <TableCell>
                    <strong>class Days</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Lab Days</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Class Instructor</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Lab Instructor</strong>
                  </TableCell>
                </TableRow>

                {(type === "request" ? formList.items : formListEntry.items) &&
                  (type === "request"
                    ? formList.items
                    : formListEntry.items
                  ).map((form, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{form.course_name}</TableCell>
                      <TableCell>{form.courseId}</TableCell>
                      <TableCell>{form.labroom}</TableCell>
                      <TableCell>{form.classDays}</TableCell>
                      <TableCell>{form.labDays}</TableCell>
                      <TableCell>{form.classInstructor}</TableCell>
                      <TableCell>{form.labInstructor}</TableCell>
                      <TableCell align="center">
                        <MDButton
                          variant="outlined"
                          color="error"
                          onClick={() => openRemoveDialog(index)}
                        >
                          remove
                        </MDButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MDBox>
      </Card>

      {/* Confirmation Dialog for Remove */}
      <Dialog
        open={removeIndex !== null}
        onClose={closeRemoveDialog}
        aria-labelledby="remove-dialog-title"
        aria-describedby="remove-dialog-description"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="remove-dialog-title">notification</DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-dialog-description">
            are you sure you want to remove the items?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={closeRemoveDialog}
            color="primary"
            style={{ borderRadius: "10%" }}
          >
            close
          </MDButton>
          <MDButton
            onClick={confirmRemoveForm}
            color="success"
            style={{ borderRadius: "10%" }}
          >
            notification
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Submit button */}
      <MDBox mt={4} mb={1} textAlign="center">
        {!loading ? (
          <MDButton
            variant="contained"
            color="primary"
            style={{ border: "3px solid #07689F" }}
            onClick={openConfirmationDialog}
            disabled={
              (formList.items.length === 0 &&
                formListEntry.items.length === 0) ||
              loading
            } // Update this line
          >
            send schedule
          </MDButton>
        ) : (
          <MDBox textAlign="center">
            <CircularProgress color="primary" />
          </MDBox>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ScheduleRequest;
