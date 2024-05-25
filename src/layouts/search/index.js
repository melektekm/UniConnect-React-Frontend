// import React, { useState, useEffect } from "react";
// import { confirmAlert } from "react-confirm-alert";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "../../components/MDBox";
// import MDTypography from "../../components/MDTypography";
// import MDButton from "../../components/MDButton";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import Button from "@mui/material/Button"; // Import Button component
// import MainDashboard from "../../layouts/MainDashboard";
// import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "../../examples/Footer";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { useHistory, useLocation } from "react-router-dom";
// import { Segment } from "semantic-ui-react";
// import { BASE_URL } from "../../appconfig";
// import Store from "electron-store";
// import { session } from "electron";
// import MDInput from "../../components/MDInput";
// import Icon from "@mui/material/Icon";
// import Typography from "@mui/material/Typography";
// import { Select, MenuItem } from "@mui/material";
// import FoodMenu from "../foodMenu";
// import CoordinatorDashboard from "../CoordinatorDashboard";

// import {
//   CardContent,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";

// function SearchMenu() {
//   const [foodMenu, setFoodMenu] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedMenu, setSelectedMenu] = useState(null);
//   const [selectedMenus, setSelectedMenus] = useState([]);

//   const [selectedAction, setSelectedAction] = useState([]);
//   const [searchType, setSearchType] = useState("");
//   const [selectedAvailability, setSelectedAvailability] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { pathname } = location;
//   const electron = window.require("electron");
//   const ipcRenderer = electron.ipcRenderer;
//   const userData = ipcRenderer.sendSync("get-user");
//   const accessToken = userData.accessToken;
//   const [isEmployee, setIsEmployee] = useState(false);
//   const initialData = {
//     totalPrice: 0,
//     employeeId: "",
//     guestName: "",
//   };

//   function handleUpdateMenu(updatedMenu) {
//     if (!selectedMenu) {
//       // If selectedMenu is null, user is adding a new item
//       // Add the new item to the menu
//       setFoodMenu([...foodMenu, updatedMenu]);
//     } else {
//       // If selectedMenu is not null, user is updating an existing item
//       // Update the menu item and reset selectedMenu
//       setFoodMenu(
//         foodMenu.map((menu) =>
//           menu.id === updatedMenu.id ? updatedMenu : menu
//         )
//       );
//       setSelectedMenu(null);
//     }
//     navigate("/addFood", { state: { selectedMenu: updatedMenu } });
//   }

//   function handleDeleteMenu(menuId) {
//     const menuToDelete = foodMenu.find((menuItem) => menuItem.id === menuId);
//     confirmAlert({
//       title: "Confirm Deletion",
//       message: `Are you sure you want to delete the menu item "${menuToDelete.name}"?`,
//       buttons: [
//         {
//           label: "Yes",
//           onClick: async () => {
//             // Perform the deletion from the database
//             try {
//               await axios.delete(
//                 `http://localhost/UniConnect-laravel-backend/public/api/menu-items/${menuId}`,
//                 {
//                   headers: {
//                     Authorization:
//                       "Bearer ngUqKnSSivGkRC9mOVGELgKQnn7F2mrWlG43V84X",
//                   },
//                 }
//               );

//               // Update the local state to remove the deleted menu item
//               setFoodMenu(
//                 foodMenu.filter((menuItem) => menuItem.id !== menuId)
//               );
//             } catch (error) {
//               console.error("An error occurred:", error.message);
//             }
//           },
//         },
//         {
//           label: "No",
//           onClick: () => {
//             // No action needed
//           },
//         },
//       ],
//     });
//   }
//   const handleMenuSelect = (foodItemId) => {
//     setSelectedMenus((prevSelectedMenus) => {
//       if (prevSelectedMenus.includes(foodItemId)) {
//         return prevSelectedMenus.filter((item) => item !== foodItemId);
//       } else {
//         return [...prevSelectedMenus, foodItemId];
//       }
//     });
//   };

//   useEffect(() => {
//     // Retrieve the previous route from sessionStorage
//     const previousRoute = sessionStorage.getItem("previousRoute");

//     if (previousRoute) {
//       console.log("Previous Route:", previousRoute);

