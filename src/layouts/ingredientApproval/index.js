// import React, { useState, useEffect } from "react";
// import MDBox from "../../components/MDBox";
// import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "../../examples/Footer";
// import colors from "../../assets/theme/base/colors";
// import axios from "axios";
// import { BASE_URL } from "../../appconfig";
// import { useLocation, useNavigate } from "react-router-dom";
// import CafeCommetteDashboard from "../CafeCommetteDashboard";
// import TableContainer from "@mui/material/TableContainer";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableRow from "@mui/material/TableRow";
// import TableCell from "@mui/material/TableCell";
// import Pagination from "@mui/material/Pagination";
// import Typography from "@mui/material/Typography";
// import Paper from "@mui/material/Paper";
// import Box from "@mui/material/Box";
// import Select from "@mui/material/Select";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import FormControl from "@mui/material/FormControl";
// import MenuItem from "@mui/material/MenuItem";
// import Button from "@mui/material/Button";
// import Input from "@mui/material/Input";
// import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
// import InventoryList from "../assignmentView/index";
// import Link from "@mui/material/Link";
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
// import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
// // import Sidenav from "../../examples/Sidenav/AdminSidenav";
// import storeKeeperSidenav from "../../examples/Sidenav/storeKeeperSidenav";
// import {
//   EthDateTime,
//   dayOfWeekString,
//   limits,
// } from "ethiopian-calendar-date-converter";
// import CircularProgress from "@mui/material/CircularProgress";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogActions from "@mui/material/DialogActions";
// import MDButton from "../../components/MDButton";

// function scheduleApproval({ reqId }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isCalled = reqId > 0;

//   const [showE, setShowE] = useState(false);
//   const [approvalRequests, setApprovalRequests] = useState();
//   const [selectedTimeRange, setSelectedTimeRange] = useState("today");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);

//   const [approvalType, setApprovalType] = useState("stock"); // Default to Stock Approval
//   const electron = window.require("electron");
//   const ipcRenderer = electron.ipcRenderer;
//   const userData = ipcRenderer.sendSync("get-user");
//   const accessToken = userData.accessToken;

//   const [approvalStatus, setApprovalStatus] = useState(null);
//   const [isApproved, setIsApproved] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(null);
//   const [entId, setEntId] = useState(0);
//   const [requestId, setRequestId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [confirmedAction, setConfirmedAction] = useState(null);

//   const handleApproveRejConfirmation = (user_id, status) => {
//     setConfirmedAction({ user_id, status });
//     setOpenDialog(true);
//   };

//   const handleConfirmation = () => {
//     if (confirmedAction) {
//       handleApproveRej(confirmedAction.user_id, confirmedAction.status);
//       setOpenDialog(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(currentPage);
//   }, []);

//   const fetchData = async (page) => {
//     setLoading(true);
//     const api = isCalled
//       ? `requestbyid/${reqId}`
//       : `requestfetchinv?page=${page}`;

//     try {
//       const response = await axios.get(`${BASE_URL}/${api}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (isCalled) {
//         setApprovalRequests(response.data.data);
//       } else {
//         if (response.data) {
//           setApprovalStatus(response.data.requests.data[0].request_approved_by);
//           setIsApproved(response.data.requests.data[0].request_status);
//           setRequestId(parseInt(response.data.requests.data[0].id));
//           setEntId(parseInt(response.data.requests.data[0].id));
//           setIsSubmitted(
//             response.data.requests.data[0].submitted_items_start_id
//           );
//           setApprovalRequests(response.data.requests.data);
//           setCurrentPage(response.data.requests.current_page);
//           setLastPage(response.data.requests.last_page);
//         } else {
//         }
//       }
//     } catch (error) {}
//     setLoading(false);
//   };

//   const handlePageChange = (event, page) => {
//     if (showE) {
//       setShowE(!showE);
//     }
//     setCurrentPage(page);

//     fetchData(page);
//   };

//   const handleEntry = (requestID) => {
//     sessionStorage.setItem("preRouteData", requestID);
//     navigate("/schedulePost");
//   };
//   function convertToEthiopianDate(inputDate) {
//     const parsedDate = new Date(inputDate);

//     if (!isNaN(parsedDate.getTime())) {
//       const ethDateTime = EthDateTime.fromEuropeanDate(parsedDate);
//       const dayOfWeek = ethDateTime.getDay();
//       const dayOfWeekStrings = [
//         "እሁድ",
//         "ሰኞ",
//         "ማክሰኞ",
//         "ረቡእ",
//         "ሐሙስ",
//         "አርብ",
//         "ቅዳሜ",
//       ];
//       const dayName = dayOfWeekStrings[dayOfWeek];

//       const ethiopianDateStr = `${dayName}, ${ethDateTime.toDateString()}`;

//       return `${ethiopianDateStr}`;
//     } else {
//       return "Invalid Date";
//     }
//   }

