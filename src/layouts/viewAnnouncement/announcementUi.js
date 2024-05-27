import React, { useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import { Segment } from "semantic-ui-react";
import { IMG_BASE_URL } from "../../appconfig";

function AnnouncementItemCard({ item, onDelete, userData }) {
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
          {item.title}
        </MDTypography>
        <MDTypography variant="h6" color="white">
          {item.category === "upcoming_events"
            ? "Upcoming events"
            : item.category === "registration"
            ? "Registration"
            : "Class Related"}
        </MDTypography>
      </MDBox>
      <MDBox pt={3} pb={3} px={2}>
        <img
          src={`${IMG_BASE_URL}${item.image_url}`}
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
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default AnnouncementItemCard;
