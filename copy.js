// import React, { useState } from "react";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "../../components/MDBox";
// import MDTypography from "../../components/MDTypography";
// import MDInput from "../../components/MDInput";
// import MDButton from "../../components/MDButton";
// import MainDashboard from "../../layouts/MainDashboard";
// import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import CircularProgress from "@mui/material/CircularProgress";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "../../examples/Footer";
// import axios from "axios";
// import { BASE_URL } from "../../appconfig";

// import CafeCommetteDashboard from "../CafeCommetteDashboard";
// import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import { Button, TextField } from "@mui/material";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import storeKeeperSidenav from "../../examples/Sidenav/storeKeeperSidenav";

// function InventoryEntry() {
//   const [course_name, setcourse_name] = useState("");
//   const [courseId, setCourseId] = useState("");
//   const [classroom, setClassroom] = useState("");
//   const [labroom, setLabroom] = useState("");
//   const [classDays, setClassDays] = useState([]);
//   const [labDays, setLabDays] = useState([]);
//   const [selectedType, setSelectedType] = useState("");
//   const [classInstructor, setClassInstructor] = useState("");
//   const [labInstructor, setLabInstructor] = useState("");
//   const electron = window.require("electron");
//   const ipcRenderer = electron.ipcRenderer;
//   const typeOptions = ["Exam", "class"];
//   const [errorMessage, setErrorMessage] = useState("");
//   const [errorMessages, setErrorMessages] = useState({
//     course_name: "",
//     courseId: "",
//     classroom: "",
//     labroom: "",
//     classDays: "",
//     labDays: "",
//     labInstructor: "",
//     classInstructor: "",
//   });
//   const CircularLoader = () => <CircularProgress size={24} color="inherit" />;
//   const userData = ipcRenderer.sendSync("get-user");
//   const accessToken = userData.accessToken;
//   const isInputValid = (input, fieldName) => {
//     if (
//       fieldName === "course_name" ||
//       fieldName === "classInstructor" ||
//       fieldName === "labInstructor"
//     ) {
//       // Allow letters and spaces in "Item Name" and "Approved By"
//       const letterRegex = /^[A-Za-z\s]*$/;
//       return letterRegex.test(input);
//     }
//   };
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);

//   //   const handleFormChange = (e) => {
//   //     const { name, value } = e.target;

//   //     if (!isInputValid(value, name)) {
//   //       return; // Prevent updating state for invalid input
//   //     }

//   //     // Update the state directly based on the input name
//   //     if (name === "course_name") {
//   //       setcourse_name(value);
//   //     } else if (name === "courseId") {
//   //       setCourseId(value);
//   //     } else {
//   //       // For other input fields, you can handle them similarly
//   //       if (name === "quantity") {
//   //         setQuantity(value);
//   //       } else if (name === "itemPrice") {
//   //         setItemPrice(value);
//   //       }
//   //     }
//   //   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;

//     if (!isInputValid(value, name)) {
//       return; // Prevent updating state for invalid input
//     }