//       // Check the value of previousRoute and set searchType accordingly
//       if (previousRoute === "/addEmployee") {
//         setSearchType("employee");
//       } else if (previousRoute === "/addOrder") {
//         setSearchType("order");
//       } else if (previousRoute === "/buyFood") {
//         setSelectedAction("add_to_buy_food");
//         setSearchType("employee");
//       } else {
//         // Default to 'menuitem' or handle other cases as needed
//         setSearchType("menuitem");
//       }
//     }
//   }, []);

//   const handleMenuClick = async (employee) => {
//     console.log(employee.id);
//     if (selectedAction === "add_to_buy_food") {
//       if (employee && employee.id !== undefined) {
//         const employeeId = employee.id.toString(); // Convert to a string

//         // Use a setTimeout to simulate an asynchronous operation (replace this with your actual async operation)
//         await new Promise((resolve) => setTimeout(resolve, 1000));

//         // Store data in sessionStorage
//         sessionStorage.setItem("previous Route", employeeId);

//         // Navigate to the /buyFood route
//         navigate("/buyFood");
//       } else {
//         console.error("Invalid employee or employee ID.");
//       }
//     } else if (selectedAction === "add_to_employee_edit") {
//       // Handle the action for "Add to Employee Edit" here
//       // ...
//     }
//   };

//   const [searchInput, setSearchInput] = useState("");

//   const handleSearch = async () => {
//     if (searchType === "menuitem") {
//       try {
//         console.log(searchType + "oierjgoiti");
//         const response = await axios.get(`${BASE_URL}/search`, {
//           params: {
//             term: searchInput,
//           },
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         if (response.data) {
//           setFoodMenu(response.data);
//           console.log(foodMenu);
//         } else {
//           console.log("Empty response");
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     }
//     if (searchType === "employee") {
//       try {
//         console.log(searchType + "oierjgoiti");
//         const response = await axios.get(`${BASE_URL}/searchEmployeeByname`, {
//           params: {
//             term: searchInput,
//           },
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         if (response.data) {
//           setEmployeeList(response.data);
//           console.log(response.data);
//           console.log(employeeList);
//         } else {
//           console.log("Empty response");
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     }

//     console.log("Search input:", searchInput);
//   };

//   return (
//     <DashboardLayout>
//       {/* {userData.user.role == "coordinator" ? (
//         <DashboardNavbar />
//       ) : (
//         <StudentNavBar />
//       )}
//       <CoordinatorDashboard /> */}
//       <DashboardNavbar />
//       <Sidenav />
//       <MDBox
//         mx={2}
//         mt={1}
//         mb={2}
//         py={3}
//         px={2}
//         variant="gradient"
//         bgColor="success"
//         borderRadius="lg"
//         coloredShadow="info"
//         textAlign="center"
//       >
//         <MDInput
//           placeholder="Search..."
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           style={{ marginRight: "10px", width: "300px", color: "white" }}
//         />

//         <MDButton variant="gradient" onClick={handleSearch} color={"secondary"}>
//           <Icon fontSize="small">search</Icon>
//         </MDButton>
//         <Select
//           value={searchType}
//           onChange={(e) => setSearchType(e.target.value)}
//           style={{ marginRight: "10px", width: "100px", color: "white" }}
//         >
//           <MenuItem value="employee">Employee</MenuItem>
//           <MenuItem value="menuitem">MenuItem</MenuItem>
//           <MenuItem value="order">Order</MenuItem>
//         </Select>
//       </MDBox>
//       <MDBox py={3}>
//         {searchType === "menuitem" && renderFoodMenu()}
//         {searchType === "employee" && renderEmployeeBody()}
//         {searchType === "order" && renderOrderBody()}
//       </MDBox>

//       <Footer />
//     </DashboardLayout>
//   );

//   function renderFoodMenu() {
//     if (foodMenu.length === 0) {
//       return (
//         <Typography variant="h6" align="center">
//           No menu found
//         </Typography>
//       );
//     }

