import React, { useState } from "react";
import fs from "fs";
import path from "path";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import storeKeeperSidenav from "../../examples/Sidenav/storeKeeperSidenav";
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
import { ChromePicker } from "react-color";
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
import MDButton from "../../components/MDButton";
import Grid from "@mui/material/Grid";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import MainDashboard from "../MainDashboard";
import { Select, MenuItem } from "@mui/material";
import {
  Card,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  InputLabel,
  FormControl,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import colors from "../../assets/theme/base/colors";

function StockApproval() {
  const [removeIndex, setRemoveIndex] = useState(null);

  const openRemoveDialog = (index) => {
    setRemoveIndex(index);
  };

  // Function to close the confirmation dialog for remove
  const closeRemoveDialog = () => {
    setRemoveIndex(null);
  };

  // Function to remove a form after confirmation
  const confirmRemoveForm = () => {
    if (removeIndex !== null && Array.isArray(formList.items)) {
      const updatedFormList = { ...formList }; // Create a shallow copy of formList
      updatedFormList.items = [...formList.items]; // Create a shallow copy of the items array
      updatedFormList.items.splice(removeIndex, 1); // Remove an item from the items array
      setFormList(updatedFormList); // Update formList with the modified items array
      closeRemoveDialog(); // Close the confirmation dialog
    }
  };

  const [newColor, setNewColor] = useState("");

  const electron = window.require("electron");

  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [selectedColorType, setSelectedColorType] = useState("background");
  const [pickedColor, setPickedColor] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const colorOptions = [
    { label: "የጀርባ ምስል", value: "background" },
    { label: "የጎን ሜኑ ቀለም", value: "gradients.dark" },
    { label: "የጎን ሜኑ ቀለም ተደራቢ", value: "gradients.darks" },
    { label: "የመደበኛ የፊደል ቀለም", value: "white" },
    { label: "የመጀመሪያ ደረጃ  አዝራር", value: "primary" },
    { label: "ሁለተኛ ደረጃ አዝራር", value: "secondary" },
    { label: "መረጃ ሰጪ ክፍል ", value: "info" },
    { label: "የተሳካ መረጃ አመልካች ቀለም", value: "success" },
    { label: "የማስጠንቀቂያ ሰጪ ቀለማት", value: "warning" },
    { label: "የስህተት  ቀለማት", value: "error" },
    { label: "የርእስ ጀርባ ምስል ቀለም", value: "dark" },
    { label: "የሰንጠረዥ ቀለማት", value: "light" },
    { label: "የርእስ ቀለማት", value: "gradients.primary" },
    { label: "የሁለተኛ ጀርባ ምስል ቀለም", value: "gradients.secondary" },
    { label: "የ መተግበሪያ ቀለም", value: "socialMediaColors.facebook" },
    { label: "የ እይከን ቀለም", value: "badgeColors.primary" },
  ];

  const handleColorTypeChange = (event) => {
    setSelectedColorType(event.target.value);
    setPickedColor(colors[event.target.value].main);
  };

  const handleColorChange = (color) => {
    setNewColor(color.hex);
    setPickedColor(color.hex);
  };
  const mintColorsFilePath = path.join(
    __dirname,
    "../src/assets/theme/base/mintColors.js"
  );
  const defaultColorsFilePath = path.join(
    __dirname,
    "../src/assets/theme/base/defaultColors.js"
  );
  const colorsFilePath = path.join(
    __dirname,
    "../src/assets/theme/base/colors.js"
  );
  const updateColor = (colorPath, hexValue) => {
    try {
      let state = 0;

      if (colorPath === "gradients.darks") {
        colorPath = "gradients.dark";
        state = 1;
      }
      const updatedColors = { ...colors };
      const keys = colorPath.split(".");
      let currentLevel = updatedColors;
      for (let i = 0; i < keys.length - 1; i++) {
        currentLevel = currentLevel[keys[i]];
      }
      if (colorPath === "background") {
        currentLevel[keys[keys.length - 1]].default = hexValue;
      } else if (state === 1) {
        currentLevel[keys[keys.length - 1]].state = hexValue;
      } else {
        currentLevel[keys[keys.length - 1]].main = hexValue;
      }

      const colorsString = `const colors = ${JSON.stringify(
        updatedColors,
        null,
        2
      )};\n\nexport default colors;`;
      fs.writeFileSync(colorsFilePath, colorsString);
    } catch (error) {
      throw new Error("Error updating color.");
    }
  };

  const resetColors = () => {
    try {
      const defaultColorsContent = fs.readFileSync(
        defaultColorsFilePath,
        "utf8"
      );

      fs.writeFileSync(colorsFilePath, defaultColorsContent);

      setMessage(`ገይታው ወደ ነባር ተቀይሯል`);
    } catch (error) {}
  };

  const mintColors = () => {
    try {
      const mintColorsContent = fs.readFileSync(mintColorsFilePath, "utf8");

      fs.writeFileSync(colorsFilePath, mintColorsContent);

      setMessage(`ገይታው ወደ ሚንት ገጽታ ተቀይሯል`);
    } catch (error) {}
  };

  const handleColorUpdate = () => {
    try {
      updateColor(selectedColorType, pickedColor);

      setMessage("ገጽታውን መቀየር አልተቻለም");
    } catch (error) {
      setMessage("ገጽታውን መቀየር አልተቻለም");
    }
  };

  const [handleCheck, setHandleCheck] = useState(true);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Sidenav />
      {/* {userData.user.role === "student" ? (
        <NavbarForCommette />
      ) : userData.user.role === "dean" ? (
        <CafeManagerDashboardNavbar />
      ) : (
        <NavbarForCommette />
      )}

      {userData.user.role === "student" ? (
        <CafeCommetteeSidenav
          color="dark"
          brand=""
          brandName="የኮሚቴ ክፍል መተገበሪያ"
        />
      ) : userData.user.role === "dean" ? (
        <CafeManagerSidenav
          color="dark"
          brand=""
          brandName="የምግብ ዝግጅት ክፍል መተግበሪያ"
        />
      ) : userData.user.role === "coordinator" ? (
        <CashierSidenav
          color="dark"
          brand=""
          brandName="የገንዘብ ተቀባይ ክፍል መተግበሪያ"
        />
      ) : userData.user.role === "storeKeeper" ? (
        <storeKeeperSidenav color="dark" brand="" brandName="የስቶር ክፍል መተግበሪያ" />
      ) : (
        <MainDashboard />
      )} */}

      <Grid container spacing={6}>
        <Grid item xs={12}>
          {/* Your invisible content */}
          <MDBox
            mx={2}
            mt={2}
            py={3}
            px={2}
            variant="gradient"
            bgColor="dark"
            borderRadius="lg"
            coloredShadow="info"
            style={{ border: "3px solid #0779E4" }}
          >
            <MDTypography variant="h6" color="white" textAlign="center">
              የመተግበሪያ ገጽታ መቀየሪያ
            </MDTypography>
          </MDBox>
          <MDButton
            variant="contained"
            color="secondary"
            onClick={mintColors}
            style={{ marginBottom: "25px", marginTop: "100px" }}
          >
            የሚንት ገጽታ
          </MDButton>
          <FormControlLabel
            control={
              <Checkbox
                checked={!handleCheck}
                onChange={() => setHandleCheck(!handleCheck)}
                name="invisibleContentCheckbox"
              />
            }
            label="በክፍል መቀየሪያ"
          />

          <MDBox
            style={{ display: handleCheck ? "none" : "", marginBottom: "20px" }}
          >
            <Select
              label="Select Color Type"
              value={selectedColorType}
              onChange={(e) => setSelectedColorType(e.target.value)}
              style={{ marginBottom: "20px" }}
            >
              {colorOptions &&
                colorOptions.length &&
                colorOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>

            <ChromePicker
              color={pickedColor}
              onChangeComplete={(color) => handleColorChange(color)}
            />
            <MDButton
              variant="contained"
              color="primary"
              onClick={handleColorUpdate}
              style={{ marginBottom: "20px", marginTop: "15px" }}
            >
              ቀይር
            </MDButton>
            {message && (
              <MDButton style={{ marginBottom: "20px" }}>{message}</MDButton>
            )}
          </MDBox>

          <MDButton
            variant="contained"
            color="primary"
            onClick={resetColors}
            style={{ marginBottom: "20px" }}
          >
            ወደ ነባር መልስ
          </MDButton>

          <Dialog
            open={removeIndex !== null}
            onClose={closeRemoveDialog}
            aria-labelledby="remove-dialog-title"
            aria-describedby="remove-dialog-description"
          >
            <DialogTitle id="remove-dialog-title">የእቃ መሰረዣ ማረጋገጫ/</DialogTitle>
            <DialogContent>
              <DialogContentText id="remove-dialog-description">
                እቃውን ከዝርዝሩ ለማጥፋት እርግጠኛ ነዎት?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeRemoveDialog} color="primary">
                መዝጊያ
              </Button>
              <Button onClick={confirmRemoveForm} color="primary">
                ማረጋገጫ
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default StockApproval;