//     // Update the state directly based on the input name
//     if (name === "course_name") {
//       setcourse_name(value);
//     } else if (name === "courseId") {
//       setCourseId(value);
//     } else if (name === "classroom") {
//       setClassroom(value);
//     } else if (name === "labroom") {
//       setLabroom(value);
//     } else if (name === "classDays") {
//       setClassDays(value.split(",").map((day) => day.trim()));
//     } else if (name === "labDays") {
//       setLabDays(value.split(",").map((day) => day.trim()));
//     } else if (name === "classInstructor") {
//       setClassInstructor(value);
//     } else if (name === "labInstructor") {
//       setLabInstructor(value);
//     }
//   };
//   const handleFormSubmit = async () => {
//     const newErrorMessages = {
//       course_name: course_name ? "" : "course name is required",
//       courseId: courseId ? "" : "course ID is required",
//       classroom: classroom ? "" : "classroom is required",
//       labroom: labroom ? "" : "labroom is required",
//       classDays: classDays ? "" : "class days is required",
//       labDays: labDays ? "" : "lab days is required",
//       labInstructor: labInstructor ? "" : "lab instructor is required",
//       classInstructor: classInstructor ? "" : "class instructor is required",
//       scheduleType: selectedType !== "" ? "" : "Type of schedule is required",
//     };
//     setErrorMessages(newErrorMessages);
//     if (Object.values(newErrorMessages).some((message) => message !== "")) {
//       setErrorMessage("please fill in all fields");
//       setOpen(true);
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${BASE_URL}/inventory`,
//         {
//           course_name,
//           courseId,
//           classroom,
//           labroom,
//           classDays,
//           labDays,
//           labInstructor,
//           classInstructor,
//           scheduleType: selectedType,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       console.log(accessToken);
//       setLoading(false);
//       if (response.data) {
//         setErrorMessage("schedule added sucessfully");
//         setOpen(true);
//         setClassDays("");
//         setClassInstructor("");
//         setClassroom("");
//         setCourseId("");
//         setcourse_name("");
//         setLabDays("");
//         setLabInstructor("");
//         setLabroom("");
//         setSelectedType("");
//       } else {
//         setErrorMessage("no respone");
//         setOpen(true);
//       }
//     } catch (error) {
//       if (error.response && error.response.data) {
//         const serverErrorMessages = error.response.data.errors;
//         let errorMessage = "sechedule not added: ";
//         for (const [key, value] of Object.entries(serverErrorMessages)) {
//           errorMessage += `${key}: ${value[0]}, `;
//         }
//         setErrorMessage(errorMessage);
//       } else {
//         setErrorMessage("sechedule not added: " + error);
//       }
//       setOpen(true);
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <Dialog
//         open={open}
//         onClose={() => setOpen(false)}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">{"notification"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             {errorMessage}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => {
//               setOpen(false);
//               setErrorMessage("");
//             }}
//             color="primary"
//             autoFocus
//           >
//             close
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <DashboardNavbar />
//       <Sidenav />
//       {/* <NavbarForCommette />
//       <storeKeeperSidenav color="dark" brand="" brandName="የስቶር ክፍል መተግበሪያ" /> */}
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6}>
//           <Grid item xs={12}>
//             <Card>
//               <MDBox
//                 mx={2}
//                 mt={2}
//                 py={3}
//                 px={2}
//                 variant="gradient"
//                 bgColor="dark"
//                 borderRadius="lg"
//                 coloredShadow="info"
//               >
//                 <MDTypography variant="h6" color="white">
//                   ADD SCHEDULE
//                 </MDTypography>
//               </MDBox>
//               <MDBox pt={3} pb={3} px={2}>
//                 <MDBox component="form" role="form">
//                   <MDBox mb={2}>
//                     <MDInput
//                       type="text"
//                       label="Course Name"
//                       variant="standard"
//                       fullWidth
//                       value={course_name}
//                       name="course_name"
//                       onChange={handleFormChange}
//                       margin="normal"
//                       required
//                       error={!!errorMessages.course_name}
//                       helperText={errorMessages.course_name}
//                     />
//                   </MDBox>
//                   <MDBox mb={2}>
//                     <MDInput
//                       type="text"
//                       label="Course ID"
//                       variant="standard"
//                       fullWidth
//                       value={courseId}
//                       name="courseId"
//                       onChange={handleFormChange}
//                       margin="normal"
//                       required
//                       error={!!errorMessages.courseId}
//                       helperText={errorMessages.courseId}
//                     />
//                   </MDBox>
//                   <MDBox mb={2}>
//                     <TextField
//                       select
//                       label="Schedule Type"
//                       variant="standard"
//                       fullWidth
//                       value={selectedType}
//                       name="scheduleType"
//                       onChange={(event) => setSelectedType(event.target.value)}
//                       margin="normal"
//                       required
//                       error={!!errorMessages.scheduleType}
//                       helperText={errorMessages.scheduleType}
//                     >
//                       {typeOptions.map((scheduleType, index) => (
//                         <MenuItem key={index} value={scheduleType}>
//                           {scheduleType}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </MDBox>
//                   <MDBox mb={2}>
//                     <MDInput
//                       type="text"
//                       label="Classroom"
//                       variant="standard"
//                       fullWidth
//                       value={classroom}
//                       name="classroom"
//                       onChange={handleFormChange}
//                       margin="normal"
//                       required
//                       error={!!errorMessages.classroom}
//                       helperText={errorMessages.classroom}
//                     />
//                   </MDBox>
//                   <MDBox mb={2}>
//                     <MDInput
//                       type="text"
//                       label="Labroom"
//                       variant="standard"
//                       fullWidth
//                       value={labroom}
//                       name="labroom"
//                       onChange={handleFormChange}
//                       margin="normal"
//                       required
//                       error={!!errorMessages.labroom}
//                       helperText={errorMessages.labroom}
//                     />
//                   </MDBox>
//                   <MDBox mb={2}>
//                     <MDInput
//                       type="text"
//                       label="Class Days (comma-separated)"
//                       variant="standard"
//                       fullWidth
//                       value={classDays.join(", ")}
//                       name="classDays"
//                       onChange={handleFormChange}
//                       margin="normal"
//                       required
//                       error={!!errorMessages.classDays}
//                       helperText={errorMessages.classDays}
//                     />
//                   </MDBox>
//                   <MDBox mb={2}>
//                     <MDInput
//                       type="text"
//                       label="Lab Days (comma-separated)"
//                       variant="standard"
//                       fullWidth
//                       value={labDays.join(", ")}
//                       name="labDays"
//                       onChange={handleFormChange}
//                       margin="normal"
//                       required
//                       error={!!errorMessages.labDays}
//                       helperText={errorMessages.labDays}
//                     />
//                   </MDBox>
//                   <MDBox mb={2}>
//                     <MDInput
//                       type="text"
//                       label="Class Instructor"
//                       variant="standard"
//                       fullWidth
//                       value={classInstructor}
//                       name="classInstructor"
//                       onChange={handleFormChange}
//                       margin="normal"
//                       required
//                       error={!!errorMessages.classInstructor}
//                       helperText={errorMessages.classInstructor}
//                     />
//                   </MDBox>
//                   <MDBox mb={2}>
//                     <MDInput
//                       type="text"
//                       label="Lab Instructor"
//                       variant="standard"
//                       fullWidth
//                       value={labInstructor}
//                       name="labInstructor"
//                       onChange={handleFormChange}
//                       margin="normal"
//                       required
//                       error={!!errorMessages.labInstructor}
//                       helperText={errorMessages.labInstructor}
//                     />
//                   </MDBox>

//                   <MDBox mt={4} mb={1} textAlign="center">
//                     <MDButton
//                       variant="gradient"
//                       color="info"
//                       onClick={handleFormSubmit}
//                     >
//                       {loading ? <CircularLoader /> : "sumbit"}
//                     </MDButton>
//                   </MDBox>
//                 </MDBox>
//               </MDBox>
//             </Card>
//           </Grid>
//         </Grid>
//       </MDBox>
//       <Footer />
//     </DashboardLayout>
//   );
// }

// export default InventoryEntry;
