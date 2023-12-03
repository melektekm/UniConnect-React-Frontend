import { BASE_URL } from "../../appconfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import CashierDashboard from "../CashierDashboard";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import FoodItemForm from "./FoodItemForm";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const AddMenuItem = () => {
  const location = useLocation();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const selectedMenu = location.state?.selectedMenu ?? null;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const accessToken = userData.accessToken

  

  const initialFormValues = {
    name: "",
    description: "",
    price_for_employee: "",
    price_for_guest: "",
    meal_type: "lunch",
    is_fasting: false,
    is_drink: false,
    is_available: false,
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  useEffect(() => {
    if (selectedMenu) {
      setFormValues({
        name: selectedMenu.name,
        description: selectedMenu.description,
        price_for_employee: selectedMenu.price_for_employee,
        price_for_guest: selectedMenu.price_for_guest,
        meal_type: selectedMenu.meal_type,
        is_fasting: selectedMenu.is_fasting,
        is_drink: selectedMenu.is_drink,
        is_available: selectedMenu.is_available,
      });
    }
  }, [selectedMenu]);

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFormValues({ ...formValues, image: selectedFile });
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleAddToMenu = async () => {
   const newErrorMessages = {
  name: formValues.name ? "" : (
    <span style={{ fontSize: "14px", color: "red" }}>
      Food Item Name is required.
    </span>
  ),
  description: formValues.description ? "" : (
    <span style={{ fontSize: "14px", color: "red" }}>
      Description is required.
    </span>
  ),
  price_for_employee: formValues.price_for_employee ? "" : (
    <span style={{ fontSize: "14px", color: "red" }}>
      Price for Employee is required.
    </span>
  ),
  price_for_guest: formValues.price_for_guest ? "" : (
    <span style={{ fontSize: "14px", color: "red" }}>
      Price for Guest is required.
    </span>
  ),
};

    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("All fields should be filled.");
      setDialogOpen(true);
      return;
    }

    setLoading(true);
    try {
      let response;
      const formData = new FormData();
      if (formValues.image) {
        formData.append("image", formValues.image);
      }
      formData.append("name", formValues.name.toString());
      formData.append("description", formValues.description.toString());
      formData.append(
        "price_for_employee",
        parseFloat(formValues.price_for_employee)
      );
      formData.append(
        "price_for_guest",
        parseFloat(formValues.price_for_guest)
      );
      formData.append("meal_type", formValues.meal_type.toString());
      formData.append("is_fasting", formValues.is_fasting ? "1" : "0");
      formData.append("is_drink", formValues.is_drink ? "1" : "0");
      formData.append("is_available", formValues.is_available ? "1" : "0");

      if (selectedMenu) {
        response = await axios.post(
          `${BASE_URL}/update-menu-items/${selectedMenu.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(`${BASE_URL}/menu-items`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Menu item added/updated successfully
      document.getElementById("imageUpload").value = "";

      // Clear and reset the form fields
      setFormValues(initialFormValues);
      setErrorMessages({});
      setSuccessMessage(`${selectedMenu ? "Update Menu" : "Add to Menu"} item successfully!`);
      setDialogOpen(true);
    } catch (error) {
      if (error.response && error.response.data) {
        // Parse the error messages from the server's response
        const serverErrorMessages = error.response.data.errors;
        let errorMessage = "Menu item registration failed: ";

        for (const [key, value] of Object.entries(serverErrorMessages)) {
          errorMessage += `${key}: ${value[0]}, `;
        }

        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("Menu item registration failed: " + error);
      }
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
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
        <MDTypography variant="h6" color="white">
        {selectedMenu ? "Update Menu" : "Add to Menu"}
        </MDTypography>
      </MDBox>
      <FoodItemForm
        values={formValues}
        errorMessages={errorMessages}
        loading={loading}
        handleImageUpload={handleImageUpload}
        inputHandler={inputHandler}
        handleAddToMenu={handleAddToMenu}
        selectedMenu={selectedMenu}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {successMessage ? "Confirmation" : "Notification"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {successMessage || errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default AddMenuItem;