//   const handleApproveRej = async (user_id, status) => {
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/requestApproval`,
//         {
//           id: requestId,
//           user_id: user_id,
//           status: status,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data) {
//         fetchData(currentPage);
//       } else {
//       }
//     } catch (error) {}
//     setLoading(false);
//   };

//   const options = [
//     { label: "Today", value: "today" },
//     { label: "This week", value: "this week" },
//   ];

//   const handleViewChangeEntry = (requestID) => {
//     setShowE(!showE);
//   };

//   const renderSubUI = () => {
//     if (loading) {
//       return (
//         <MDBox textAlign="center">
//           <CircularProgress color="primary" />
//         </MDBox>
//       );
//     }
//     if (!approvalRequests || approvalRequests.length === 0) {
//       return null; // Return null or handle the case when approvalRequests is empty
//     }
//     const colSpan = isCalled ? 5 : 3;
//     return (
//       <>
//         <TableContainer component={Box}>
//           <Box
//             sx={{
//               backgroundColor: colors.white.main,
//               overflow: "scroll",
//               maxHeight: "600px",
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//           >
//             <Table>
//               <TableBody>
//                 <TableRow
//                   sx={{
//                     backgroundColor: colors.light.main,
//                     position: "sticky",
//                     top: 0,
//                     zIndex: 1,
//                   }}
//                 >
//                   {/* Header row */}
//                   <TableCell>
//                     <strong>ተራ ቁጥር</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>የእቃው አይነት</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>ብዛት</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>መለኪያ</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>የአንዱ ዋጋ</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>ጠቅላላ ዋጋ ብር</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>የጠቅላላ ዋጋ በፊደል</strong>
//                   </TableCell>
//                 </TableRow>
//                 {/* Map the related_requests array within approvalRequests */}

//                 {approvalRequests &&
//                   approvalRequests.length > 0 &&
//                   approvalRequests[0].related_requests.map((data, index) => (
//                     <TableRow key={data.id}>
//                       {/* Render data from related_requests */}
//                       <TableCell>{index + 1}</TableCell>
//                       <TableCell>{data ? data.name : ""}</TableCell>
//                       <TableCell>{data ? data.quantity : ""}</TableCell>
//                       <TableCell>{data ? data.measured_in : ""}</TableCell>
//                       <TableCell>{data ? data.price_per_item : ""}</TableCell>
//                       <TableCell>
//                         {data && data.quantity && data.price_per_item
//                           ? parseFloat(data.quantity) *
//                             parseFloat(data.price_per_item)
//                           : ""}
//                       </TableCell>
//                       <TableCell>{data ? data.price_word : ""}</TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </Box>
//           <MDBox
//             variant="gradient"
//             style={{
//               backgroundColor: "#DEDDDB",
//               display: "block",
//               alignItems: "center",
//               justifyContent: "center",
//               textAlign: "center !important",
//               width: "60%",
//               height: "100%",
//               margin: "10px auto",
//               padding: "1rem",
//               color: "black",
//               border: "2px solid #000",
//               boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
//               borderRadius: "30px",
//             }}
//           >
//             <TableRow
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <TableCell style={{ border: "0px" }}>ጠቅላላ ዋጋ:</TableCell>
//               <TableCell style={{ border: "0px" }} align="center">
//                 {approvalRequests[0].total_price_request}
//               </TableCell>
//             </TableRow>

//             <TableRow
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <TableCell style={{ border: "0px" }}>የጠያቂው ስም:</TableCell>
//               <TableCell style={{ border: "0px" }} align="right">
//                 {approvalRequests[0].requested_by.name}
//               </TableCell>
//             </TableRow>

//             <TableRow
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <TableCell style={{ border: "0px" }}>ቀን:</TableCell>
//               <TableCell style={{ border: "0px" }} align="right">
//                 {convertToEthiopianDate(
//                   approvalRequests[0].formatted_created_at
//                 )}{" "}
//                 አ/ም
//               </TableCell>
//             </TableRow>
//           </MDBox>
//         </TableContainer>

//         {approvalRequests && approvalRequests.length > 0 && (
//           <MDBox px={3} py={3}>
//             <Box mt={1}>
//               {!isCalled && (
//                 <Box>
//                   {isApproved === null && userData.user.role == "student" && (
//                     <Box>
//                       <Button
//                         variant="contained"
//                         style={{
//                           backgroundColor: "rgb(12, 56, 71)",
//                           color: "white",
//                           marginRight: "20px",
//                         }}
//                         onClick={() =>
//                           handleApproveRejConfirmation(
//                             parseInt(userData.user.id),
//                             "approved"
//                           )
//                         }
//                       >
//                         ግዥ መቀበያ
//                       </Button>
//                       <Button
//                         variant="contained"
//                         style={{
//                           backgroundColor: "rgb(204, 4, 17)",
//                           color: "white",
//                         }}
//                         onClick={() =>
//                           handleApproveRejConfirmation(
//                             parseInt(userData.user.id),
//                             "rejected"
//                           )
//                         }
//                       >
//                         ውድቅ ማድረጊያ
//                       </Button>
//                     </Box>
//                   )}

//                   <Box>
//                     {/* Display pending status based on approvalStatus */}
//                     {isApproved === null && (
//                       <Typography>ሁኔታ: በመጠባበቅ ላይ</Typography>
//                     )}

//                     {/* Conditional rendering of buttons based on isSubmitted */}
//                     {isApproved === "approved" && isSubmitted === null && (
//                       <Typography
//                         style={{
//                           color: colors.warning.main,
//                           fontFamily: "Arial, sans-serif",
//                         }}
//                       >
//                         ሁኔታ: የተፈቀደ <br />
//                         <br />
//                         የግዢ መረጃ: ያልገባ
//                         {userData.user.role === "storeKeeper" && (
//                           <Button
//                             variant="contained"
//                             style={{
//                               marginLeft: "10px",
//                               backgroundColor: "rgb(33, 102, 87)",
//                               color: "white",
//                             }}
//                             onClick={() => handleEntry(requestId)}
//                           >
//                             የተያያዥ ግዢ መረጃ ያስገቡ
//                           </Button>
//                         )}
//                       </Typography>
//                     )}

//                     {isApproved === "approved" && isSubmitted !== null && (
//                       <Button
//                         variant="contained"
//                         style={{
//                           backgroundColor: showE
//                             ? "rgb(204, 4, 17)"
//                             : "rgb(12, 56, 71)",
//                           color: "white",
//                         }}
//                         onClick={() => handleViewChangeEntry(requestId)}
//                       >
//                         {showE ? "ወደበፊቱ መልስ" : "የተያያዥ ግዢ መረጃ "}
//                       </Button>
//                     )}

//                     {isApproved === "rejected" && (
//                       <Typography style={{ color: colors.error.main }}>
//                         ሁኔታ: ውድቅ የተደረገ
//                       </Typography>
//                     )}
//                   </Box>
//                 </Box>
//               )}
//             </Box>
//             <Dialog
//               open={openDialog}
//               onClose={() => setOpenDialog(false)}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//               PaperProps={{ style: { padding: "15px" } }}
//             >
//               <DialogTitle id="alert-dialog-title">የደብዳቤ መቀበያ</DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   ድርጊቱን ለማከናዎን እርግጠኛ ነዎት ?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions style={{ justifyContent: "space-between" }}>
//                 <MDButton onClick={() => setOpenDialog(false)} color="error">
//                   አይደለሁም
//                 </MDButton>
//                 <MDButton onClick={handleConfirmation} color="primary">
//                   አዎ
//                 </MDButton>
//               </DialogActions>
//             </Dialog>
//           </MDBox>
//         )}
//       </>
//     );
//   };
//   const renderFullUI = () => {
//     return (
//       <DashboardLayout>
//         <DashboardNavbar />
//         {/* {userData.user.role == "student" ? (
//           <NavbarForCommette />
//         ) : userData.user.role == "dean" ? (
//           <CafeManagerDashboardNavbar />
//         ) : (
//           <NavbarForCommette />
//         )}

//         {userData.user.role == "student" ? (
//           <CafeCommetteeSidenav
//             color="dark"
//             brand=""
//             brandName="የኮሚቴ ክፍል መተገበሪያ"
//           />
//         ) : userData.user.role == "dean" ? (
//           <CafeManagerSidenav
//             color="dark"
//             brand=""
//             brandName="የምግብ ዝግጅት ክፍል መተገበሪያ"
//           />
//         ) : (
//           <storeKeeperSidenav
//             color="dark"
//             brand=""
//             brandName=" የስቶር ክፍል መተግበሪያ"
//           />
//         )} */}
//         <Sidenav />
//         <Grid container spacing={6}>
//           <Grid item xs={12} md={showE ? 6 : 12}>
//             <Card
//               style={{
//                 border: "3px solid #206A5D",
//                 marginTop: "40px",
//                 padding: "20px",
//               }}
//               mt={3}
//             >
//               <MDBox
//                 mx={2}
//                 mt={-6}
//                 mb={2}
//                 py={3}
//                 px={2}
//                 variant="gradient"
//                 bgColor="dark"
//                 borderRadius="lg"
//                 coloredShadow="info"
//                 textAlign="center"
//                 style={{ border: "3px solid #0779E4" }}
//               >
//                 <Typography style={{ color: "white" }} variant="h6">
//                   የንብረት ግዢ ጥያቄ መረጃ
//                 </Typography>
//               </MDBox>
//               {renderSubUI()}
//             </Card>
//           </Grid>
//           {showE && (
//             <Grid item xs={12} md={6} mt={5}>
//               <InventoryList entryId={entId} />
//             </Grid>
//           )}
//         </Grid>
//         <Box mt={2} display="flex" justifyContent="center">
//           <Pagination
//             component={Link}
//             count={lastPage}
//             onChange={handlePageChange}
//             variant="outlined"
//             shape="rounded"
//             color="primary"
//           />
//         </Box>
//         <Footer />
//       </DashboardLayout>
//     );
//   };

//   return isCalled ? renderSubUI() : renderFullUI();
// }

// export default scheduleApproval;
