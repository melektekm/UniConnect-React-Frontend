// import React, { useState, useEffect } from "react";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import Grid from "@mui/material/Grid";
// import MDBox from "../../../components/MDBox";
// import MDButton from "../../../components/MDButton";
// import { Pagination } from "@mui/material";
// import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
// import Footer from "../../../examples/Footer";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import Typography from "@mui/material/Typography";
// import { Select, MenuItem } from "@mui/material";
// import StudentNavBar from "../../../examples/Navbars/StudentNavBar";
// import MDInput from "../../../components/MDInput";
// import Icon from "@mui/material/Icon";
// import { Segment } from "semantic-ui-react";
// import { BASE_URL } from "../../../appconfig";
// import MenuItemCard from "../../foodMenu/MenuItemCard";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import Button from "@mui/material/Button";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import CoordinatorDashboard from "../../CoordinatorDashboard";
// import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
// import DeanNavBar from "../../../examples/Navbars/DeanNavBar";
// import DeanSidenav from "../../../examples/Sidenav/DeanSidenav";
// import MDTypography from "../../../components/MDTypography";
// import CircularProgress from "@mui/material/CircularProgress";

// function SearchMenuForInvnetory() {
//   const [searchType, setSearchType] = useState("menuitem");
//   const location = useLocation();
//   const { pathname } = location;
//   const [foodMenu, setFoodMenu] = useState([]);
//   const [selectedMenu, setSelectedMenu] = useState(null);
//   const [selectedMenuType, setSelectedMenuType] = useState("all");
//   const electron = window.require("electron");
//   const ipcRenderer = electron.ipcRenderer;
//   const userData = ipcRenderer.sendSync("get-user");
//   const navigate = useNavigate();
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);
//   // Pagination state
//   const itemsPerPage = 20; // Set the number of items to display per page
//   const [current_page, setCurrentPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const accessToken = userData.accessToken;
//   const [loading, setLoading] = useState(false);
//   const [isSearched, setIsSearched] = useState(false);

//   function getFilteredAndSlicedMenuItems() {
//     // Filter the menu items based on the selected menu type
//     let filteredItems = [];

//     if (selectedMenuType === "fasting") {
//       // Filter fasting menu items
//       filteredItems = foodMenu.filter((item) => item.is_fasting === 1);
//     } else if (selectedMenuType === "nonfasting") {
//       // Filter non-fasting menu items
//       filteredItems = foodMenu.filter((item) => item.is_fasting === 0);
//     } else if (selectedMenuType === "breakfast") {
//       // Filter breakfast menu items
//       filteredItems = foodMenu.filter((item) => item.meal_type === "breakfast");
//     } else if (selectedMenuType === "lunch") {
//       // Filter lunch menu items
//       filteredItems = foodMenu.filter((item) => item.meal_type === "lunch");
//     } else if (selectedMenuType === "drink") {
//       // Filter lunch menu items
//       filteredItems = foodMenu.filter((item) => item.is_drink === 1);
//     } else if (selectedMenuType === "all") {
//       // Show all menu items
//       filteredItems = foodMenu;
//     }

//     // Slice the filtered menu items based on the current page
//     // const startIndex = (current_page - 1) * itemsPerPage;
//     // const endIndex = startIndex + itemsPerPage;
//     // const slicedItems = filteredItems.slice(startIndex, endIndex);

//     return filteredItems;
//   }

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

//   const [searchInput, setSearchInput] = useState("");

//   const handleSearch = async () => {
//     setLoading(true);
//     if (searchType === "menuitem") {
//       try {
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
//         } else {
//         }
//       } catch (error) {}
//     }
//     setIsSearched(true);

//     setLoading(false);
//   };
//   function handleUpdateMenu(updatedMenu) {
//     if (!selectedMenu) {
//       // If selectedMenu is null, user is adding a new item
//       // Add the new item to the menu
//       setFoodMenu([...foodMenu, updatedMenu]);
//     } else {
//       // If selectedMenu is not null, user is updating an existing item
//       // Update the menu item and set selectedMenu to the updated menu
//       setFoodMenu(
//         foodMenu.map((menu) =>
//           menu.id === updatedMenu.id ? updatedMenu : menu
//         )
//       );
//       setSelectedMenu(null);
//     }
//     navigate("/addFood", { state: { selectedMenu: updatedMenu } });
//   }
//   function handleDeleteDialogOpen(menuId) {
//     const menuItem = foodMenu.find((menuItem) => menuItem.id === menuId);
//     setItemToDelete(menuItem);
//     setDeleteDialogOpen(true);
//   }
//   const handleDeleteDialogClose = () => {
//     setDeleteDialogOpen(false);
//   };
//   const HandleDelete = async (menuId) => {
//     try {
//       await axios.delete(`${BASE_URL}/menu-items/${menuId}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       // Update the local state to remove the deleted menu item
//       setFoodMenu(foodMenu.filter((item) => item.id !== menuId));
//       setDeleteDialogOpen(false);
//     } catch (error) {}
//   };
//   const onSet = async (updatedMenuItem, availableAmount) => {
//     try {
//       // Send a request to update the menu item's available amount in the database
//       await axios.post(
//         `${BASE_URL}/update-available-amount/${updatedMenuItem.id}`,
//         { available_amount: availableAmount.toString() },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       // Update the state to reflect the changes
//       const updatedFoodMenu = foodMenu.map((menuItem) => {
//         if (menuItem.id === updatedMenuItem.id) {
//           menuItem.available_amount = availableAmount.toString();
//         }
//         return menuItem;
//       });

