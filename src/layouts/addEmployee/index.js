import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MainDashboard from "../../layouts/MainDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import AdminNavbar from "../../examples/Navbars/AdminNavbar";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import Icon from "@mui/material/Icon";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';


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
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";

function AddEmployee() {
  const location = useLocation();
  const selectedEmployee = location.state?.selectedEmployee;
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    department: "",
    position: "",
    email: "",
  });

  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [loading, setLoading] = useState(false);
  const CircularLoader = () => <CircularProgress size={24} color="inherit" />;
  const [departments, setDepartments] = useState([]);
  const [expandedDepartments, setExpandedDepartments] = useState([]);
  const [parentId, setParentId] = useState("");
  const [parentIdHolder, setParentIdHolder] = useState("1");
  const [parentNameHolder, setParentnameHolder] = useState("");
  const [department, setDepartment] = useState(
    selectedEmployee ? selectedEmployee.department : null
  );

  // ...

  // Get the access token
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  const handleExpandCollapse = (departmentId) => {
    if (expandedDepartments.includes(departmentId)) {
      setExpandedDepartments((prevState) =>
        prevState.filter((id) => id !== departmentId)
      );
    } else {
      setExpandedDepartments((prevState) => [...prevState, departmentId]);
    }
  };
  // const handleDepartmentClick = (selectedDepartmentId, departmentName) => {
  //   setParentIdHolder(selectedDepartmentId);
  //   setParentnameHolder(departmentName);
  //   setParentId(selectedDepartmentId);
  //   setDepartment(parseInt(parentId));
  // };
  const handleDepartmentClick = ({ update, selectedDepartmentId, departmentName }) => {
  
    setDepartment(selectedDepartmentId)
    setParentIdHolder(selectedDepartmentId);
    setParentnameHolder(departmentName);
    setParentId(selectedDepartmentId);
  
 
   if(update === "true"){

  setFormValues({
    ...formValues,
    department: selectedEmployee.departmentID,
    name: selectedEmployee.name,
    position: selectedEmployee.position,
    email: selectedEmployee.email,
  });
  
 
   }
    
  };

  async function getDepartments() {
    try {
      setLoading(true);
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
        let errorMessage = "ምዝገባው አልተሳካም:";

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
    // handleDepartmentClick("1");
  }, []);

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
              onClick={() => {
                handleDepartmentClick(
                  {
                    selectedDepartmentId: department.id,
                    departmentName:department.name
                  } );
                  
                setFormValues({
                  ...formValues,
                  department: e.target.value,
                });
              }}
              
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

  const [formValues, setFormValues] = useState({});



  useEffect(() => {
    if (selectedEmployee) {
      setFormValues(selectedEmployee);
      setDepartment(selectedEmployee.departmentId);
      setParentIdHolder(selectedEmployee.departmentId);
      setParentId(selectedEmployee.departmentId);

      handleDepartmentClick({
        update:"true",
        selectedDepartmentId: selectedEmployee.departmentId,
        departmentName:selectedEmployee.department
      });
    }
  }, [selectedEmployee]);

  const handleRegister = async () => {
  
    formValues.department = parentId;

    const newErrorMessages = {
      name: formValues.name ? "" : "ስም ያስፈልጋል።",
      department: formValues.department ? "" : "ዲፓርትመንት ያስፈልጋል",
      position: formValues.position ? "" : "ሥራ ቦታ ያስፈልጋል።",
      email: formValues.email ? "" : "ኢሜል ያስፈልጋል።",
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
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("email", formValues.email);
      formData.append("department", formValues.department);
      formData.append("position", formValues.position);

      if (selectedEmployee) {
      
     
        response = await axios.post(
          `${BASE_URL}/auth/admin/updateEmployee/${selectedEmployee.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Use the API endpoint for adding a new employee
        response = await axios.post(
          `${BASE_URL}/auth/admin/addEmployee`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      if (response.data) {
        resetState();

        setErrorMessage({});
        setSuccessMessage(
          ` ሰራተኛውን በተሳካ ሁኔታ! ${selectedEmployee ? " ተስተካክሏል" : "ገብቷል"}`
        );

        setOpen(true);
      } else {
        setErrorMessage("ምላሽ ምንም አልያዘም።");
        setOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Parse the error messages from the server's response
        const serverErrorMessages = error.response.data.errors;
        let errorMessage = "ምዝገባው አልተሳካም፦ ";

        for (const [key, value] of Object.entries(serverErrorMessages)) {
          errorMessage += `${key}: ${value[0]}, `;
        }

        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("ምዝገባው አልተሳካም፦ " + error);
      }
      setOpen(true);
    } finally {
      // Reset loading state when registration finishes (whether it succeeded or failed)
      setLoading(false);
    }
  };


  const resetState = () => {
    setFormValues({
      name: "",
      department: "",
      position: "",
      email: "",
    });
    setParentId("");
    setExpandedDepartments([]);
    setParentId("")
    setParentIdHolder("");
    setParentnameHolder("");
    setDepartment(null);
  };

  return (
    <DashboardLayout>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {successMessage ? "ማረጋገጫ" : "ማስታወቂያ"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {successMessage || errorMessage}
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
            ዝጋ
          </Button>
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
                  {selectedEmployee ? "የሰራተኛ መረጃን ቀይር" : "ሰራተኛን ጨምር"}
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={2}>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      name="name"
                      label="ስም"
                      variant="outlined"
                      fullWidth
                      value={formValues.name}
                      onChange={(e) =>
                        setFormValues({ ...formValues, name: e.target.value })
                      }
                      margin="normal"
                      required
                      error={!!errorMessages.name}
                      helperText={errorMessages.name}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                                    <FormControl variant="outlined" fullWidth style={{ marginTop: "16px" }}>
                    <InputLabel htmlFor="parent-department">ዲፓርትመንት</InputLabel>
                    <Select
                      value={parentId}
                   
                      
                      label="ዲፓርትመንት"
                      inputProps={{
                        name: "parentId",
                        id: "parent-department",
                      }}
                      style={{ minHeight: "45px" }}
                    >
                      <MenuItem value={parentIdHolder}>
                        የተመረጠ ዲፓርትመንት {parentNameHolder}
                      </MenuItem>
                      {renderDepartments(departments, null)}
                    </Select>
                    </FormControl>

                  </MDBox>

                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="ሥራ ቦታ"
                      variant="outlined"
                      name="position"
                      fullWidth
                      value={formValues.position}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          position: e.target.value,
                        })
                      }
                      margin="normal"
                      required
                      error={!!errorMessages.position}
                      helperText={errorMessages.position}
                    />
                  </MDBox>
                  <MDInput
                    type="email"
                    label="ኢሜይል"
                    name="email"
                    variant="outlined"
                    fullWidth
                    value={formValues.email}
                    onChange={(e) =>
                      setFormValues({ ...formValues, email: e.target.value })
                    }
                    margin="normal"
                    required
                    error={!!errorMessages.email}
                    helperText={errorMessages.email}
                   
                  />
                  <MDBox mt={4} mb={1} textAlign="center">
                    <MDButton
                   
                      color="primary"
                      onClick={handleRegister}
                    >
                      {loading ? (
                        <CircularLoader />
                      ) : selectedEmployee ? (
                        "ቀይር"
                      ) : (
                        "ጨምር"
                      )}
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

export default AddEmployee;
