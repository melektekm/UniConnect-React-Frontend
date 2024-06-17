import React, { useState, useEffect } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import Footer from "../../../examples/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../../../appconfig";
import MDInput from "../../../components/MDInput";
import Typography from "@mui/material/Typography";
import { Select, MenuItem } from "@mui/material";
import MainDashboard from "../../MainDashboard";
import AdminNavbar from "../../../examples/Navbars/AdminNavbar";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { EthDateTime } from "ethiopian-calendar-date-converter";
import CircularProgress from "@mui/material/CircularProgress";

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

function SearchMenuForAdmin() {
  const [employeeList, setEmployeeList] = useState([]);

  const [selectedAction, setSelectedAction] = useState("add_to_employee_edit"); // Default value
  const [searchType, setSearchType] = useState("employee");
  const [isSearched, setIsSearched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  // const selectedEmployee = location.state?.selectedEmployee;

  useEffect(() => {
    // Retrieve the previous route from sessionStorage
    const previousRoute = sessionStorage.getItem("previousRoute");

    if (previousRoute) {
      // Check the value of previousRoute and set searchType accordingly
      if (previousRoute === "/addEmployee") {
        setSearchType("employee");
      }
    }
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchType(e.target.value);
    setIsSearched(false);
  };

  const handleMenuClick = async (employee) => {
    if (selectedAction === "add_to_buy_food") {
      if (employee && employee.id !== undefined) {
        const employeeId = employee.id.toString();
      } else {
      }
    } else if (selectedAction === "add_to_employee_edit") {
      setTimeout(() => {
        navigate("/addEmployee", { state: { selectedEmployee: employee } });
      }, 1000);
    }
  };

  const [searchInput, setSearchInput] = useState("");

  const handleSearch = async () => {
    setLoading(true);
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
    setLoading(false);
  };
  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);
  useEffect(() => {
    if (selectedEmployee) {
      setFormValues(selectedEmployee);
    }
  }, [selectedEmployee]);
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/auth/admin/getEmployee?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data) {
        setEmployees(response.data["data"]);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
      } else {
      }
    } catch (error) {}
  };
  const handleDeleteDialogOpen = (employeeId) => {
    const employee = employees.find((employee) => employee.id === employeeId);
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  const handleDelete = async (employeeId) => {
    if (!employeeId) return;

    try {
      await axios.delete(
        `${BASE_URL}/auth/admin/deleteEmployee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setEmployees(employees.filter((employee) => employee.id !== employeeId));
      setDeleteDialogOpen(false);
    } catch (error) {}
  };
  function handleEdit(updatedEmployee) {
    if (!selectedEmployee) {
      setEmployees([...employees, updatedEmployee]);
    } else {
      setEmployees(
        employees.map((employee) =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee
        )
      );
      setSelectedEmployee(null);
    }
    navigate("/addEmployee", { state: { selectedEmployee: updatedEmployee } });
  }
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Sidenav />
      {/* <AdminNavbar />
      <MainDashboard /> */}
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
            padding: "2px", // Add padding for better spacing
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
            style={{ borderRadius: "20%", height: "50px", marginTop: "10px" }}
          >
            Search
          </MDButton>
        )}

        <Select
          value={searchType}
          onChange={handleSearchInputChange}
          style={{
            marginRight: "10px",
            width: "100px",
            height: "50px",
            color: "blue",
            marginTop: "10px",
          }}
        >
          <MenuItem value="employee">
            <p style={{ color: "white" }}>ሰራተኛ</p>
          </MenuItem>
        </Select>
      </MDBox>
      <MDBox py={3}>{searchType === "employee" && renderEmployeeBody()}</MDBox>

      <Footer />
    </DashboardLayout>
  );
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
      <>
        {employeeList.length === 0 ? (
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
                <TableCell>
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
                  <TableCell align={"center"}>
                    <IconButton onClick={() => handleEdit(employee)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteDialogOpen(employee.id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </TableContainer>
        )}
      </>
    );
  }
}

export default SearchMenuForAdmin;
