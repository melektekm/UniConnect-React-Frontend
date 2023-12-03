import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDInput from '../../components/MDInput';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";
import axios from "axios";
import { Box } from '@mui/material';
import { BASE_URL } from "../../appconfig";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Switch, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CardContent, CardActions, Icon, Typography, Pagination, Scrollbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
function OrderSummary({
  data,
  formData,
  guestFormData,
  handleEmployeeIdChange,
  handleGuestNameChange,
  handleOrder,
  handleClear,
  handleChangeQuantity,
  selectedItems,
  handleSelectedMenu,
  handleDeleteItem,
  isEmployee,
  setIsEmployee,
  setErrorMessage,
  setOpen,
  errorMessage,
  open
  
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

  const accessToken = userData.accessToken


  function filteredMenuItems ()  {
    let filterdItems = []
    if (selectedMenuType === "all") {
      filterdItems = foodMenu;
    } else if (selectedMenuType === "breakfast") {
      filterdItems = foodMenu.filter((item) => item.meal_type === "breakfast");
    } else if (selectedMenuType === "lunch") {
      filterdItems = foodMenu.filter((item) => item.meal_type === "lunch");
    } else if (selectedMenuType === "drink") {
      filterdItems = foodMenu.filter((item) => item.is_drink === 1);
    }
    // Add more conditions for other menu types if needed

    return filterdItems; // Default case, return true to include all items
  }

 


  const handlePageChange = (event, Page) => {
    setCurrentPage(Page);
    console.log(current_page)
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/menu-items?page=${current_page}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const dataArray = response.data.data;
      
  
        const menuItemsMapped = dataArray.map(item => ({
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
          setLastPage(response.data.last_page); // Set the total number of pages
        } else {
          console.log("Empty response");
        }
      } catch (error) {
        console.error("Failed to fetch food menu:", error);
      }
    }
  
    fetchData(); // Call the async function immediately
  
  }, [current_page, selectedMenuType]);
  
  

  return (
    <Box sx={{ position: "fixed", width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
      <FormControlLabel
        control={<Checkbox checked={isEmployee} onChange={event => setIsEmployee(event.target.checked)} onClick={handleClear} />}
        label={isEmployee ? "Buy for Employee" : "Buy for Guest"}
      />

      <Grid container>
        <Grid item xs={4} sx={{ height: "100%", overflowY: "auto", paddingRight: '2rem' }}>
          <Box>
            <Box sx={{ overflowY: "scroll", maxHeight: '400px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <TableContainer >
                <Table>
                      <TableRow>
                        <TableCell >Food Name</TableCell>
                        <TableCell >Price</TableCell> 
                        <TableCell >Quantity</TableCell> 
                      </TableRow>
                    <TableBody>
                    {selectedItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell >{item.name}</TableCell>
                        <TableCell > 
                          ${isEmployee ? item.price_for_employee : item.price_for_guest}
                        </TableCell>
                        <TableCell > 
                          <input
                          type="number"
                            
                            onChange={event => handleChangeQuantity(index, event)}
                          />
                        </TableCell>
                        <TableCell>
                  <IconButton onClick={() => handleDeleteItem(index)} >
                    <Icon color="error">delete</Icon>
                  </IconButton>
                </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginRight: "10px", marginTop: "10px" }}>
              <Typography variant="h6">Total Price: ${data.totalPrice}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              {isEmployee ? (
                <MDInput id="employee-id" label="Employee ID" value={formData.employee_id} onChange={handleEmployeeIdChange} />
              ) : (
                <MDInput id="guest-name" label="Guest Name" value={guestFormData.employee_id} onChange={handleGuestNameChange} />
              )}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px", color:'#FFFFFF',}}>
              <Button variant="contained" color="secondary"  style={{ color: 'white' }} onClick={handleOrder}>Order</Button>
              <Box sx={{ marginLeft: "20px" }}>
                <Button variant="contained" color="secondary"  style={{ color: 'white' }} onClick={handleClear}>Clear All</Button>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={5}>
          <Box sx={{ overflowY: 'scroll', height: '80vh' }}>
            <MDBox
              mx={0}
              mt={1}
              mb={2}
              py={3}
              px={1}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
              textAlign="center"
            >
              <MDButton
                style={{ marginRight: "30px" }}
                variant={selectedMenuType === "all" ? "contained" : "outlined"}
                onClick={() => setSelectedMenuType("all")}
              >
                All
              </MDButton>
              <MDButton
                style={{ marginRight: "30px" }}
                variant={selectedMenuType === "breakfast" ? "contained" : "outlined"}
                onClick={() => setSelectedMenuType("breakfast")}
              >
                Breakfast
              </MDButton>
              <MDButton
                style={{ marginRight: "30px" }}
                variant={selectedMenuType === "lunch" ? "contained" : "outlined"}
                onClick={() => setSelectedMenuType("lunch")}
              >
                Lunch
              </MDButton>

              <MDButton
                style={{ marginRight: "30px" }}
                variant={selectedMenuType === "drink" ? "contained" : "outlined"}
                onClick={() => setSelectedMenuType("drink")}
              >
                Drinks
              </MDButton>
            </MDBox>
            <Grid container spacing={1}>
              {filteredMenuItems().map((foodItem) => (
                <Grid item xs={4} sm={4} md={4} key={foodItem.id}>
                  <Card
                    sx={{
                      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px',
                      height: 'auto', // Changed height to auto
                      width: '150px',
                      backgroundColor: '#5B6771',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: 'Arial, sans-serif',
                          color: '#FFFFFF',
                          padding: '3px 5px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          lineHeight: '1.2', // Added line height
                          minHeight: '2.4em', // Added minimum height for food name
                          textAlign:'center'
                        }}
                      >
                        {foodItem.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: 'Arial, sans-serif',
                          color: 'white',
                          padding: '1px 0',
                          borderRadius: '3px',
                          fontSize: '1rem',
                        }}
                      >
                        Price: ${isEmployee ? foodItem.price_for_employee : foodItem.price_for_guest}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                      
                        size="small"
                        onClick={() => handleSelectedMenu(foodItem)}
                        sx={{
                          backgroundColor: '#727B92',
                          transition: 'transform 0.2s',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        Add
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Notification"}</DialogTitle>
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
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OrderSummary;
