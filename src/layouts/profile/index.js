import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
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
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../../examples/Navbars/AdminNavbar";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const navigate = useNavigate();
  const [editedEmployee, setEditedEmployee] = useState(null);
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken

  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

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
        console.log("Empty response");
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
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
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };
  const handleEdit = (employeeId) => {
    // Find the employee to edit
    const employeeToEdit = employees.find(
      (employee) => employee.id === employeeId
    );
    if (employeeToEdit) {
      // Step 3: Set the edited employee data in state
      setEditedEmployee(employeeToEdit);

      // Step 4: Navigate to the "Add Employee" page with the edited employee data
      navigate(`/addemployee?edit=true`, {
        state: { employee: employeeToEdit },
      });
    }
  };

  return (
    <DashboardLayout>
      <AdminNavbar />
      <MainDashboard />
      <Paper elevation={3} sx={{ padding: "16px" }}>
        <Typography variant="h5" gutterBottom>
          Employee List
        </Typography>
        <TableContainer component={Box}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Department</strong>
                </TableCell>
                <TableCell>
                  <strong>Position</strong>
                </TableCell>
                <TableCell>
                  <strong>Joined At</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.createdAt}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(employee.id)}>
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
      </Paper>
      <Footer />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the employee{" "}
            {employeeToDelete ? `"${employeeToDelete.name}"` : ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            No
          </Button>
          <Button
            onClick={() =>
              handleDelete(employeeToDelete ? employeeToDelete.id : null)
            }
            color="secondary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default EmployeeList;
