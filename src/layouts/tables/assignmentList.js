// import React, { useState, useEffect } from "react";
// import TableContainer from "@mui/material/TableContainer";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableRow from "@mui/material/TableRow";
// import TableCell from "@mui/material/TableCell";
// import Paper from "@mui/material/Paper";
// import Grid from "@mui/material/Grid";
// import axios from "axios";
// import { BASE_URL } from "../../appconfig";
// import MDBox from "../../components/MDBox";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
// import MainDashboard from "../MainDashboard";
// import Footer from "../../examples/Footer";
// import MDTypography from "../../components/MDTypography";
// import {
//   Card,
//   Box,
//   Button,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
// } from "@mui/material";
// import { CheckCircle, Cancel, Edit, Delete } from "@mui/icons-material";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";

// function AssignmentsPage() {
//   const electron = window.require("electron");
//   const ipcRenderer = electron.ipcRenderer;
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'sent', 'unsent'
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);
//   const itemsPerPage = 20; // Set the number of items to display per page
//   const [current_page, setCurrentPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const userData = ipcRenderer.sendSync("get-user");
//   const accessToken = userData.accessToken;

//   const fetchAssignments = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${BASE_URL}/getallassignments`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       });
//       console.log(response.data);
//       if (response.data && response.data.assignments) {
//         setAssignments(response.data["assignments"]);
//         setCurrentPage(response.data.current_page);
//         setLastPage(response.data.last_page);
//       } else {
//       }
//     } catch (error) {
//       console.error("Error fetching assignments:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchAssignments();
//   }, [current_page]);

//   const handleFilterChange = (event) => {
//     setFilterStatus(event.target.value);
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     // Implement logic to update the status of the assignment on the server
//     try {
//       await axios.post(
//         `${BASE_URL}/assignments/{id}/status`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Update the local state to reflect the change
//       setAssignments((prevAssignments) =>
//         prevAssignments.map((assignment) =>
//           assignment.id === id
//             ? { ...assignment, status: newStatus }
//             : assignment
//         )
//       );
//     } catch (error) {
//       console.error("Error updating assignment status:", error);
//       setErrorMessage("Error updating assignment status");
//     }
//   };

//   function handleEditAssignment(updatedAssignment) {
//     if (!selectedAssignment) {
//       setAssignments([...assignments, updatedAssignment]);
//     } else {
//       setAssignments(
//         assignments.map((assignment) =>
//           assignment.id === updatedAssignment.id
//             ? updatedAssignment
//             : assignment
//         )
//       );
//       setSelectedAssignment(null);
//     }
//     Navigate("/assignmentUpload", {
//       statec: { selectedAssignment: updatedAssignment },
//     });
//   }
//   function handleDeleteDialogOpen(id) {
//     const assignmentItem = assignments.find(
//       (assignmentItem) => assignmentItem.id === id
//     );
//     setItemToDelete(assignmentItem);
//     setDeleteDialogOpen(true);
//   }
//   const handleDeleteDialogClose = () => {
//     setDeleteDialogOpen(false);
//   };
//   const handleDeleteAssignment = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/deleteAssignment/${id}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       });

//       // Update the local state to reflect the deletion
//       setAssignments(assignments.filter((assignment) => assignment.id !== id));
//       setDeleteDialogOpen(false);
//     } catch (error) {
//       console.error("Error deleting assignment:", error);
//       setErrorMessage("Error deleting assignment");
//     }
//   };

//   const filteredAssignments = (assignments || []).filter((assignment) => {
//     if (filterStatus === "all") {
//       return true;
//     }
//     return assignment.status === filterStatus;
//   });

//   return (
//     <div style={{ display: "flex" }}>
//       <Sidenav />
//       <div style={{ flex: "1" }}>
//         <DashboardNavbar />
//         <MainDashboard />
//         <MDBox pt={6} pb={3}>
//           <Grid container spacing={6}>
//             <Grid item xs={12}>
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
//                 <MDTypography variant="h4" color="white">
//                   Assignment List
//                 </MDTypography>
//               </MDBox>
//               <Card style={{ marginTop: "20px", padding: "20px" }}>
//                 <MDBox p={3} display="flex" alignItems="center">
//                   <FormControl
//                     variant="outlined"
//                     fullWidth
//                     style={{ margin: "0 0 10px" }}
//                   >
//                     <InputLabel htmlFor="filter-status">Status</InputLabel>
//                     <Select
//                       value={filterStatus}
//                       onChange={handleFilterChange}
//                       label="Status"
//                       inputProps={{
//                         name: "status",
//                         id: "filter-status",
//                       }}
//                     >
//                       <MenuItem value="all">All</MenuItem>
//                       <MenuItem value="sent">Sent</MenuItem>
//                       <MenuItem value="unsent">Unsent</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </MDBox>

//                 <Table>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell>
//                         <strong>Assignment Name</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Course Name</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Assignment Description</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Due Date</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Status</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Actions</strong>
//                       </TableCell>
//                     </TableRow>
//                     {filteredAssignments.map((assignment) => (
//                       <TableRow key={assignment.id}>
//                         <TableCell>{assignment.ass_name}</TableCell>
//                         <TableCell>{assignment.course_name}</TableCell>
//                         <TableCell>{assignment.Add_description}</TableCell>
//                         <TableCell>{assignment.due_date}</TableCell>
//                         <TableCell>{assignment.status}</TableCell>
//                         <TableCell>
//                           <Box display="flex">
//                             <Button
//                               variant="contained"
//                               color="success"
//                               startIcon={<CheckCircle />}
//                               onClick={() =>
//                                 handleStatusChange(assignment.id, "sent")
//                               }
//                             >
//                               Sent
//                             </Button>
//                             <Button
//                               variant="contained"
//                               color="error"
//                               startIcon={<Cancel />}
//                               onClick={() =>
//                                 handleStatusChange(assignment.id, "unsent")
//                               }
//                             >
//                               Unsent
//                             </Button>
//                             <Button
//                               variant="contained"
//                               startIcon={<Edit />}
//                               onClick={() =>
//                                 handleEditAssignment(assignment.id)
//                               }
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               variant="contained"
//                               color="error"
//                               startIcon={<Delete />}
//                               onClick={() =>
//                                 handleDeleteAssignment(assignment.id)
//                               }
//                             >
//                               Delete
//                             </Button>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>

//                 {loading && <p>Loading...</p>}
//                 {errorMessage && <p>{errorMessage}</p>}
//               </Card>
//             </Grid>
//           </Grid>
//         </MDBox>
//         <Footer />
//         <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
//           <DialogTitle>Confirm Deletion</DialogTitle>
//           <DialogContent>
//             {itemToDelete && (
//               <p>
//                 Are you sure you want to delete{" "}
//                 <strong>"{itemToDelete.name} ?"</strong>?
//               </p>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleDeleteDialogClose}>Close</Button>
//             <Button
//               onClick={() =>
//                 handleDeleteAssignment(itemToDelete ? itemToDelete.id : null)
//               }
//             >
//               Delete
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     </div>
//   );
// }

// export default AssignmentsPage;
