import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Segment } from "semantic-ui-react";
import { BASE_URL } from "../../appconfig";
import { Pagination } from "@mui/material";
import MenuItemCard from "./MenuItemCard";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CashierDashboard from "../CashierDashboard";

function FoodMenu() {
  const [foodMenu, setFoodMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenuType, setSelectedMenuType] = useState("all");
  const electron = window.require('electron');
  const ipcRenderer  = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync('get-user');
  const navigate = useNavigate();
  const [deleteDialogOpen , setDeleteDialogOpen] = useState(false)
  const [itemToDelete , setItemToDelete] = useState(null)
  // Pagination state
  const itemsPerPage = 20; // Set the number of items to display per page
  const [current_page, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1); 
  const accessToken = userData.accessToken
  

  function getFilteredAndSlicedMenuItems() {
    // Filter the menu items based on the selected menu type
    let filteredItems = [];
  
    if (selectedMenuType === "fasting") {
      // Filter fasting menu items
      filteredItems = foodMenu.filter((item) => item.is_fasting === 1);
    } else if (selectedMenuType === "nonfasting") {
      // Filter non-fasting menu items
      filteredItems = foodMenu.filter((item) => item.is_fasting === 0);
    } else if (selectedMenuType === "breakfast") {
      // Filter breakfast menu items
      filteredItems = foodMenu.filter((item) => item.meal_type === "breakfast");
    } else if (selectedMenuType === "lunch") {
      // Filter lunch menu items
      filteredItems = foodMenu.filter((item) => item.meal_type === "lunch");
    }else if (selectedMenuType === "drink") {
      // Filter lunch menu items
      filteredItems = foodMenu.filter((item) => item.is_drink === 1);
    }
     else if (selectedMenuType === "all") {
      // Show all menu items
      filteredItems = foodMenu;
    }
  
    // Slice the filtered menu items based on the current page
    // const startIndex = (current_page - 1) * itemsPerPage;
    // const endIndex = startIndex + itemsPerPage;
    // const slicedItems = filteredItems.slice(startIndex, endIndex);
  
    return filteredItems;
  }

  useEffect(() => {
    fetchData();
  }, [current_page, selectedMenuType]);

  const fetchData = async () => {
    try {
      let apiUrl = `${BASE_URL}/menu-items-no-filter?page=${current_page}`;
  
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.data) {
        setFoodMenu(response.data.data); // Set menu items
        setCurrentPage(response.data.current_page);
        console.log(response.data.current_page)
        setLastPage(response.data.last_page); // Set the total number of pages
      } else {
        console.log("Empty response");
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    }
  };
  function handleUpdateMenu(updatedMenu) {
    if (!selectedMenu) {
      // If selectedMenu is null, user is adding a new item
      // Add the new item to the menu
      setFoodMenu([...foodMenu, updatedMenu]);
    } else {
      // If selectedMenu is not null, user is updating an existing item
      // Update the menu item and set selectedMenu to the updated menu
      setFoodMenu(
        foodMenu.map((menu) =>
          menu.id === updatedMenu.id ? updatedMenu : menu
        )
      );
      setSelectedMenu(null);
    }
    navigate("/addFood", { state: { selectedMenu: updatedMenu } });
  }

  function handleDeleteDialogOpen(menuId) {
    const menuItem = foodMenu.find((menuItem) => menuItem.id === menuId);
    setItemToDelete(menuItem);
    setDeleteDialogOpen(true);
  }
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  const HandleDelete = async (menuId) => {
    try {
      await axios.delete(`${BASE_URL}/menu-items/${menuId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Update the local state to remove the deleted menu item
      setFoodMenu(foodMenu.filter((item) => item.id !== menuId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const toggleAvailability = async (menuId) => {
    console.log('Toggle availability clicked for menu item with ID:', menuId);
    try {
      const updatedFoodMenu = foodMenu.map((menuItem) => {
        if (menuItem.id === menuId) {
          // Toggle the availability attribute and convert it to a string
          menuItem.is_available = !menuItem.is_available;
          const isAvailableString = menuItem.is_available ? 1 : 0;
           
          // Send a request to update the menu item's availability in the database
          axios.post(
            `${BASE_URL}/update-avail-menu-items/${menuId}`,
            { is_available: isAvailableString }, // Send as a string
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        }
        return menuItem;
      });
  
      // Update the state to reflect the changes
      setFoodMenu(updatedFoodMenu);
    } catch (error) {
      console.error("Failed to toggle menu item availability:", error);
      // Handle error and show appropriate feedback to the user
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page); // Update the current page when the user clicks a new page
  };
  

  return (
    <DashboardLayout>
      {userData.user.role == 'cashier' ? <DashboardNavbar /> : <NavbarForCommette /> }
      <CashierDashboard />
      <MDBox
        mx={2}
        mt={1}
        mb={2}
        py={3}
        px={2}
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
        textAlign="center"
      >
        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "all" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("all")}
        >
          All
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "breakfast" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("breakfast")}
        >
          Breakfast
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "lunch" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("lunch")}
        >
          Lunch
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "fasting" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("fasting")}
        >
          Fasting
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "nonfasting" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("nonfasting")}
        >
          Non-Fasting
        </MDButton>

        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "drink" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("drink")}
        >
         Drinks
        </MDButton>
      </MDBox>
      <MDBox py={3}>
        <Grid container spacing={6}>
          {getFilteredAndSlicedMenuItems().map((foodItem) => (
            <Grid item xs={12} sm={6} md={4} key={foodItem.id}>
              <MenuItemCard
                item={foodItem}
                onEdit={handleUpdateMenu}
                onDelete={handleDeleteDialogOpen}
                onToggleAvailability={toggleAvailability}
              />
            </Grid>
          ))}
        </Grid>
      </MDBox>

      <Pagination
  component={Link}
  count={lastPage}
  page={current_page}
  variant="outlined"
  shape="rounded"
  onChange={handlePageChange} // Handle page changes
  sx={{
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  }}
  color="primary"
/>

      <Footer />
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          {itemToDelete && (
            <p>
              Are you sure you want to delete the menu item{" "}
              <strong>"{itemToDelete.name}"</strong>?
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button
            onClick={() => HandleDelete(itemToDelete ? itemToDelete.id : null)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default FoodMenu;
