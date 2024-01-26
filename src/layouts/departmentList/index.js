import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import MainDashboard from "../MainDashboard";
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
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../../examples/Navbars/AdminNavbar";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import CircularProgress from "@mui/material/CircularProgress";

function Department() {
  const [department, setDepartment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const navigate = useNavigate();
  const [departmentToEdit, setEditedDepartment] = useState(null);
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDepartments();
  }, [currentPage]);
  useEffect(() => {
    if (selectedDepartment) {
      setFormValues(selectedDepartment);
    }
  }, [selectedDepartment]);
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const getDepartments = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/get-all-paginated-departments?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data) {
        setDepartment(response.data["data"]);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
      } else {
        setErrorMessage("ክፍሎችን ማምጣት አልተሳካም።");
        // setOpen(true);
      }
    } catch (error) {
      setErrorMessage("ክፍሎችን ማምጣት አልተሳካም።: " + error);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const renderDepartments = (departmentsToRender) => {
    if (!Array.isArray(departmentsToRender)) {
      return null;
    }
  };

  const handleDeleteDialogOpen = (departmentId) => {
    const departmentToDelete = department.find(
      (dept) => dept.id === departmentId
    );
    setDepartmentToDelete(departmentToDelete);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async (departmentId) => {
    if (!departmentId) return;

    try {
      await axios.post(`${BASE_URL}/delete-department/${departmentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Update the department list by removing the deleted department
      setDepartment((prevDepartments) =>
        prevDepartments.filter((dept) => dept.id !== departmentId)
      );

      setDeleteDialogOpen(false); // Close the dialog
    } catch (error) {
      // Handle the error, e.g., display an error message to the user
    }
  };

  function handleEdit(updatedDepartment) {
    if (!selectedDepartment) {
      // If departmentToEdit is null, the user is adding a new department
      // Add the new department to the department list
      setDepartment([...department, updatedDepartment]);
    } else {
      // If departmentToEdit is not null, the user is updating an existing department
      // Update the department and set departmentToEdit to null
      setDepartment(
        department.map((dept) =>
          dept.id === updatedDepartment.id ? updatedDepartment : dept
        )
      );
      setSelectedDepartment(null);
    }
    navigate("/adddepartment", {
      state: { selectedDepartment: updatedDepartment },
    });
  }

  return (
    <DashboardLayout>
      <AdminNavbar />
      <Sidenav />
      <MainDashboard />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
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
                  የተመዘገቡ የሥራ ክፍሎች
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <strong>መታወቂያ</strong>
                          </TableCell>
                          <TableCell>
                            <strong>ስም</strong>
                          </TableCell>
                          <TableCell>
                            <strong>ዋና የሥራ ክፍል</strong>
                          </TableCell>
                          <TableCell>
                            <strong>እርምጃዎች</strong>
                          </TableCell>
                        </TableRow>
                        {department ? (
                          department.map((dept) => (
                            <TableRow key={dept.id}>
                              <TableCell>{dept.id}</TableCell>
                              <TableCell>{dept.name}</TableCell>
                              <TableCell>{dept.parent_id}</TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleEdit(dept)}>
                                  <EditIcon color="primary" />
                                </IconButton>
                                <IconButton
                                  onClick={() =>
                                    handleDeleteDialogOpen(dept.id)
                                  }
                                >
                                  <DeleteIcon color="error" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4}>
                              ምንም ዲፓርትመንት አልተገኘም።
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <Box mt={2} display="flex" justifyContent="center">
                  <Pagination
                    count={lastPage}
                    page={currentPage}
                    onChange={handlePageChange}
                  />
                </Box>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ስረዛን ያረጋግጡ</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            እርግጠኛ ነዎት ዲፓርትመንት መሰረዝ ይፈልጋሉ{" "}
            {departmentToDelete ? `${departmentToDelete.name}` : ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            አይ
          </Button>
          <Button
            onClick={() =>
              handleDelete(departmentToDelete ? departmentToDelete.id : null)
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

export default Department;
