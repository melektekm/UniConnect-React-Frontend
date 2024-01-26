import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import Paper from "@mui/material/Paper";
import colors from "../../assets/theme/base/colors";

import CafeCommetteDashboard from "../CafeCommetteDashboard";
import NavbarForCommette from "../../examples/Navbars/NavBarForCommette";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { Button, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CafeManagerDashboardNavbar from "../../examples/Navbars/CafeManagerNavbar";
import CafeManagerSidenav from "../../examples/Sidenav/CafeManagerSidenav";
import storeKeeperSidenav from "../../examples/Sidenav/storeKeeperSidenav";
import CafeCommetteeSidenav from "../../examples/Sidenav/CafeCommeteeSidenav";
import { Box } from "@mui/material";

function StockRequest() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [currentPage, setCurrentPage] = useState(1);
  const userData = ipcRenderer.sendSync("get-user");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    quantity: "",
    requested_by: userData.user.id,
    measured_in: "",
  });
  const [fetchedData, setFetchedData] = useState({
    id: "",
    name: "",
    quantity: "",
    measured_in: "",
  });
  const [currentQuantityLeft, setCurrentQuantityLeft] = useState(0);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [selectedmeasuredIn, setSelectMeasuredIn] = useState("");
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingT, setLoadingT] = useState(true);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    quantity: "",
    measured_in: "",
  });
  const openConfirmationDialog = () => {
    setConfirmationOpen(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmationOpen(false);
  };

  const handleSendForm = () => {
    closeConfirmationDialog(); // Close the confirmation dialog
    submitForms(); // Send the form
  };
  const handlesend = async () => {
    await submitForms();
  };
  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };
  // State to track the index of the form to be removed
  const [removeIndex, setRemoveIndex] = useState(null);

  // Function to open the confirmation dialog for remove
  const openRemoveDialog = (index) => {
    setRemoveIndex(index);
  };

  // Function to close the confirmation dialog for remove
  const closeRemoveDialog = () => {
    setRemoveIndex(null);
  };

  // Function to remove a form after confirmation
  const confirmRemoveForm = () => {
    if (removeIndex !== null) {
      const updatedFormList = [...formList];
      updatedFormList.splice(removeIndex, 1);
      setFormList(updatedFormList);
      closeRemoveDialog(); // Close the confirmation dialog
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const fetchData = async (page) => {
    setLoadingT(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/getinventoryremained?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setFetchedData(response.data.data);
      } else {
      }
    } catch (error) {}
    setLoadingT(false);
  };

  const handleAdd = (item) => {
    setFormData({
      ...formData,
      id: item.id,
      name: item.name,
      measured_in: item.measured_in,
      quantity: 1,
    });
    setCurrentQuantityLeft(parseFloat(item.quantity_left));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      // Check if the input contains only letters (no numbers or special characters)
      if (!/^[\u1200-\u137F\s]*$/.test(value)) {
        // Remove the last character from the input value
        const newValue = value.substring(0, value.length - 1);
        return; // Prevent updating the state for invalid input
      }
    }
    let finalValue;
    if (name === "quantity") {
      finalValue = parseFloat(value);
      if (finalValue < 0) {
        return;
      }

      if (finalValue > currentQuantityLeft) {
        setOpen(true);
        setErrorMessage("ከቀሪ ብዛት የበለጠ እስገብተዋል");
        return;
      }
    } else if (name === "measured_in" || name === "name") {
      finalValue = value;
    }

    setFormData({
      ...formData,
      [name]: finalValue,
    });
  };

  const accessToken = userData.accessToken;

  const addForm = () => {
    const newErrorMessages = {
      name: formData.name ? "" : "ስም ያስፈልጋል",
      quantity: formData.quantity ? "" : "ብዛት ያስፈልጋል",
      measure_in: formData.measured_in ? "" : "መለኪያ ያስፈልጋል",
    };

    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("ሁሉም መስኮች መሞላት አለባቸው.");
      setOpen(true);
      return;
    }
    const exists = formList.some((form) => form.id === formData.id);

    if (exists) {
      setErrorMessage("ይህ ዕቃ አስቀድሞ በቅጹ አለ።");
      setOpen(true);
      return;
    }
    setFormList([...formList, formData]);
    setFormData({
      name: "",
      quantity: "",
      requested_by: userData.user.id,
      measured_in: "",
    });
  };

  const submitForms = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/stockrequest`,
        { items: formList },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setLoading(false);
        setErrorMessage("ቅጾች በተሳካ ሁኔታ ገብተዋል!");
        setOpen(true);
        setFormList([]);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 422) {
        if (
          error.response.data.message.includes(
            "Previous request was not approved"
          )
        ) {
          setErrorMessage("ተጨማሪ ያልጸደቀ ጥያቄ ስላለ ጥያቄውን ማስገባት እይችሉም");
        } else {
          setErrorMessage("የተሳሳተ ዳታ እስገብተዋል");
        }
      } else {
        setErrorMessage("ይቅርታ ጥያቄውን መላክ እልተቻለም");
      }
      setOpen(true);
    }
  };

  return (
    <DashboardLayout>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="alert-dialog-title">{"ማስታወቂያ"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={() => {
              setOpen(false);
              setErrorMessage("");
            }}
            color="primary"
            autoFocus
          >
            ሰርዝ
          </MDButton>
        </DialogActions>
      </Dialog>
      {userData.user.role == "student" ? (
        <NavbarForCommette />
      ) : userData.user.role == "dean" ? (
        <CafeManagerDashboardNavbar />
      ) : (
        <NavbarForCommette />
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
        <storeKeeperSidenav color="dark" brand="" brandName="የስቶር ክፍል መተግበሪያ" />
      )}
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <Card style={{ border: "3px solid #206A5D" }}>
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
                <MDTypography variant="h6" color="white">
                  የእቃ ማውጫ መጠየቂያ
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                <MDBox component="form" role="form">
                  <MDInput
                    type="text"
                    disabled
                    name="name"
                    label="ስም"
                    variant="standard"
                    fullWidth
                    value={formData.name}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.name}
                    helperText={errorMessages.name}
                    readOnly
                  />
                  <MDInput
                    type="number"
                    name="quantity"
                    label="ብዛት"
                    variant="standard"
                    fullWidth
                    value={formData.quantity}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.quantity}
                    helperText={errorMessages.quantity}
                  />
                  <MDInput
                    type="text"
                    name="name"
                    disabled
                    label="መለኪያ"
                    variant="standard"
                    fullWidth
                    value={formData.measured_in}
                    onChange={handleFormChange}
                    margin="dense"
                    required
                    error={!!errorMessages.measured_in}
                    helperText={errorMessages.measured_in}
                    readOnly
                  />

                  <MDBox mt={4} mb={1} textAlign="center">
                    <MDButton
                      variant="contained"
                      color="primary"
                      style={{ border: "3px solid #07689F" }}
                      onClick={addForm}
                    >
                      ጨምር
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <TableContainer
              component={Paper}
              style={{ border: "3px solid #206A5D" }}
            >
              {" "}
              <Box
                sx={{
                  backgroundColor: colors.white.main,
                  overflow: "scroll",
                  maxHeight: "400px",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <Table>
                  <TableRow
                    sx={{
                      backgroundColor: colors.light.main,
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <TableCell>ተራ ቁጥር</TableCell>
                    <TableCell>የእቃው ስም</TableCell>
                    <TableCell>መለኪያ</TableCell>
                    <TableCell>የቀረ እቃ ብዛት</TableCell>
                    <TableCell>መጨመሪያ</TableCell>
                  </TableRow>

                  {/* Replace this with your fetched data */}
                  {fetchedData &&
                    fetchedData.length > 0 &&
                    fetchedData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.measured_in}</TableCell>
                        <TableCell>{item.quantity_left}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "rgb(12, 56, 71)",
                              color: "white",
                            }}
                            onClick={() => handleAdd(item)}
                          >
                            ጨምር
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </Table>
              </Box>
            </TableContainer>

            {loadingT ? (
              <MDBox textAlign="center">
                <CircularProgress color="primary" />
              </MDBox>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </MDBox>

      {/* Display the list of forms */}
      <Card>
        <MDBox pt={3} pb={3} px={2}>
          <TableContainer
            component={Paper}
            elevation={3}
            style={{ marginTop: 20 }}
          >
            <Table>
              <TableBody>
                <TableRow sx={{ backgroundColor: "#    " }}>
                  <TableCell>
                    <strong>ተራ ቁጥር</strong>
                  </TableCell>
                  <TableCell>
                    <strong>የእቃው ስም</strong>
                  </TableCell>
                  <TableCell>
                    <strong>መለኪያ</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ብዛት</strong>
                  </TableCell>
                  {/* <TableCell>Item Price</TableCell> */}

                  {/* <TableCell>
                    <strong>Date</strong>
                  </TableCell> */}
                  <TableCell>
                    <strong>ድርጊቶች</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableBody>
                {formList.map((form, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{form.name}</TableCell>
                    <TableCell>{form.quantity}</TableCell>
                    <TableCell>{form.measured_in}</TableCell>
                    {/* <TableCell>{form.itemPrice}</TableCell> */}

                    {/* <TableCell>{form.date}</TableCell> */}
                    <TableCell align="center">
                      <MDButton
                        variant="outlined"
                        color="error"
                        onClick={() => openRemoveDialog(index)}
                      >
                        ቀንስ
                      </MDButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MDBox>
      </Card>

      <Dialog
        open={removeIndex !== null}
        onClose={closeRemoveDialog}
        aria-labelledby="remove-dialog-title"
        aria-describedby="remove-dialog-description"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="remove-dialog-title">አስወግድ</DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-dialog-description">
            እቃውን ከዝርዝሩ ማስወገድ ይፈልጋሉ?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <MDButton onClick={closeRemoveDialog} color="error">
            ሰርዝ
          </MDButton>
          <MDButton onClick={confirmRemoveForm} color="primary">
            አጽድቅ
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="alert-dialog-title">ማረጋገጫ</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ዝርዝሩን ለመላክ እርግጠኛ ነዎት
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <MDButton
            onClick={handleCloseLogoutDialog}
            color="info"
            style={{ borderRadius: "15%" }}
          >
            አዎ
          </MDButton>
          <MDButton
            onClick={handlesend}
            color="error"
            style={{ borderRadius: "15%" }}
          >
            አይደለሁም
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Submit button */}
      <MDBox mt={4} mb={1} textAlign="center">
        {loading ? (
          <MDBox textAlign="center">
            <CircularProgress color="primary" />
          </MDBox>
        ) : (
          <MDButton
            onClick={openConfirmationDialog}
            disabled={formList.length === 0 || loading}
            variant="contained"
            color="primary"
            style={{ border: "3px solid #07689F" }}
          >
            ዝርዝሩን ላክ
          </MDButton>
        )}
      </MDBox>
      <Dialog
        open={confirmationOpen}
        onClose={closeConfirmationDialog}
        aria-labelledby="confirmation-dialog-title"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="confirmation-dialog-title">
          የእቃ ማውጫ ጥያቄ ማረጋገጫ
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            የእቃ ማውጫ ጥያቄውን ወደ ስቶር ክፍል ለመላክ እርግጠኛ ነዎት?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={closeConfirmationDialog}
            style={{ borderRadius: "15%" }}
            color="error"
          >
            አይደለሁም
          </MDButton>
          <MDButton
            onClick={handleSendForm}
            style={{ borderRadius: "15%" }}
            color="primary"
          >
            አዎ
          </MDButton>
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}

export default StockRequest;
