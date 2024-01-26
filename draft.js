import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Pagination } from "@mui/material";
import Link from "@mui/material/Link";
import { Dropdown } from "@mui/base/Dropdown";
import { FormControl, MenuItem, Select } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

import { connect } from "react-redux";
import {
  setNewAssignmentCount,
} from "../../stateManagment/AssignmentSlice";

const AssignmentPage = ({ setNewAssignmentCount }) => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [assignmentStatus, setAssignmentStatus] = useState({});
  const [perPage, setPerPage] = useState(20);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const accessToken = userData.accessToken;

  const fetchAssignments = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${BASE_URL}/assignments?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            per_page: perPage,
          },
        }
      );
      const newAssignmentsCount = response.data.data.filter(
        (assignment) => !assignmentStatus[assignment.id]
      ).length;

      setNewAssignmentCount(newAssignmentsCount);

      const newAssignmentsStatus = {};
      response.data.data.forEach((assignment) => {
        newAssignmentsStatus[assignment.id] = assignment.status;
      });
      setAssignmentStatus(newAssignmentsStatus);
      setAssignments(response.data.data);

      let filteredAssignments = response.data.data;
      if (selectedStatus === "Sent") {
        filteredAssignments = filteredAssignments.filter(
          (assignment) => assignment.status === "Sent"
        );
      } else if (selectedStatus === "Unsent") {
        filteredAssignments = filteredAssignments.filter(
          (assignment) => assignment.status === "Unsent"
        );
      }

      setFilteredAssignments(filteredAssignments);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, [currentPage, perPage]);

  const handleStatusFiltering = (type) => {
    if (type === "Sent") {
      setSelectedStatus("Sent");
      setFilteredAssignments(assignments.filter((assignment) => assignment.status === "Sent"));
    } else if (type === "Unsent") {
      setSelectedStatus("Unsent");
      setFilteredAssignments(assignments.filter((assignment) => assignment.status === "Unsent"));
    } else {
      setSelectedStatus("All");
      setFilteredAssignments([]);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
         <MDButton
            style={{
              marginRight: "30px",
              color: "white",
              backgroundColor: "#F44336",
              fontWeight: "bold",
            }}
            variant={selectedMenuType === "Sent" ? "contained" : "outlined"}
            onClick={() => handleStatusFiltering("Sent")}
          >
            Sent
          </MDButton>

          <MDButton
            style={{
              marginRight: "30px",
              color: "black",
              backgroundColor: " #FFC107",
              fontWeight: "bold",
            }}
            variant={
              selectedMenuType === "Unsent" ? "contained" : "outlined"
            }
            onClick={() => handleStatusFiltering("Unsent")}
          >
            Unsent
          </MDButton>
          <MDButton
            style={{ marginRight: "30px" }}
            variant="outlined"
            onClick={() => handleStatusFiltering("All")}
          >
            All
          </MDButton>
      <TableContainer>
        <Table>
          <TableBody
            sx={{
              fontSize: "1.7em",
              color: "white !important",
            }}
          >
            <TableRow sx={{ backgroundColor: "#158467" }}>
              <TableCell align="center">
                <h3 style={{ color: "dark" }}>Assignment ID </h3>
              </TableCell>
              <TableCell align="center">
                <h3 style={{ color: "dark" }}>Assignment Name</h3>
              </TableCell>
              <TableCell align="center">
                <h3 style={{ color: "dark" }}>Course Name</h3>
              </TableCell>
              <TableCell align="center">
                <h3 style={{ color: "dark" }}>Due Date</h3>
              </TableCell>
              <TableCell align="center">
                <h3 style={{ color: "dark" }}>Uploaded File</h3>
              </TableCell>
              {/* <TableCell align="center">
                <h3 style={{ color: "dark" }}>የትዕዛዝ ሁኔታ</h3>
              </TableCell> */}
              {showEditColumn && <TableCell></TableCell>}
            </TableRow>

            {searchedOrder.length > 0 ? (
              searchedOrder.map((order) => (
                <TableRow key={order.id} sx={{ backgroundColor: "#158467" }}>
                  <TableCell align="center">
                    <h4 style={{ color: "#07031A" }}>{order.coupon_code} </h4>
                  </TableCell>
                  <TableCell align="center">
                    <h4 style={{ color: "#07031A" }}>{order.employee_name}</h4>
                  </TableCell>
                  <TableCell align="center">
                    <h4 style={{ color: "black" }}>{order.total_price}</h4>
                  </TableCell>
                  <TableCell align="center">
                    <h4>{convertToEthiopianDate(order.created_at)}</h4>
                    <h4>({order.created_at})</h4>
                  </TableCell>
                  <TableCell align="center">
                    <ul>
                      {order.menu_items.map((item, index) => (
                        <li key={index}>
                          {item.name} ("ብዛት": {item.quantity})
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell align="center">
                    <Badge
                        style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                      <div
                          style={{
                            width: 25,
                            height: 25,

                            borderRadius: "50%",
                            backgroundColor:
                                ordersStatus[order.id] === "UnServed"
                                    ? "#f44336"
                                    : ordersStatus[order.id] === "Processing"
                                        ? "#ff9800"
                                        : "#4caf50",
                            marginRight: 8,
                          }}
                      />
                      <MDTypography variant="h5">
                        {order.id in ordersStatus?
                            ordersStatus[order.id] === "UnServed"
                                ? "ያልቀረበ"
                                : ordersStatus[order.id] === "Processing"
                                    ? "እየተዘጋጀ ያለ"
                                    : "የቀረበ"
                            : order.status}
                      </MDTypography>


                    </Badge>
                  </TableCell>
                  {showEditColumn && ordersStatus[order.id] !== "Served" && (
                    <TableCell>

                      <IconButton
                        onClick={(event) => handleClick(event, order.id)}
                      >
                        <EditIcon color="primary" />
                      </IconButton>

                      <Menu
                        id={`simple-menu-${order.id}`}
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem
                          onClick={(event) =>
                            handleOrderStatusChange(event, order.id)
                          }
                          data-value="UnServed"
                        >
                          ያልቀረበ
                        </MenuItem>
                        <MenuItem
                          onClick={(event) =>
                            handleOrderStatusChange(event, order.id)
                          }
                          data-value="Processing"
                        >
                          እየተዘጋጀ ነው
                        </MenuItem>
                        <MenuItem
                          onClick={(event) =>
                            handleOrderStatusChange(event, order.id)
                          }
                          data-value="Served"
                        >
                          ምግቡ ቀርቦላቸዋል
                        </MenuItem>
                      </Menu>

                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              selectedMenuType === "All" || filteredOrders.length > 0 ? (
                (Array.isArray(filteredOrders) && filteredOrders.length > 0
                  ? filteredOrders
                  : orders
                ).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell align="center">
                      <h4 style={{ color: "#07031A" }}>{order.coupon_code}</h4>
                    </TableCell>
                    <TableCell align="center">
                      <h4 style={{ color: "#07031A" }}>
                        {" "}
                        {order.employee_name}
                      </h4>
                    </TableCell>
                    <TableCell align="center">
                      <h4 style={{ color: "black" }}>
                        {order.total_price} ብር{" "}
                      </h4>
                    </TableCell>
                    <TableCell align="center">
                      <h4 style={{ color: "#07031A" }}>
                        {convertToEthiopianDate(order.created_at)}
                      </h4>
                      <h4 style={{ color: "#07031A" }}>({order.created_at})</h4>
                    </TableCell>
                    <TableCell align="center">
                      <ol style={{ color: "#07031A" }}>
                        {order.menu_items.map((item, index) => (
                          <li key={index}>
                            <h4 style={{ color: "#07031A" }}>
                              {item.name} (ብዛት: {item.quantity})
                            </h4>
                          </li>
                        ))}
                      </ol>
                    </TableCell>
                    <TableCell align="center">
                      <Badge
                          style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                      >
                        <div
                            style={{
                              width: 25,
                              height: 25,

                              borderRadius: "50%",
                              backgroundColor:
                                  ordersStatus[order.id] === "UnServed"
                                      ? "#f44336"
                                      : ordersStatus[order.id] === "Processing"
                                          ? "#ff9800"
                                          : "#4caf50",
                              marginRight: 8,
                            }}
                        />
                        <MDTypography variant="h5">
                          {order.id in ordersStatus?
                              ordersStatus[order.id] === "UnServed"
                                  ? "ያልቀረበ"
                                  : ordersStatus[order.id] === "Processing"
                                      ? "እየተዘጋጀ ያለ"
                                      : "የቀረበ"
                              : order.status}
                        </MDTypography>


                      </Badge>
                    </TableCell>
                    {showEditColumn && ordersStatus[order.id] !== "Served" && (
                      <TableCell>
                        <IconButton
                          onClick={(event) => handleClick(event, order.id)}
                        >
                          <EditIcon color="primary" />
                        </IconButton>

                        <Menu
                          id={`simple-menu-${order.id}`}
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                        >
                          <MenuItem
                            onClick={(event) =>
                              handleOrderStatusChange(event, order.id)
                            }
                            data-value="UnServed"
                          >
                            ያልቀረበ
                          </MenuItem>
                          <MenuItem
                            onClick={(event) =>
                              handleOrderStatusChange(event, order.id)
                            }
                            data-value="Processing"
                          >
                            እየተዘጋጀ ነው
                          </MenuItem>
                          <MenuItem
                            onClick={(event) =>
                              handleOrderStatusChange(event, order.id)
                            }
                            data-value="Served"
                          >
                            ምግቡን ቀርቦላቸዋል
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>ምንም ትዕዛዞች አልተገኙም</TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell colSpan={7}>ምንም ትዕዛዞች አልተገኙም</TableCell>
              </TableRow>
            )}
            {searchedOrder.length > 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <MDButton
                    variant="contained"
                    onClick={() => setSearchedOrder([])}
                    color={"secondary"}
                  >
                    የፍለጋ ውጤቶችን ሰርዝ
                  </MDButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {loading ?
        <MDBox textAlign = "center">

        <CircularProgress color="primary"/>

</MDBox>:''}
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          component={Link}
          count={lastPage}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </Box>
      <Dialog
        open={openEmptySearchDialog}
        onClose={() => setOpenEmptySearchDialog(false)}
        aria-labelledby="empty-search-dialog-title"
        aria-describedby="empty-search-dialog-description"
        PaperProps={{ sx: { padding: "20px" } }}
      >
        <DialogTitle id="empty-search-dialog-title">{"ማስታወቂያ"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="empty-search-dialog-description">
            {emptySearchErrorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={() => {
              
              setOpenEmptySearchDialog(false);
              setEmptySearchErrorMessage("");
              
            }}
            color="primary"
            variant="contained"
          >
            ዝጋ
          </MDButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openNoMatchDialog}
        onClose={() => setOpenNoMatchDialog(false)}
        aria-labelledby="no-match-dialog-title"
        aria-describedby="no-match-dialog-description"
        PaperProps={{ sx: { padding: "20px" } }}
      >
        <DialogTitle id="no-match-dialog-title">{"ማስታወቂያ"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="no-match-dialog-description">
            {noMatchErrorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenNoMatchDialog(false);
              setNoMatchErrorMessage("");
            }}
            color="error"
            variant="text"
          >
            ዝጋ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
const mapDispatchToProps = {
  setNewOrderCount,
};

export default connect(null, mapDispatchToProps)(OrderTables);
