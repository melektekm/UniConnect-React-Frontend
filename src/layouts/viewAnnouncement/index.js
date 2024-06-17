import React, { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../appconfig";

import MDTypography from "../../components/MDTypography";
import AnnouncementItemCard from "./announcementUi";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import AdminSidenav from "../../examples/Sidenav/AdminSidenav";
import MainDashboard from "../../layouts/MainDashboard";
import Footer from "../../examples/Footer";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDButton from "../../components/MDButton";
import { Pagination } from "@mui/material";
import StudentSidenav from "../../examples/Sidenav/StudentSidenav";

function ViewAnnouncement() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [announcement, setAnnouncement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncementType, setSelectedAnnouncementType] =
    useState("all");
  const itemsPerPage = 20;
  const [current_page, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [modalOpen, setModalOpen] = useState(false);

  // Function to fetch announcement data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/announcement-items-no-filter`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data) {
        setAnnouncement(response.data.data);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data on component mount or when page/type changes
  useEffect(() => {
    fetchData();
  }, [current_page, selectedAnnouncementType]);

  // Function to handle deleting an announcement
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/announcement-items/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAnnouncement(announcement.filter((item) => item.id !== id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  // Function to handle opening the delete confirmation dialog
  const handleDeleteDialogOpen = (id) => {
    const announcementItem = announcement.find((item) => item.id === id);
    setItemToDelete(announcementItem);
    setDeleteDialogOpen(true);
  };

  // Function to handle closing the delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  // Function to handle opening the view modal
  const handleModalOpen = (announcementItem) => {
    setSelectedAnnouncement(announcementItem);
    setModalOpen(true);
  };

  // Function to handle closing the view modal
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // Function to handle page changes in pagination
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Function to handle viewing the announcement file
  const handleViewFile = async (announcementId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/getannouncementcontent/${announcementId}`,
        {
          responseType: "blob",
        }
      );

      const fileContent = response.data;
      const fileURL = URL.createObjectURL(
        new Blob([fileContent], { type: "application/pdf" })
      );

      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${selectedAnnouncement.title}</title>
            </head>
            <body>
              <embed width="100%" height="100%" src="${fileURL}" type="application/pdf">
              <a href="${fileURL}" download="${selectedAnnouncement.title}.pdf">
                <button>Download</button>
              </a>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        console.error("Failed to open new window");
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  // Function to handle editing an announcement

  // Function to filter announcements based on selected type
  const getFilteredAndSlicedMenuItems = () => {
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
  };

  return (
    <DashboardLayout>
      <Grid container spacing={2}>
        <StudentSidenav />
        <DashboardNavbar />

        {getFilteredAndSlicedMenuItems().map((item) => (
          <Grid item xs={12} key={item.id}>
            <AnnouncementItemCard
              item={item}
              onDelete={handleDeleteDialogOpen}
              onViewFile={() => handleViewFile(item.id)} // Pass announcement id to handleViewFile
            />
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
}

export default ViewAnnouncement;