//     return (
//       <Grid container spacing={6}>
//         {foodMenu.map((foodItem) => (
//           <Grid item xs={12} sm={6} md={4} key={foodItem.id}>
//             <Card>
//               <MDBox
//                 mx={2}
//                 mt={-3}
//                 py={3}
//                 px={2}
//                 variant="gradient"
//                 bgColor="info"
//                 borderRadius="lg"
//                 coloredShadow="info"
//               >
//                 <MDTypography variant="h4" color="white">
//                   {foodItem.name}
//                 </MDTypography>
//                 <MDTypography variant="h6" color="white">
//                   {foodItem.meal_type}
//                 </MDTypography>
//               </MDBox>
//               <MDBox pt={3} pb={3} px={2}>
//                 <img
//                   src={foodItem.image_url}
//                   alt={foodItem.name}
//                   style={{ width: "100%", height: "auto" }}
//                 />
//                 <MDTypography variant="body1">
//                   {foodItem.description}
//                 </MDTypography>
//                 <MDTypography variant="body2">
//                   Employee Price: {foodItem.price_for_employee} | Guest Price:
//                   {foodItem.price_for_guest}
//                 </MDTypography>
//                 <MDBox display="flex" alignItems="center" mt={2}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={foodItem.is_drink === 1}
//                         color="primary"
//                         onChange={() => handleMenuSelect(foodItem.id)}
//                       />
//                     }
//                     label="Is Drink"
//                   />
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={foodItem.is_fasting}
//                         color="primary"
//                         onChange={() => handleMenuSelect(foodItem.id)}
//                       />
//                     }
//                     label="Is Fasting"
//                   />
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={foodItem.available && selectedAvailability}
//                         color="primary"
//                         onChange={() => handleMenuSelect(foodItem.id)}
//                       />
//                     }
//                     label="Available"
//                   />
//                 </MDBox>

//                 <Segment clearing basic>
//                   <MDButton
//                     variant="gradient"
//                     color="info"
//                     onClick={() => {
//                       handleUpdateMenu(foodItem);
//                     }}
//                     style={{ marginRight: "15px" }}
//                   >
//                     Update
//                   </MDButton>
//                   <MDButton
//                     variant="gradient"
//                     color="error"
//                     onClick={() => handleDeleteMenu(foodItem.id)}
//                     style={{ marginLeft: "30px" }}
//                   >
//                     Delete
//                   </MDButton>
//                 </Segment>
//               </MDBox>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     );
//   }

//   function renderEmployeeBody() {
//     if (employeeList.length === 0) {
//       return (
//         <Typography variant="h6" align="center">
//           No employee found
//         </Typography>
//       );
//     }
//     return (
//       <Card>
//         <CardContent>
//           <Typography variant="h5" component="div" gutterBottom>
//             Employee List
//           </Typography>
//           {employeeList.length === 0 ? (
//             <Typography variant="body1" color="textSecondary">
//               No employees found.
//             </Typography>
//           ) : (
//             <TableContainer>
//               <Table>
//                 <TableRow>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Department</TableCell>
//                   <TableCell>Position</TableCell>
//                   <TableCell>Email</TableCell>
//                   <TableCell>Action</TableCell>
//                 </TableRow>

//                 {employeeList.map((employee) => (
//                   <TableRow key={employee.id}>
//                     <TableCell>{employee.id}</TableCell>
//                     <TableCell>{employee.name}</TableCell>
//                     <TableCell>{employee.department}</TableCell>
//                     <TableCell>{employee.position}</TableCell>
//                     <TableCell>{employee.email}</TableCell>
//                     <TableCell>
//                       <IconButton onClick={(e) => handleMenuClick(employee, e)}>
//                         <Icon color="primary">add_circle</Icon>
//                       </IconButton>
//                       <Select
//                         value={selectedAction}
//                         onChange={(e) => setSelectedAction(e.target.value)}
//                         style={{ width: "100px" }}
//                       >
//                         <MenuItem value="add_to_buy_food">
//                           Add to Buy Food
//                         </MenuItem>
//                         <MenuItem value="add_to_employee_edit">
//                           Add to Employee Edit
//                         </MenuItem>
//                       </Select>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </Table>
//             </TableContainer>
//           )}
//         </CardContent>
//       </Card>
//     );
//   }
//   function renderOrderBody() {
//     if (foodMenu.length === 0) {
//       return (
//         <Typography variant="h6" align="center">
//           No order found
//         </Typography>
//       );
//     }
//   }
// }

// export default SearchMenu;
