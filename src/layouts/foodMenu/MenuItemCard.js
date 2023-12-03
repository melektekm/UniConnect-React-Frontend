import React from "react";

import "react-confirm-alert/src/react-confirm-alert.css";

import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

import { Segment } from "semantic-ui-react";
import { IMG_BASE_URL } from "../../appconfig";
const primaryColor = "#425B58"; // Your primary color
const secondaryColor = "#FFC2A0"; // Your secondary color
// Create a common card component for menu and drink items
function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }) {
  return (
    <Card>
      <MDBox
        mx={2}
        mt={-3}
        py={3}
        px={2}
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
      >
        <MDTypography variant="h4" color="white">
          {item.name}
        </MDTypography>
        <MDTypography variant="h6" color="white">
          {item.meal_type || item.drink_type}
        </MDTypography>
      </MDBox>
      <MDBox pt={3} pb={3} px={2}>
        <img
          src={`${IMG_BASE_URL}${item.image_url.toString()}`}
          alt={item.name}
          style={{ width: "100%", height: "auto" }}
        />
        <MDTypography variant="body1">{item.description}</MDTypography>
        <MDTypography variant="body2">
          Employee Price: {item.price_for_employee} | Guest Price:
          {item.price_for_guest}
        </MDTypography>
        <MDTypography variant="body2">
          {item.is_fasting === 1 ? "Fasting" : "Non-Fasting"}
        </MDTypography>
        <MDBox textAlign="center" mb={2} mt={2}>
        <MDBox textAlign="center" mb={2} mt={2}>
          <MDButton
            variant="gradient"
            color={item.is_available ? "info" : "error"}
            onClick={() => onToggleAvailability(item.id)}
            style={{ marginRight: "15px" }}
          >
            {item.is_available ? "Available" : "Not Available"}
          </MDButton>
        </MDBox>
        <Segment clearing basic>
          <MDButton
            variant="gradient"
            color="info"
            onClick={() => onEdit(item)}
            style={{ marginRight: "15px" }}
          >
            Update
          </MDButton>
          <MDButton
            variant="gradient"
            onClick={() => onDelete(item.id)}
            style={{
              marginLeft: "30px",
              backgroundColor: "#F44336",
              color: "white",
            }}
          >
            Delete
          </MDButton>
        </Segment>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default MenuItemCard;
