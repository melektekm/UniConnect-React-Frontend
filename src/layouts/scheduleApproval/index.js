import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TablePagination,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import AdminNavbar from "../../examples/Navbars/AdminNavbar";
import Footer from "../../examples/Footer";
import axios from "axios";
import Sidenav from "../../examples/Sidenav/AdminSidenav";
import { BASE_URL } from "../../appconfig";

function ApproveScheduleRequest() {
  const [scheduleRequests, setScheduleRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterDate, setFilterDate] = useState("");

  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  useEffect(() => {
    fetchScheduleRequests();
  }, [page, rowsPerPage, filterDate]);

  const fetchScheduleRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/schedule-requests`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          page: page + 1,
          limit: rowsPerPage,
          date: filterDate,
        },
      });
      setScheduleRequests(response.data.data);
    } catch (error) {
      setErrorMessage("Error fetching schedule requests: " + error.message);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/schedule-requests/${request.id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        fetchScheduleRequests();
        setErrorMessage("Request approved successfully.");
        setOpen(true);
      }
    } catch (error) {
      setErrorMessage("Error approving request: " + error.message);
      setOpen(true);
    }
  };

  const handleReject = async (request) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/schedule-requests/${request.id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        fetchScheduleRequests();
        setErrorMessage("Request rejected successfully.");
        setOpen(true);
      }
    } catch (error) {
      setErrorMessage("Error rejecting request: " + error.message);
      setOpen(true);
    }
  };

  const handleCloseDialog = () => setOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = (event) => {
    setFilterDate(event.target.value);
    setPage(0);
  };

  return (
    <DashboardLayout>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseDialog}>Close</MDButton>
        </DialogActions>
      </Dialog>

      <DashboardNavbar />
      {/* <AdminNavbar /> */}
      <Sidenav />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card style={{ border: "3px solid #206A5D" }}>
              <MDBox
                mx={2}
                mt={-5}
                py={3}
                px={2}
                variant="gradient"
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="dark"
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <MDTypography variant="h6" color="white">
                    Approve Schedule Requests
                  </MDTypography>
                </Grid>
              </MDBox>

              <MDBox pt={3} pb={3} px={2}>
                <TextField
                  label="Filter by Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={filterDate}
                  onChange={handleDateChange}
                  fullWidth
                  margin="normal"
                />
                {loading ? (
                  <CircularProgress />
                ) : (
                  <>
                    <TableContainer>
                      <Table>
                        <TableBody>
                          {scheduleRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>{request.course_code}</TableCell>
                              <TableCell>{request.course_name}</TableCell>
                              <TableCell>{request.classDays}</TableCell>
                              <TableCell>{request.classroom}</TableCell>
                              <TableCell>{request.labroom}</TableCell>
                              <TableCell>{request.labInstructor}</TableCell>
                              <TableCell>{request.classInstructor}</TableCell>
                              <TableCell>{request.schedule_type}</TableCell>
                              <TableCell>
                                <Button
                                  color="primary"
                                  onClick={() => handleApprove(request)}
                                  disabled={request.status === "approved"}
                                >
                                  Approve
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button
                                  color="secondary"
                                  onClick={() => handleReject(request)}
                                  disabled={request.status === "rejected"}
                                >
                                  Reject
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={scheduleRequests.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default ApproveScheduleRequest;
