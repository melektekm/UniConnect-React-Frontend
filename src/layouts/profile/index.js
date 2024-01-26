import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import Footer from "../../examples/Footer";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import IconButton from "@mui/material/IconButton";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
  EthDateTime,
  dayOfWeekString,
  limits,
} from "ethiopian-calendar-date-converter";
import AdminNavbar from "../../examples/Navbars/AdminNavbar";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const navigate = useNavigate();
  const [editedEmployee, setEditedEmployee] = useState(null);
  // const selectedEmployee = location.state?.selectedEmployee;
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

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
      await axios.post(`${BASE_URL}/auth/admin/deleteEmployee/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("arge");
      setEmployees(employees.filter((employee) => employee.id !== employeeId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.log("argeergt");
    }
  };
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
  return (
    <DashboardLayout>
      {/* <AdminNavbar /> */}
      <DashboardNavbar />
      <Sidenav />
      <MainDashboard />
      <MDBox
        mx={2}
        mt={3}
        py={3}
        mb={2}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="info"
      >
        <MDTypography variant="h6" color="white" textAlign="center">
          የሰራተኛ ዝርዝር
        </MDTypography>
      </MDBox>
      <TableContainer component={Box}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align={"center"}>
                <strong>መታወቂያ</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>ስም</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>ኢሜይል</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>ዲፓርትመንት</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>ዋና የሥራ ክፍል</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>የሚቀረው የገንዘብ መጠን</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>የገባበት ቀን</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>ድርጊት</strong>
              </TableCell>
            </TableRow>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell align={"center"}>{employee.id}</TableCell>
                <TableCell align={"center"}>{employee.name}</TableCell>
                <TableCell align={"center"}>{employee.email}</TableCell>
                <TableCell align={"center"}>{employee.department}</TableCell>
                <TableCell align={"center"}>{employee.position}</TableCell>
                <TableCell align={"center"}>
                  {employee.balance === null ? " - " : `${employee.balance} ብር`}
                </TableCell>
                <TableCell align={"center"}>
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
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={lastPage}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
          color="primary"
        />
      </Box>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ስረዛን ያረጋግጡ</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            እርግጠኛ ነህ ሰራተኛውን ማጥፋት ትፈልጋለህ{" "}
            {employeeToDelete ? `"${employeeToDelete.name}"` : ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            አይ
          </Button>
          <Button
            onClick={() =>
              handleDelete(employeeToDelete ? employeeToDelete.id : null)
            }
            color="secondary"
            autoFocus
          >
            አዎ
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default EmployeeList;
