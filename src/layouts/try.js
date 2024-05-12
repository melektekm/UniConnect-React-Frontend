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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import FoodItemForm from "./FoodItemForm";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
import CafeManagerSidenav from "../../examples/Sidenav/CafeManagerSidenav";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import CafeCommetteeSidenav from "../../examples/Sidenav/CafeCommeteeSidenav";
import CashierSidenav from "../../examples/Sidenav/CashierSidenav";

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
  const accessToken = userData.accessToken;

  const initialFormValues = {
    name: "",
    description: "",
    price_for_employee: "",
    price_for_guest: "",
    meal_type: "lunch",
    is_fasting: true,
    is_drink: false,
    is_available: false,
    available_amount: 0,
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
        available_amount: selectedMenu.available_amount,
      });
    }
  }, [selectedMenu]);

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFormValues({ ...formValues, image: selectedFile });
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;

    const finalValue = name === "is_fasting" ? value === "1" : value;

    setFormValues({ ...formValues, [name]: finalValue });
  };

  const handleAddToMenu = async () => {
    const newErrorMessages = {
      name: formValues.name ? (
        ""
      ) : (
        <span style={{ fontSize: "14px", color: "red" }}>
          የምግብ ዕቃ ስም ያስፈልጋል።
        </span>
      ),
      description: formValues.description ? (
        ""
      ) : (
        <span style={{ fontSize: "14px", color: "red" }}>መግለጫ ያስፈልጋል። </span>
      ),
      price_for_employee: formValues.price_for_employee ? (
        ""
      ) : (
        <span style={{ fontSize: "14px", color: "red" }}>የሰራተኛ ዋጋ ያስፈልጋል።</span>
      ),
      price_for_guest: formValues.price_for_guest ? (
        ""
      ) : (
        <span style={{ fontSize: "14px", color: "red" }}>የእንግዳ ዋጋ ያስፈልጋል።</span>
      ),
    };

    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("ሁሉም መስኮች መሞላት አለባቸው.");
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
      formData.append(
        "price_for_department",
        parseFloat(formValues.price_for_department)
      );
      formData.append("meal_type", formValues.meal_type.toString());
      formData.append("is_fasting", formValues.is_fasting ? "1" : "0");
      formData.append("is_drink", formValues.is_drink ? "1" : "0");
      formData.append("is_available", formValues.is_available ? "1" : "0");
      formData.append(
        "available_amount",
        parseInt(formValues.available_amount)
      );

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
      setSuccessMessage(
        `${selectedMenu ? "ሜኑ መቀየር" : "ወደ ሜኑ ማስገባት "} ስኬታማ ነው!!`
      );
      setDialogOpen(true);
    } catch (error) {
      if (error.response && error.response.data) {
        // Parse the error messages from the server's response
        const serverErrorMessages = error.response.data.errors;
        let errorMessage = "የሜኑ ምግብ ምዝገባ አልተሳካም፦ ";

        for (const [key, value] of Object.entries(serverErrorMessages)) {
          errorMessage += `${key}: ${value[0]}, `;
        }

        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("የሜኑ ምግብ ምዝገባ አልተሳካም፦ " + error);
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
      {userData.user.role === "communittee_admin" ? (
        <NavbarForCommette />
      ) : userData.user.role === "cafeManager_admin" ? (
        <CafeManagerDashboardNavbar />
      ) : (
        <DashboardNavbar />
      )}
      {userData.user.role === "communittee_admin" ? (
        <CafeCommetteeSidenav
          color="dark"
          brand=""
          brandName="የኮሚቴ ክፍል መተግበሪያ"
        />
      ) : userData.user.role === "cafeManager_admin" ? (
        <CafeManagerSidenav
          color="dark"
          brand=""
          brandName="የምግብ ዝግጅት ክፍል መተግበሪያ"
        />
      ) : (
        <CashierSidenav color="dark" brand="" brandName="የገንዘብ ተቀባይ ክፍል መተግበሪያ" />
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
        <MDTypography variant="h6" color="white">
          {selectedMenu ? "የሜኑ አይነት መቀየሪያ" : "የሜኑ አይነት መጨመሪያ "}
        </MDTypography>
      </MDBox>
      <FoodItemForm
        values={formValues}
        errorMessages={errorMessages}
        loading={loading}
        file={formValues.image}
        handleImageUpload={handleImageUpload}
        inputHandler={inputHandler}
        handleAddToMenu={handleAddToMenu}
        selectedMenu={selectedMenu}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{successMessage ? "ማረጋገጫ" : "ማስታወቂያ"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {successMessage || errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton color="primary" onClick={handleDialogClose}>
            እሺ
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default AddMenuItem;