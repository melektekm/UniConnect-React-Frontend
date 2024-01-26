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

function MenuItemCard({ item, onEdit, onDelete, onSet, userData }) {
  const [isSetButtonVisible, setSetButtonVisible] = useState(false);
  const [availableAmount, setAvailableAmount] = useState(item.available_amount);
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;

  const handleInputChange = (event) => {
    setAvailableAmount(event.target.value);
    setSetButtonVisible(true);
  };

  const handleSetClick = () => {
    // Call the onSet function and pass the availableAmount
    onSet(item, availableAmount);
    setSetButtonVisible(false);
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
        <MDBox textAlign="center" mx={30} mt={-8} py={2}>
          <MDButton
            variant="contained"
            color={item.is_available ? "primary" : "error"}
            style={{
              marginRight: "15px",
              borderRadius: "50%",
              padding: "2em 2em",
              fontSize: "0.6em",
              cursor: "none",
            }}
          >
            {item.is_available ? "የሚገኝ" : "የማይገኝ"}
          </MDButton>
        </MDBox>
        <MDTypography variant="h4" color="white">
          {item.name}
        </MDTypography>
        <MDTypography variant="h6" color="white">
          {item.meal_type.toString() === "breakfast"
            ? "ቁርስ"
            : item.meal_type.toString() === "lunch"
            ? " ምሳ"
            : "መጠጥ"}
        </MDTypography>
      </MDBox>
      <MDBox pt={3} pb={3} px={2}>
        <img
          src={`data:image;base64,${item.image_data}`}
          alt={item.name}
          style={{ width: "100%", height: "200px" }}
        />
        <MDTypography variant="body1">{item.description}</MDTypography>
        <MDTypography variant="body2">
          የሰራተኛ ዋጋ: {item.price_for_employee} | የእንግዳ ዋጋ፡
          {item.price_for_guest}
        </MDTypography>
        <MDTypography variant="body2">
          {item.is_fasting === 1 ? "የጾም" : "የፍስክ"}
        </MDTypography>
        {userData.user.role === "dean" ? (
          <MDInput
            type="number"
            label="ያለው መጠን"
            value={availableAmount}
            onChange={handleInputChange}
          />
        ) : (
          <MDTypography variant="body2">
            {" "}
            ያለው መጠን : {availableAmount}{" "}
          </MDTypography>
        )}
        <MDBox textAlign="center" mb={2} mt={2}>
          {userData.user.role === "student" && (
            <Segment clearing basic>
              <MDButton
                color="primary"
                onClick={() => onEdit(item)}
                style={{ marginRight: "15px" }}
              >
                ቀይር
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
                ሰርዝ
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
                አድርግ
              </MDButton>
            )}
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default MenuItemCard;
