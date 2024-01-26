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
import menuItem from "../../examples/Items/NotificationItem/styles";
import CafeCommetteDashboard from "../CafeCommetteDashboard";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import CafeManagerSidenav from "../../examples/Sidenav/CafeManagerSidenav";
import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
import CafeCommetteeSidenav from "../../examples/Sidenav/CafeCommeteeSidenav";
import storeKeeperSidenav from "../../examples/Sidenav/storeKeeperSidenav";
import CashierSidenav from "../../examples/Sidenav/CashierSidenav";
import CircularProgress from "@mui/material/CircularProgress";
import MDTypography from "../../components/MDTypography";

function FoodMenu() {
  const [foodMenu, setFoodMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenuType, setSelectedMenuType] = useState("all");
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  // Pagination state
  const itemsPerPage = 20; // Set the number of items to display per page
  const [current_page, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const accessToken = userData.accessToken;
  const [loading, setLoading] = useState(true);
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
    } else if (selectedMenuType === "drink") {
      // Filter lunch menu items
      filteredItems = foodMenu.filter((item) => item.is_drink === 1);
    } else if (selectedMenuType === "available") {
      // Filter lunch menu items
      filteredItems = foodMenu.filter((item) => item.is_available === 1);
    } else if (selectedMenuType === "not_available") {
      // Filter lunch menu items
      filteredItems = foodMenu.filter((item) => item.is_available === 0);
    } else if (selectedMenuType === "all") {
      // Show all menu items
      filteredItems = foodMenu;
    }

    return filteredItems;
  }

  useEffect(() => {
    fetchData();
  }, [current_page, selectedMenuType]);

  const fetchData = async () => {
    setLoading(true);

    try {
      let apiUrl = `${BASE_URL}/menu-items-no-filter?page=${current_page}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data) {
        setFoodMenu(response.data.data);

        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
        // Set the total number of pages
      } else {
      }
    } catch (error) {}
    setLoading(false);
  };
  function handleUpdateMenu(updatedMenu) {
    if (!selectedMenu) {
      setFoodMenu([...foodMenu, updatedMenu]);
    } else {
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
    } catch (error) {}
  };

  const onSet = async (updatedMenuItem, availableAmount) => {
    try {
      // Send a request to update the menu item's available amount in the database
      await axios.post(
        `${BASE_URL}/update-available-amount/${updatedMenuItem.id}`,
        { available_amount: availableAmount.toString() },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update the state to reflect the changes
      const updatedFoodMenu = foodMenu.map((menuItem) => {
        if (menuItem.id === updatedMenuItem.id) {
          if (availableAmount > 0) {
            menuItem.is_available = 1;
          } else {
            menuItem.is_available = 0;
          }
          menuItem.available_amount = availableAmount.toString();
        }
        return menuItem;
      });

      setFoodMenu(updatedFoodMenu);
    } catch (error) {}
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      {userData.user.role == "student" ? (
        <NavbarForCommette />
      ) : userData.user.role == "dean" ? (
        <CafeManagerDashboardNavbar />
      ) : (
        <DashboardNavbar />
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
        <CashierSidenav
          color="dark"
          brand=""
          brandName="የገንዘብ ተቀባይ ክፍል መተግበሪያ"
        />
      )}

      <MDBox
        mx={2}
        mt={1}
        mb={2}
        py={3}
        px={2}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="info"
        textAlign="center"
      >
        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "all" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("all")}
        >
          ሁሉም
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "breakfast" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("breakfast")}
        >
          ቁርስ
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "lunch" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("lunch")}
        >
          ምሳ
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "fasting" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("fasting")}
        >
          የጾም
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "nonfasting" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("nonfasting")}
        >
          የፍስክ
        </MDButton>

        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "drink" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("drink")}
        >
          መጠጦች
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={selectedMenuType === "available" ? "contained" : "outlined"}
          onClick={() => setSelectedMenuType("available")}
        >
          የሚገኙ የሜኑ አይነቶች
        </MDButton>
      </MDBox>
      <MDBox py={3}>
        {loading ? (
          <MDBox textAlign="center">
            <CircularProgress color="info" />
            <MDTypography sx={{ fontSize: "0.7em" }}>በሒደት ላይ ....</MDTypography>
          </MDBox>
        ) : (
          // Render the loading spinner while loading is true
          <Grid container spacing={6}>
            {getFilteredAndSlicedMenuItems().map((foodItem) => (
              <Grid item xs={12} sm={6} md={4} key={foodItem.id}>
                <MenuItemCard
                  item={foodItem}
                  onEdit={handleUpdateMenu}
                  onDelete={handleDeleteDialogOpen}
                  onSet={onSet}
                  userData={userData}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </MDBox>

      <Pagination
        component={Link}
        a
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
        <DialogTitle>ስረዛን ያረጋግጡ</DialogTitle>
        <DialogContent>
          {itemToDelete && (
            <p>
              እርግጠኛ ነዎት የምግብ ንጥሉን መሰረዝ ይፈልጋሉ{" "}
              <strong>"{itemToDelete.name}"</strong>?
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>አይ</Button>
          <Button
            onClick={() => HandleDelete(itemToDelete ? itemToDelete.id : null)}
          >
            ሰርዝ
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default FoodMenu;
