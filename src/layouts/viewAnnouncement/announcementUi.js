import React, { useState } from "react";

import "react-confirm-alert/src/react-confirm-alert.css";

import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

import { Segment } from "semantic-ui-react";
import { IMG_BASE_URL } from "../../appconfig";
import MDInput from "../../components/MDInput";
import colors from "../../assets/theme/base/colors";

function AnnouncementItemCard({ item, onDelete, userData }) {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;

  const handleInputChange = (event) => {
    set(event.target.value);
    setSetButtonVisible(true);
  };

  return (
    <Card style={{ marginTop: "15px" }}>
      <MDBox
        mx={2}
        mt={-3}
        py={3}
        px={2}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="info"
      >
        <MDTypography variant="h4" color="white">
          {item.tite}
        </MDTypography>
        <MDTypography variant="h6" color="white">
          {item.category.toString() === "upcoming_events"
            ? "Upcoming events"
            : item.category.toString() === "registration"
            ? " registration"
            : "class related"}
        </MDTypography>
      </MDBox>
      <MDBox pt={3} pb={3} px={2}>
        <img
          src={`${IMG_BASE_URL}${item.image_url.toString()}`}
          alt={item.name}
          style={{ width: "100%", height: "200px" }}
        />
        <MDTypography variant="body1">{item.content}</MDTypography>
        <MDTypography variant="body2">{item.date}</MDTypography>
        <MDTypography variant="body2">{item.category}</MDTypography>

        <MDBox textAlign="center" mb={2} mt={2}>
          {userData.user.role === "student" && (
            <Segment clearing basic>
              <MDButton
                color="primary"
                onClick={() => onEdit(item)}
                style={{ marginRight: "15px" }}
              >
                Edit
              </MDButton>
              <MDButton
                variant="gradient"
                color="error"
                onClick={() => onDelete(item.id)}
                style={{
                  marginLeft: "30px",

                  color: "white",
                }}
              >
                Delete
              </MDButton>
            </Segment>
          )}
          <MDBox mt={2} display="flex" gap="10px">
            {isSetButtonVisible && (
              <MDButton
                onClick={handleSetClick}
                variant="contained"
                color="info"
              >
                OK
              </MDButton>
            )}
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default AnnouncementItemCard;