//       setFoodMenu(updatedFoodMenu);
//     } catch (error) {}
//   };
//   const handlePageChange = (event, page) => {
//     setCurrentPage(page); // Update the current page when the user clicks a new page
//   };

//   const handleSearchInputChange = (e) => {
//     setSearchType(e.target.value);
//     setIsSearched(false);
//   };

//   return (
//     <DashboardLayout>
//       {/* <DeanNavBar />
//        <DeanSidenav
//       color="dark"
//       brand=""
//       brandName="የምግብ ዝግጅት ክፍል መተግበሪያ"
//        />  */}
//       <DashboardNavbar />
//       <Sidenav />
//       <MDBox
//         mx={2}
//         mt={1}
//         mb={2}
//         py={3}
//         px={2}
//         variant="gradient"
//         bgColor="dark"
//         borderRadius="lg"
//         coloredShadow="info"
//         textAlign="center"
//         style={{ display: "flex", gap: "10px" }}
//       >
//         <MDBox
//           bgColor="white"
//           style={{
//             marginRight: "20px",
//             marginLeft: "100px",
//             width: "300px",
//             display: "flex", // Ensure flex display to align items vertically
//             alignItems: "center", // Center items vertically
//             border: "1px solid #ccc", // Add a border for consistent appearance
//             borderRadius: "4px", // Apply border radius to match the input field
//             padding: "8px", // Add padding for better spacing
//           }}
//         >
//           <MDInput
//             placeholder=" እዚህ ይጻፉ..."
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             style={{
//               width: "100%",
//               border: "none", // Remove border from input field to match the container
//               outline: "none", // Remove outline on focus for better appearance
//             }}
//           />
//         </MDBox>

//         {loading ? (
//           <MDBox textAlign="center">
//             <CircularProgress color="white" />
//           </MDBox>
//         ) : (
//           <MDButton
//             variant="contained"
//             onClick={handleSearch}
//             color="primary"
//             style={{ borderRadius: "10%", marginTop: "10px" }}
//           >
//             ፈልግ
//           </MDButton>
//         )}
//         <Select
//           value={searchType}
//           onChange={handleSearchInputChange}
//           style={{
//             borderRadius: "10%",
//             marginRight: "10px",
//             width: "100px",
//             height: "50px",
//             color: "white",
//             marginTop: "10px",
//           }}
//         >
//           <MenuItem value="menuitem">
//             <h4 style={{ color: "#000000" }}>ሜኑ እቃ</h4>{" "}
//           </MenuItem>
//         </Select>
//       </MDBox>
//       <MDBox py={3}>{searchType === "menuitem" && renderFoodMenu()}</MDBox>

//       <Footer />
//     </DashboardLayout>
//   );

//   function renderFoodMenu() {
//     if (foodMenu.length === 0) {
//       if (!isSearched) {
//         return;
//       }

//       return (
//         <Typography variant="h6" align="center">
//           ምንም ሜኑ አልተገኘም።
//         </Typography>
//       );
//     }

//     return (
//       <>
//         <MDBox py={3}>
//           <Grid container spacing={6}>
//             {getFilteredAndSlicedMenuItems().map((foodItem) => (
//               <Grid item xs={12} sm={6} md={4} key={foodItem.id}>
//                 <MenuItemCard
//                   item={foodItem}
//                   onEdit={handleUpdateMenu}
//                   onDelete={handleDeleteDialogOpen}
//                   onSet={onSet}
//                   userData={userData}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         </MDBox>

//         <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
//           <DialogTitle>ስረዛን ያረጋግጡ</DialogTitle>
//           <DialogContent>
//             {itemToDelete && (
//               <p>
//                 እርግጠኛ ነዎት የምግብ ንጥሉን መሰረዝ ይፈልጋሉ{" "}
//                 <strong>"{itemToDelete.name}"</strong>?
//               </p>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleDeleteDialogClose}>አይ</Button>
//             <Button
//               onClick={() =>
//                 HandleDelete(itemToDelete ? itemToDelete.id : null)
//               }
//             >
//               ሰርዝ
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </>
//     );
//   }
// }

// export default SearchMenuForInvnetory;
