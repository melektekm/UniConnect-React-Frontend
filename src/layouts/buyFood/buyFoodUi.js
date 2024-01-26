import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDInput from "../../components/MDInput";
import Button from "@mui/material/Button";
import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";
import axios from "axios";
import { Box } from "@mui/material";
import { BASE_URL } from "../../appconfig";
import colors from "../../assets/theme/base/colors"; 
import EmployeeInfo from "../deposit/employeeInfo";
import  handleFindEmployee from"../deposit"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Switch,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CardContent,
  CardActions,
  Icon,
  Typography,
  Pagination,
  Scrollbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import CircularProgress from '@mui/material/CircularProgress';
import MDTypography from "../../components/MDTypography";
function OrderSummary({
  data,
  formData,
  guestFormData,
  handleEmployeeIdChange,
  handleGuestNameChange,
  handleInputChange,
  handleOrder,
  handleClear,
  handleChangeQuantity,
  selectedItems,
  handleSelectedMenu,
  handleDeleteItem,
  isEmployee,
  setErrorMessage,
  setOpen,
  errorMessage,
  handleBlur,
  inputValues,
  setInputValues,
  loadingBuy,
  open,
  handleFindEmployee,
  employeeInfo,
  isSearching,
}) {
  const [current_page, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Number of items to display per page

  const [selectedMenuType, setSelectedMenuType] = useState("all"); // Added state for selected menu type
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const [menuItems, setMenuItems] = useState([]);
  const [foodMenu, setFoodMenu] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  


  const accessToken = userData.accessToken;

  // Initialize input values based on the initial quantity of selected items
  useEffect(() => {
    const initialValues = {};
    selectedItems.forEach((item, index) => {
      initialValues[index] = item.quantity;
    });
    setInputValues(initialValues);
  }, [selectedItems]);

  function filteredMenuItems() {
    let filterdItems = [];
    if (selectedMenuType === "all") {
      filterdItems = foodMenu;
    } else if (selectedMenuType === "breakfast") {
      filterdItems = foodMenu.filter((item) => item.meal_type === "breakfast");
    } else if (selectedMenuType === "lunch") {
      filterdItems = foodMenu.filter((item) => item.meal_type === "lunch");
    } else if (selectedMenuType === "drink") {
      filterdItems = foodMenu.filter((item) => item.meal_type === "drink");
    }
    // Add more conditions for other menu types if needed

    return filterdItems; // Default case, return true to include all items
  }

  const handlePageChange = (event, Page) => {
    setCurrentPage(Page);
 
  };

  useEffect(() => {
    if (formData.employee_id !== "") {
      handleFindEmployee();
    }
  }, [formData.employee_id]);

  const handleOpenConfirmationDialog = () => {
    setShowConfirmationDialog(true);
  };

  const handleConfirmOrder = () => {
     handleOrder();
    // Close the confirmation dialog
    setShowConfirmationDialog(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${BASE_URL}/menu-items?page=${current_page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const dataArray = response.data.data;

        const menuItemsMapped = dataArray.map((item) => ({
          id: parseInt(item.id, 10),
          name: String(item.name),
          description: String(item.description),
          imageUrl: String(item.image_url),
          price_for_guest: parseFloat(item.price_for_guest),
          price_for_employee: parseFloat(item.price_for_employee),
        }));

        setMenuItems(menuItemsMapped);

        if (response.data) {
          setFoodMenu(response.data.data); // Set menu items
          setCurrentPage(response.data.current_page);
          setLastPage(response.data.last_page); 
          setLoading(false)
        } else {
       
        }
      } catch (error) {
     
      }
    }

    fetchData(); // Call the async function immediately
  }, [current_page, selectedMenuType]);

  return (
    <Box
      sx={{
        position: "fixed",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Grid container>
        <Grid
          item
          xs={4}
          sx={{ height: "100%", overflowY: "auto", paddingRight: "2rem" }}
        >
          <Box>
            <Box
              sx={{
                backgroundColor: colors.white.main,
           
                overflowY: "scroll",
                maxHeight: "300px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <Table stickyHeaderb >
                <TableRow 
                   sx={{
                    backgroundColor: colors.light.main,
                    position: "sticky",
                    top: 0,
                    zIndex: 1, 
                  }}
                >
                  <TableCell
                    align="center"
                    style={{ width: "30%", color: "white" }}
                  >
                    የምግብ ስም
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ width: "30%", color: "white" }}
                  >
                    ዋጋ
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ width: "30%", color: "white" }}
                  >
                    ብዛት
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ width: "30%", color: "white" }}
                  >
                    ድርጊት
                  </TableCell>
                </TableRow>

                <TableBody >
                  {selectedItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell
                        align="center"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.name}
                      </TableCell>
                      <TableCell align="center">
                        {isEmployee
                          ? item.price_for_employee
                          : item.price_for_guest}{" "}
                        ብር
                      </TableCell>
                      <TableCell align="center">
                        <input
                          type="text"
                          pattern="[0-9]+"
                          defaultValue={1}
                          value={inputValues[index] || ""}
                          onBlur={() => handleBlur(index, inputValues[index])}
                          onChange={(event) =>
                            handleChangeQuantity(index, event)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleDeleteItem(index)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            {loadingBuy ? <MDBox  sx={{textAlign : "center", width: "100%"}}>
        <CircularProgress color="dark" />

        </MDBox>:''}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "10px",
                marginTop: "10px",
              }}
            >
              <Typography variant="h6">
                ጠቅላላ ሂሳብ: {data.totalPrice} ብር
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              {isEmployee ? (
                  <MDBox>
                <MDInput
                  id="employee-id"
                  label="የሰራተኛ መለያ ቁጥር"
                  value={formData.employee_id}
                  onChange={handleEmployeeIdChange}
                />
               <MDBox display="flex" alignItems="center" my={2}>
      
               </MDBox>
              
               <MDBox
  sx={{
    border: "3px solid #016A70",
    padding: "20px",
    display: `${formData.employee_id ? '' : 'none'}`,
  }}
>
  <EmployeeInfo info={employeeInfo} isSearching={isSearching} />
</MDBox>

             
               </MDBox>
              ) : (
                <MDInput
                  id="guest-name"
                  label="እንግዳ ስም"
                  value={guestFormData.name}
                  onChange={handleInputChange}
                  name="name"
                />
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
                color: "#FFFFFF",
              }}
            >
              <MDButton
                variant="contained"
                color="primary"
                style={{ color: "white" }}
                onClick={handleOpenConfirmationDialog}
              >
               ትእዛዝ ፈጽም
              </MDButton>
              <Box sx={{ marginLeft: "20px" }}>
                <MDButton variant="contained" color="error" style={{ color: "white" }} onClick={handleClear}>
                  ባዶ አድርግ
                </MDButton>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={5} >
          
            <MDBox
              mx={0}
              mt={1}
              mb={2}
              py={3}
              px={1}
              variant="gradient"
              bgColor="dark"
              borderRadius="lg"
              coloredShadow="info"
              textAlign="center"
            >
              <MDButton
                style={{ marginRight: "30px" }}
                variant={selectedMenuType === "all" ? "contained" : "outlined"}
                onClick={() => setSelectedMenuType("all")}
              >
                ሁሉም
              </MDButton>
              <MDButton
                style={{ marginRight: "30px" }}
                variant={
                  selectedMenuType === "breakfast" ? "contained" : "outlined"
                }
                onClick={() => setSelectedMenuType("breakfast")}
              >
                ቁርስ
              </MDButton>
              <MDButton
                style={{ marginRight: "30px" }}
                variant={
                  selectedMenuType === "lunch" ? "contained" : "outlined"
                }
                onClick={() => setSelectedMenuType("lunch")}
              >
                ምሳ
              </MDButton>

              <MDButton
                style={{ marginRight: "30px" }}
                variant={
                  selectedMenuType === "drink" ? "contained" : "outlined"
                }
                onClick={() => setSelectedMenuType("drink")}
              >
                መጠጦች
              </MDButton>
            </MDBox>
            <Box  sx={{
    overflowY: "auto",  // Enable vertical scrolling
    maxHeight: "350px",  // Set a maximum height
  }}>
            <Grid container spacing={1}>
            {loading ? <MDBox  sx={{textAlign : "center", width: "100%", marginTop:"10px"}}>
        <CircularProgress color="info" />
        <MDTypography sx={{fontSize: "0.7em"}}>በመፈለግ ላይ ....</MDTypography>
        </MDBox>:
              filteredMenuItems().map((foodItem) => (
              
                <Grid item xs={4} sm={4} md={4} key={foodItem.id}>
                  <Card
                    sx={{
                      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                      borderRadius: "8px",
                      height: "auto", // Changed height to auto
                      width: "150px",
                      backgroundColor: colors.light.main,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: "Arial, sans-serif",
                          color: "#FFFFFF",
                          padding: "3px 5px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          lineHeight: "1.2", // Added line height
                          minHeight: "2.4em", // Added minimum height for food name
                          textAlign: "center",
                          fontSize: "0.8em",
                        }}
                      >
                        {foodItem.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "Arial, sans-serif",
                          color: "FFFFFF",
                          padding: "1px 0",
                          borderRadius: "3px",
                          fontSize: "1rem",
                        }}
                      >
                        ዋጋ:
                        {isEmployee
                          ? foodItem.price_for_employee
                          : foodItem.price_for_guest}{" "}
                        ብር
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        size="small"
                        onClick={() => handleSelectedMenu(foodItem)}
                        sx={{
                          backgroundColor: "#1D5D9B",
                          transition: "transform 0.2s",
                          borderRadius: "4px",
                          cursor: "pointer",
                          color: "FFFFFF",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                        }}
                        variant="contained"
                      >
                        <h4 style={{color: "white"}} >ጨምር</h4>             
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
         ))}
            </Grid>
            </Box> 
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Pagination
                component={Link}
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
            </Box>
          
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { padding: "15px"} }} 
      
      >
        <DialogTitle id="alert-dialog-title">{"ማስታወቂያ"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setErrorMessage("");
            }}
            color="primary"
            variant="contained"
            style={{borderRadius: "15%"}}
          >
           <h4 style={{color: "white"}}> ዝጋ</h4>
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={showConfirmationDialog}
  onClose={() => setShowConfirmationDialog(false)}
  aria-labelledby="order-confirmation-dialog-title"
  aria-describedby="order-confirmation-dialog-description"
  PaperProps={{ style: { padding: "15px"} }}
>
  <DialogTitle id="order-confirmation-dialog-title">
    ማረጋገጫ
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="order-confirmation-dialog-description">
      ትዕዛዙን ለመፈጸም እርግጠኛ ነዎት?
    </DialogContentText>
  </DialogContent>
  <DialogActions style={{justifyContent:"space-between"}}>
    <MDButton
      onClick={() => setShowConfirmationDialog(false)}
      color="error"
      variant="contained"
      style={{ borderRadius: "10%" }}
    >
      <h4 style={{ color: "white" }}>አይ</h4>
    </MDButton>
    <MDButton
      onClick={handleConfirmOrder} // Confirm the order
      color="primary"
      variant="contained"
      style={{ borderRadius: "10%" }}
    >
      <h4 style={{ color: "white" }}>አዎ</h4>
    </MDButton>
  </DialogActions>
</Dialog>

    </Box>
  );
}

export default OrderSummary;
