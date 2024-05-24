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
import AnnouncementItemCard from "./announcementUi";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CoordinatorDashboard from "../CoordinatorDashboard";
import menuItem from "../../examples/Items/NotificationItem/styles";
import StudentDashboard from "../StudentDashboard";
import StudentNavBar from "../../examples/Navbars/StudentNavBar";
import DeanSidenav from "../../examples/Sidenav/DeanSidenav";
import DeanNavBar from "../../examples/Navbars/DeanNavBar";
import StudentSidenav from "../../examples/Sidenav/StudentSidenav";
import InstructorSidenav from "../../examples/Sidenav/InstructorSidenav";
import CoordinatorSidenav from "../../examples/Sidenav/CoordinatorSidenav";
import CircularProgress from "@mui/material/CircularProgress";
import MDTypography from "../../components/MDTypography";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
function ViewAnnouncement() {
  const [announcement, setAnnouncement] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedAnnouncementType, setSelectedAnnouncementType] =
    useState("all");
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

    if (selectedAnnouncementType === "registration") {
      filteredItems = announcement.filter(
        (item) => item.category === "registration"
      );
    } else if (selectedAnnouncementType === "upcoming_events") {
      filteredItems = announcement.filter(
        (item) => item.category === "upcoming_events"
      );
    } else if (selectedAnnouncementType === "class_related") {
      filteredItems = announcement.filter(
        (item) => item.category === "class_related"
      );
    } else if (selectedAnnouncementType === "all") {
      filteredItems = announcement;
    }

    return filteredItems;
  }

  useEffect(() => {
    fetchData();
  }, [current_page, selectedAnnouncementType]);

  const fetchData = async () => {
    setLoading(true);

    try {
      let apiUrl = `${BASE_URL}/announcement-items-no-filter?page=${current_page}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data) {
        setAnnouncement(response.data.data);

        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
        // Set the total number of pages
      } else {
      }
    } catch (error) {}
    setLoading(false);
  };
  function handleUpdateAnnouncement(updatedAnnouncement) {
    if (!selectedAnnouncement) {
      setAnnouncement([...announcement, updatedAnnouncement]);
    } else {
      setAnnouncement(
        announcement.map((menu) =>
          menu.id === updatedAnnouncement.id ? updatedAnnouncement : menu
        )
      );
      setSelectedAnnouncement(null);
    }
    navigate("/announcements", {
      state: { selectedAnnouncement: updatedAnnouncement },
    });
  }

  function handleDeleteDialogOpen(menuId) {
    const announcementItem = announcement.find(
      (announcementItem) => announcementItem.id === menuId
    );
    setItemToDelete(announcementItem);
    setDeleteDialogOpen(true);
  }
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  const HandleDelete = async (menuId) => {
    try {
      await axios.delete(`${BASE_URL}/announcement-items/${menuId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setAnnouncement(announcement.filter((item) => item.id !== menuId));
      setDeleteDialogOpen(false);
    } catch (error) {}
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      {/* {userData.user.role == "student" ? (
        <StudentNavBar />
      ) : userData.user.role == "cafeManager_admin" ? (
        <DeanNavBar />
      ) : ( */}
      <DashboardNavbar />
      {/* )} */}
      {/* {userData.user.role == "student" ? (
        <StudentSidenav
          color="dark"
          brand=""
          brandName="የኮሚቴ ክፍል መተግበሪያ"
        />
      ) : userData.user.role == "cafeManager_admin" ? (
        <DeanSidenav
          color="dark"
          brand=""
          brandName="የምግብ ዝግጅት ክፍል መተግበሪያ"
        />
      ) : (
        <CoordinatorSidenav
          color="dark"
          brand=""
          brandName="የገንዘብ ተቀባይ ክፍል መተግበሪያ"
        />
      )} */}
      <Sidenav />
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
          variant={
            selectedAnnouncementType === "all" ? "contained" : "outlined"
          }
          onClick={() => setSelectedMenuType("all")}
        >
          all
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={
            selectedAnnouncementType === "class_related"
              ? "contained"
              : "outlined"
          }
          onClick={() => setSelectedAnnouncementType("class_related")}
        >
          Class Related
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={
            selectedAnnouncementType === "upcoming_events"
              ? "contained"
              : "outlined"
          }
          onClick={() => setSelectedAnnouncementType("upcoming_events")}
        >
          Upcoming Events
        </MDButton>
        <MDButton
          style={{ marginRight: "30px" }}
          variant={
            selectedAnnouncementType === "registration"
              ? "contained"
              : "outlined"
          }
          onClick={() => setSelectedAnnouncementType("registration")}
        >
          Registrar
        </MDButton>
      </MDBox>
      <MDBox py={3}>
        {loading ? (
          <MDBox textAlign="center">
            <CircularProgress color="info" />
            <MDTypography sx={{ fontSize: "0.7em" }}>
              processing ....
            </MDTypography>
          </MDBox>
        ) : (
          // Render the loading spinner while loading is true
          <Grid container spacing={6}>
            {getFilteredAndSlicedMenuItems().map((announcementItem) => (
              <Grid item xs={12} sm={6} md={4} key={announcementItem.id}>
                <AnnouncementItemCard
                  item={announcementItem}
                  //   onEdit={handleUpdateMenu}
                  onDelete={handleDeleteDialogOpen}
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
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          {itemToDelete && (
            <p>
              Are you sure you want to delete this{" "}
              <strong>"{itemToDelete.name}"</strong>?
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancle</Button>
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

export default ViewAnnouncement;
