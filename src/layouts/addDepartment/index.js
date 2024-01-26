import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import AdminNavbar from "../../examples/Navbars/AdminNavbar";
import Footer from "../../examples/Footer";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";
import { BASE_URL } from "../../appconfig";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function AddDepartment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if we are creating a new department or editing an existing one.
     const [isEditMode ,setIsEditMode ] = useState(false);
  const departmentToEdit = location.state?.selectedDepartment ;

  // Initialize state based on the mode.
  const [name, setName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [parentId, setParentId] = useState("");
  const [parentIdHolder, setParentIdHolder] = useState("0");
  const [parentNameHolder, setParentnameHolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [departments, setDepartments] = useState([]);
  const [expandedDepartments, setExpandedDepartments] = useState([]);

  const lettersOnlyRegex = /^[\u1200-\u137F\s]*$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "department") {
      if (value === "" || lettersOnlyRegex.test(value)) {
        // Only update the state if the input is empty or contains only letters
        setName(e.target.value);
      }
    } else {
      // Update the state directly for other fields
      setName(e.target.value);
    }
  };

  // Populate form fields with data if in edit mode.
  useEffect(() => {

    if (departmentToEdit) {
      setIsEditMode(true);
    
      setName(departmentToEdit.name);
      setParentId(departmentToEdit.parent_id);
      setParentIdHolder(departmentToEdit.parent_id);
      setParentnameHolder(departmentToEdit.name);
    }
    // You can fetch additional data or set state based on the mode here.
  }, [isEditMode, departmentToEdit]);

  // Function to handle expanding/collapsing departments
  const handleExpandCollapse = (departmentId) => {
    if (expandedDepartments.includes(departmentId)) {
      setExpandedDepartments((prevState) =>
        prevState.filter((id) => id !== departmentId)
      );
    } else {
      setExpandedDepartments((prevState) => [...prevState, departmentId]);
    }
  };

  // Function to handle department click
  const handleDepartmentClick = (selectedDepartmentId, departmentName) => {
    setParentIdHolder(selectedDepartmentId);
    setParentnameHolder(departmentName);
    setParentId(selectedDepartmentId);
  };

  // Function to get departments
  async function getDepartments() {
    try {
      const response = await axios.get(`${BASE_URL}/get-all-departments`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data) {
        setDepartments(response.data.departments);
      } else {
        setErrorMessage("የምዝገባ ምላሽ ምንም አልያዘም።");
        setOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Parse the error messages from the server's response
        const serverErrorMessages = error.response.data.errors;
        let errorMessage = "ምዝገባው አልተሳካም: ";

        for (const [key, value] of Object.entries(serverErrorMessages)) {
          errorMessage += `${key}: ${value[0]}, `;
        }

        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("ምዝገባው አልተሳካም: " + error);
      }
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDepartments();
  }, []);

  // Function to render departments
  const renderDepartments = (
    departmentsToRender,
    parentIdNum = null,
    nestingLevel = 0
  ) => {
    if (!Array.isArray(departmentsToRender)) {
      return null;
    }

    const departmentItems = [];

    departmentsToRender.forEach((department) => {
      const isRootDepartment = department.parent_id === 1;
      const hasSubDepartments = departments.some(
        (dep) => dep.parent_id === department.id
      );

      if (parentIdNum === department.parent_id) {
        const menuItem = (
          <div
            key={department.id}
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "1px",
            }}
          >
            <MenuItem
              value={"1"}
              key={department.id}
              style={{
                paddingLeft: parentIdNum ? `${20 + nestingLevel * 15}px` : "0",
                minWidth: `${department.name.length * 10}px`, // Adjust the factor as needed
              }}
              onClick={() =>
                handleDepartmentClick(department.id, department.name)
              }
            >
              {department.name}
            </MenuItem>
            {hasSubDepartments && (
              <span
                onClick={() => handleExpandCollapse(department.id)}
                style={{
                  cursor: "pointer",
                  marginLeft: "5px",
                  fontWeight: "bold",
                  fontSize: "1.2em",
                }}
              >
                {expandedDepartments.includes(department.id) ? (
                  <Icon style={{ fontSize: "44px", color: "red" }}>
     <ArrowDropDownIcon />
                  </Icon> // Replace with the collapse icon
                ) : (
                  <Icon style={{ fontSize: "24px" }}><ChevronRightIcon /></Icon> // Replace with the expand icon
                )}
              </span>
            )}
          </div>
        );

        departmentItems.push(menuItem);

        if (expandedDepartments.includes(department.id)) {
          const childDepartments = departments.filter(
            (dep) => dep.parent_id === department.id
          );

          const childItems = renderDepartments(
            childDepartments,
            department.id,
            nestingLevel + 1
          );
          departmentItems.push(...childItems);
        }
      }
    });

    return departmentItems;
  };

  const handleAddDepartment = async () => {
  

    const newErrorMessages = {
      name: name ? "" : "ስም ያስፈልጋል።",
  
      parent_id: parentId ? "" : "ዋና ዲፓርትመንት መታወቂያ ያስፈልጋል",
     
    };
    setErrorMessages(newErrorMessages);

    if (Object.values(newErrorMessages).some((message) => message !== "")) {
      setErrorMessage("እባክዎ ሁሉንም መስኮች ይሙሉ።");
      setOpen(true);
      return;
    }

    setLoading(true);
    try {
      let response;
      const departmentData = {
        name: name,
        manager_id: managerId,
        parent_id: parentId,
       
      };

      if (isEditMode) {
    
        response = await axios.post(
          `${BASE_URL}/update-department/${departmentToEdit.id}`,
          departmentData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else {
     
        response = await axios.post(
          `${BASE_URL}/create-department`,
          departmentData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }

      if (response.data) {
        setLoading(false);
        setName("");
        setManagerId("");
        setParentId("");
        setErrorMessage(`${isEditMode ? "ቀይር" : "ይፍጠሩ"} ዲፓርትመንት ተሳክቷል!`);
        getDepartments();
        setOpen(true);
      } else {
        setErrorMessage("ምላሽ ምንም አልያዘም።");
        setOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Parse the error messages from the server's response
        const serverErrorMessages = error.response.data.errors;
        let errorMessage = `${isEditMode ? "ቀይር" : "ይፍጠሩ"}አልተሳካም `;

        for (const [key, value] of Object.entries(serverErrorMessages)) {
          errorMessage += `${key}: ${value[0]}, `;
        }

        setErrorMessage(errorMessage);
      } else {
        setErrorMessage(`${isEditMode ? "ቀይር" : "ይፍጠሩ"} አልተሳካም ` + error);
      }
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"ማስታወቂያ"}</DialogTitle>
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
            autoFocus
          >
            ዝጋ
          </MDButton>
        </DialogActions>
      </Dialog>
      <AdminNavbar />
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
                  {isEditMode ? "ዲፓርትመንትን ቀይር" : "ዲፓርትመንት ጨምር"}
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="ዲፓርትመንት ስም"
                      variant="outlined"
                      fullWidth
                      value={name}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                      error={!!errorMessages.name}
                      helperText={errorMessages.name}
                      name="department"
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      style={{ marginTop: "16px" }}
                    >
                      <InputLabel htmlFor="parent-department">
                        ዋና ዲፓርትመንት
                      </InputLabel>
                      <Select
                        value={parentId}
                        onChange={(e) => handleDepartmentClick(e.target.value)}
                        label="ዋና ዲፓርትመንት"
                        inputProps={{
                          name: "parentId",
                          id: "parent-department",
                        }}
                        style={{ height: "56px" }} // Adjust the height as needed
                      >
                        <MenuItem value={parentIdHolder}>
                          የተመረጠ ዲፓርትመንት: {parentNameHolder}
                        </MenuItem>
                        {renderDepartments(departments, null)}
                      </Select>
                    </FormControl>
                  </MDBox>
                  <MDBox mt={4} mb={1} textAlign="center">
                    <MDButton
                    
                      color="primary"
                      onClick={handleAddDepartment}
                    >
                      {loading ? <CircularProgress /> : isEditMode ? "አስተካክል" : "አስገባ"}

                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AddDepartment;
