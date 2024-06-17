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
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../../examples/Navbars/AdminNavbar";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import BlockIcon from "@mui/icons-material/Block";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";

function EmployeeList() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const [task, setTask] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();
  const [editedUser, setEditedUser] = useState(null);
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    if (selectedUser) {
      setFormValues(selectedUser);
    }
  }, [selectedUser]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/auth/admin/getAllUsers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const handleDeleteDialogOpen = (userId) => {
    const user = users.find((user) => user.id === userId);
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = async (userId, task) => {
    setLoading(true);

    if (!userId) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/admin/deleteUser/${userId}`,
        { task: task },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOpen(true);

      if (response.data.message) {
        if (task === 1) {
          setErrorMessage("Account was deleted successfully");
        }
      } else {
        setErrorMessage("Network problem. please try again");
      }

      setUsers(users.filter((user) => user.id !== userId));
      setDeleteDialogOpen(false);
    } catch (error) {
      setOpen(true);
      setErrorMessage("Network problem. please try again");
      setDeleteDialogOpen(false);
    }
    fetchUsers();
  };

  function convertToEthiopianDate(inputDate) {
    const parsedDate = new Date(inputDate);

    if (!isNaN(parsedDate.getTime())) {
      const ethDateTime = EthDateTime.fromEuropeanDate(parsedDate);
      const dayOfWeek = ethDateTime.getDay();
      const dayOfWeekStrings = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = dayOfWeekStrings[dayOfWeek];

      const ethiopianDateStr = `${dayName}, ${ethDateTime.toDateString()}`;

      return `${ethiopianDateStr}`;
    } else {
      return "Invalid Date";
    }
  }

  function getAccountType(role) {
    let type = "";
    if (role === "instructor") {
      type = "Instructor";
    } else if (role === "admin") {
      type = "Admin";
    } else if (role === "coordinator") {
      type = "Coordinator";
    } else if (role === "student") {
      type = "Student";
    } else {
      type = "Dean";
    }
    return type;
  }

  function handleEdit(updatedUser) {
    if (!selectedUser) {
      setUsers([...users, updatedUser]);
    } else {
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setSelectedUser(null);
    }
    navigate("/addUser", { state: { selectedUser: updatedUser } });
  }

  return (
    <DashboardLayout>
      <AdminNavbar />
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
          User List
        </MDTypography>
      </MDBox>
      {loading ? (
        <MDBox textAlign="center">
          <CircularProgress color="info" />
        </MDBox>
      ) : (
        ""
      )}
      <TableContainer component={Box}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align={"center"}>
                <strong>ID</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>Name</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>Email</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>Role</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>Date of Entry</strong>
              </TableCell>
              <TableCell align={"center"}>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell align={"center"}>{user.id}</TableCell>
                <TableCell align={"center"}>{user.name}</TableCell>
                <TableCell align={"center"}>{user.email}</TableCell>
                <TableCell align={"center"}>{user.role}</TableCell>
                <TableCell align={"center"}>
                  {convertToEthiopianDate(user.created_at)}
                </TableCell>
                <TableCell align={"center"}>
                  <MDBox style={{ display: "flex", alignItems: "bottom" }}>
                    <IconButton>
                      {user.status ? (
                        <BlockIcon
                          onClick={() => {
                            setTask(0);
                            handleDeleteDialogOpen(user.id);
                          }}
                          color="error"
                        />
                      ) : (
                        <DeleteIcon
                          onClick={() => {
                            setTask(1);
                            handleDeleteDialogOpen(user.id);
                          }}
                          color="error"
                        />
                      )}
                    </IconButton>
                    <IconButton>
                      {!(user.role === "user") ? (
                        <Link>
                          {" "}
                          <RefreshIcon
                            onClick={() => {
                              setTask(2);
                              handleDeleteDialogOpen(user.id);
                            }}
                            color="primary"
                          />
                        </Link>
                      ) : (
                        ""
                      )}
                    </IconButton>
                  </MDBox>
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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="alert-dialog-title">{"Notification"}</DialogTitle>
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
            variant="contained"
            style={{ borderRadius: "10%" }}
          >
            <h4 style={{ color: "white" }}> Close </h4>
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <span>Account Delete</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span>The user is about to be deleted. Are you sure?</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <MDButton
            onClick={handleDeleteDialogClose}
            color="error"
            style={{ borderRadius: "10px" }}
          >
            No
          </MDButton>
          <MDButton
            onClick={() =>
              handleDelete(userToDelete ? userToDelete.id : null, task)
            }
            color="primary"
            style={{ borderRadius: "10px" }}
          >
            Yes
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default EmployeeList;
