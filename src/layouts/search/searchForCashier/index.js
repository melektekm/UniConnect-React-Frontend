import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button"; // Import Button component
import MainDashboard from "../../../layouts/MainDashboard";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
import { Segment } from "semantic-ui-react";
import { BASE_URL } from "../../../appconfig";
import Store from "electron-store";
import { session } from "electron";
import MDInput from "../../../components/MDInput";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import { Select, MenuItem } from "@mui/material";
// import CashierSidenav from "../../../examples/Sidenav/CashierSidenav";
import AddIcon from "@mui/icons-material/Add";
import MenuItemCard from "../../foodMenu/MenuItemCard";
// import Sidenav from "../../examples/Sidenav/AdminSidenav";
import { EthDateTime } from "ethiopian-calendar-date-converter";
import CircularProgress from "@mui/material/CircularProgress";
import Sidenav from "../../../examples/Sidenav/AdminSidenav";
import {
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CashierDashboard from "../../CashierDashboard";

function SearchMenuForCashier() {
  const [foodMenu, setFoodMenu] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [selectedAction, setSelectedAction] = useState([]);
  const [searchType, setSearchType] = useState("");

  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const navigate = useNavigate();

  const accessToken = userData.accessToken;
  const [loading, setLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  function convertToEthiopianDate(inputDate) {
    const parsedDate = new Date(inputDate);

    if (!isNaN(parsedDate.getTime())) {
      const ethDateTime = EthDateTime.fromEuropeanDate(parsedDate);
      const dayOfWeek = ethDateTime.getDay();
      const dayOfWeekStrings = [
        "እሁድ",
        "ሰኞ",
        "ማክሰኞ",
        "ረቡእ",
        "ሐሙስ",
        "አርብ",
        "ቅዳሜ",
      ];
      const dayName = dayOfWeekStrings[dayOfWeek];

      const ethiopianDateStr = `${dayName}, ${ethDateTime.toDateString()}`;

      return `${ethiopianDateStr}`;
    } else {
      return "Invalid Date";
    }
  }

  function handleUpdateMenu(updatedMenu) {
    if (!selectedMenu) {
      setFoodMenu([...foodMenu, updatedMenu]);
    } else {
      setFoodMenu(
        foodMenu.map((menu) =>
          menu.id === updatedMenu.id ? updatedMenu : menu
        )
      );
      setSelectedMenu(null);
    }
    navigate("/addFood", { state: { selectedMenu: updatedMenu } });
  }

  useEffect(() => {
    // Retrieve the previous route from sessionStorage
    const previousRoute = sessionStorage.getItem("previousRoute");

    if (previousRoute) {
      // Check the value of previousRoute and set searchType accordingly
      if (previousRoute === "/addEmployee") {
        setSearchType("employee");
      } else if (previousRoute === "/deposit") {
        setSelectedAction("add_to_deposit");
        setSearchType("employee");
      } else if (previousRoute === "/buyFood") {
        setSelectedAction("add_to_buy_food");
        setSearchType("employee");
      } else {
        // Default to 'menuitem' or handle other cases as needed
        setSearchType("menuitem");
      }
    }
  }, []);

  const handleMenuClick = async (employee) => {
    if (selectedAction === "add_to_buy_food") {
      if (employee && employee.id !== undefined) {
        const employeeId = employee.id.toString(); // Convert to a string

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Store data in sessionStorage
        sessionStorage.setItem("previous Route", employeeId);

        // Navigate to the /buyFood route
        navigate("/buyFood");
      }
    }
    if (selectedAction === "add_to_deposit") {
      if (employee && employee.id !== undefined) {
        const employeeId = employee.id.toString();

        await new Promise((resolve) => setTimeout(resolve, 1000));
        sessionStorage.setItem("previous Search", employeeId);

        navigate(`/deposit`);
      }
    }
  };

  const [searchInput, setSearchInput] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    if (searchType === "menuitem") {
      try {
        const response = await axios.get(`${BASE_URL}/search`, {
          params: {
            term: searchInput,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          setFoodMenu(response.data);
        } else {
        }
      } catch (error) {}
    }
    if (searchType === "employee") {
      try {
        const response = await axios.get(`${BASE_URL}/searchEmployeeByname`, {
          params: {
            term: searchInput,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          setEmployeeList(response.data);
        } else {
        }
      } catch (error) {}
    }
    setIsSearched(true);
    setLoading(false);
  };
  function handleUpdateMenu(updatedMenu) {
    if (!selectedMenu) {
      setFoodMenu([...foodMenu, updatedMenu]);
    } else {
      setFoodMenu(
        foodMenu.map((menu) =>
          menu.id === updatedMenu.id ? updatedMenu : menu
        )
      );
      setSelectedMenu(null);
    }
    navigate("/addFood", { state: { selectedMenu: updatedMenu } });
  }
  function handleDeleteDialogOpen(menuId) {
    const menuItem = foodMenu.find((menuItem) => menuItem.id === menuId);
    setItemToDelete(menuItem);
    setDeleteDialogOpen(true);
  }
  const onSet = async (updatedMenuItem, availableAmount) => {
    try {
      // Send a request to update the menu item's available amount in the database
      await axios.post(
        `${BASE_URL}/update-available-amount/${updatedMenuItem.id}`,
        { available_amount: availableAmount.toString() },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update the state to reflect the changes
      const updatedFoodMenu = foodMenu.map((menuItem) => {
        if (menuItem.id === updatedMenuItem.id) {
          if (availableAmount > 0) {
            menuItem.is_available = 1;
          } else {
            menuItem.is_available = 0;
          }
          menuItem.available_amount = availableAmount.toString();
        }
        return menuItem;
      });

      setFoodMenu(updatedFoodMenu);
    } catch (error) {}
  };
  const handleSearchInputChange = (e) => {
    setSearchType(e.target.value);
    setIsSearched(false);
  };

  return (
    <DashboardLayout>
      {/* <DashboardNavbar />
      <CashierSidenav color="dark" brand="" brandName="የገንዘብ ተቀባይ ክፍል መተግበሪያ" /> */}
      <DashboardNavbar />
      <Sidenav />
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
        style={{ display: "flex", gap: "10px" }}
      >
        <MDBox
          bgColor="white"
          style={{
            marginRight: "20px",
            marginLeft: "100px",
            width: "300px",
            display: "flex", // Ensure flex display to align items vertically
            alignItems: "center", // Center items vertically
            border: "1px solid #ccc", // Add a border for consistent appearance
            borderRadius: "4px", // Apply border radius to match the input field
            padding: "8px", // Add padding for better spacing
          }}
        >
          <MDInput
            placeholder=" እዚህ ይጻፉ..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: "100%",
              border: "none", // Remove border from input field to match the container
              outline: "none", // Remove outline on focus for better appearance
            }}
          />
        </MDBox>

        {loading ? (
          <MDBox textAlign="center">
            <CircularProgress color="white" />
          </MDBox>
        ) : (
          <MDButton
            variant="contained"
            onClick={handleSearch}
            color="primary"
            style={{ borderRadius: "10%", marginTop: "10px" }}
          >
            ፈልግ
          </MDButton>
        )}

        <Select
          value={searchType}
          onChange={handleSearchInputChange}
          style={{
            borderRadius: "10%",
            marginRight: "10px",
            width: "100px",
            height: "50px",
            color: "white",
            marginTop: "10px",
          }}
        >
          <MenuItem value="employee">
            <h4 style={{ color: "#000000" }}>ሰራተኛ</h4>
          </MenuItem>
          <MenuItem value="menuitem">
            <h4 style={{ color: "#000000" }}>ሜኑ እቃ</h4>{" "}
          </MenuItem>
        </Select>
      </MDBox>
      <MDBox py={3}>
        {searchType === "menuitem" && renderFoodMenu()}
        {searchType === "employee" && renderEmployeeBody()}
        {searchType === "order" && renderOrderBody()}
      </MDBox>

      <Footer />
    </DashboardLayout>
  );

  function renderFoodMenu() {
    if (foodMenu.length === 0) {
      if (!isSearched) {
        return;
      }

      return (
        <Typography variant="h6" align="center">
          ምንም ሜኑ አልተገኘም።
        </Typography>
      );
    }

    return (
      <Grid container spacing={6}>
        {foodMenu.map((foodItem) => (
          <Grid item xs={12} sm={6} md={4} key={foodItem.id}>
            <MenuItemCard
              item={foodItem}
              onEdit={handleUpdateMenu}
              onDelete={handleDeleteDialogOpen}
              onSet={onSet}
              userData={userData}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  function renderEmployeeBody() {
    if (employeeList.length === 0) {
      if (!isSearched) {
        return;
      }
      return (
        <Typography variant="h6" align="center">
          ምንም ሰራተኛ አልተገኘም።
        </Typography>
      );
    }
    return (
      <Card style={{ padding: "10px" }}>
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          textAlign="center"
        >
          የሰራተኞች ዝርዝር
        </Typography>
        {employeeList.length === 0 && isSearched ? (
          <Typography variant="body1" color="textSecondary">
            ምንም ሰራተኞች አልተገኙም።
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableRow>
                <TableCell>
                  <strong>መታወቂያ</strong>
                </TableCell>
                <TableCell>
                  <strong>ስም</strong>
                </TableCell>
                <TableCell textAlign="right">
                  <strong>ኢሜይል</strong>
                </TableCell>
                <TableCell>
                  <strong>ዲፓርትመንት</strong>
                </TableCell>
                <TableCell>
                  <strong>ዋና የሥራ ክፍል</strong>
                </TableCell>
                <TableCell>
                  <strong>የሚቀረው የገንዘብ መጠን</strong>
                </TableCell>
                <TableCell>
                  <strong>የገባበት ቀን</strong>
                </TableCell>
                <TableCell>
                  <strong>ድርጊት</strong>
                </TableCell>
              </TableRow>

              {employeeList.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.balance}</TableCell>
                  <TableCell>
                    {convertToEthiopianDate(employee.created_at)}
                  </TableCell>
                  <TableCell style={{ display: "flex" }}>
                    <IconButton onClick={(e) => handleMenuClick(employee, e)}>
                      <AddIcon color="primary" />
                    </IconButton>
                    <Select
                      value={selectedAction}
                      onChange={(e) => setSelectedAction(e.target.value)}
                      style={{ width: "100px" }}
                    >
                      <MenuItem value="add_to_buy_food">
                        <h4 style={{ color: "#000000" }}>ምግብ ግዢ</h4>
                      </MenuItem>
                      <MenuItem value="add_to_deposit">
                        <h4 style={{ color: "#000000" }}>ገንዘብ አያያዝ</h4>
                      </MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </TableContainer>
        )}
      </Card>
    );
  }
  function renderOrderBody() {
    if (foodMenu.length === 0 && isSearched) {
      return (
        <Typography variant="h6" align="center">
          ምንም ትዕዛዝ አልተገኘም።
        </Typography>
      );
    }
  }
}

export default SearchMenuForCashier;
