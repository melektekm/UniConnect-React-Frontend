import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import MDBox from "../../../components/MDBox";
import axios from "axios";
import { BASE_URL } from "../../../appconfig";
import MDTypography from "../../../components/MDTypography";
import Icon from "@mui/material/Icon";
import { EthDateTime,dayOfWeekString , limits } from 'ethiopian-calendar-date-converter';
import CircularProgress from '@mui/material/CircularProgress';
import colors from "../../../assets/theme/base/colors";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';





function DepartmentOrderSummary() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;


  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [numPeople, setNumPeople] = useState("");
  const [numDays, setNumDays] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lunch, setLunch] = useState(false);
  const [lunchPrice, setLunchPrice] = useState("");
  const [refreshment, setRefreshment] = useState(false);
  const [refreshmentPrice, setRefreshmentPrice] = useState("");
  const [refreshmentPerDay, setRefreshmentPerDay] = useState("");
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);

  const fileInputStyle = {
    display: "inline-block",
    cursor: "pointer",
    padding: "10px 20px",
    backgroundColor: colors.dark.main, 
    color: "white",
    borderRadius: "5px",
    border: "1px solid #007bff"
  };
  

  const [errorMessage, setErrorMessage] = useState("");
  const [departId, setDepartId] = useState("");
  const [parentIdHolder, setParentIdHolder] = useState("0");
  const [parentNameHolder, setParentnameHolder] = useState("");
  const [expandedDepartments, setExpandedDepartments] = useState([]);

  const [totalPrice, setTotalPrice] = useState("");

  const [formData, setFormData] = useState({
    department_id: "",
    file: null,
    lunch_price_per_person: null,
    refreshment_price_per_person: null,
    refreshment_per_day: null,
    number_of_people: 0,
    number_of_days: 0,
    serving_date_start: null,
    serving_date_end: null,
    buyer_id: "",
    total_price: 0,
  });



  useEffect(() => {
    if (!refreshment) {
      setRefreshmentPrice("");
      setRefreshmentPerDay("");
    }
    if (!lunch) {
      setLunchPrice("");
    }
  }, [refreshment, lunch]);

  useEffect(() => {
    let calculatedTotalPrice =
      numPeople *
      numDays *
      ((lunchPrice !== "" && lunchPrice !== undefined && lunchPrice !== null
        ? parseFloat(lunchPrice)
        : 0) +
        parseFloat(refreshmentPrice * refreshmentPerDay));
    calculatedTotalPrice = isNaN(calculatedTotalPrice)
      ? 0
      : calculatedTotalPrice;
    setTotalPrice(calculatedTotalPrice);
 
  }, [numPeople, numDays, lunchPrice, refreshmentPrice, refreshmentPerDay]);

  const resetState = () => {
 
    setDepartmentName("");
    setNumPeople("");
    setNumDays("");
    setStartDate("");
    setEndDate("");
    setLunch(false);
    setLunchPrice("");
    setRefreshment(false);
    setRefreshmentPrice("");
    setRefreshmentPerDay("");
    setFile(null);
    setOpen(false);
    setDepartId(null), setParentIdHolder(0), setParentnameHolder("");
  };

  const handleDepartmentClick = (selectedDepartmentId, departmentName) => {
    setParentIdHolder(selectedDepartmentId);
    setParentnameHolder(departmentName);
    setDepartId(selectedDepartmentId);
  };

  const handleExpandCollapse = (departmentId) => {
    if (expandedDepartments.includes(departmentId)) {
      setExpandedDepartments((prevState) =>
        prevState.filter((id) => id !== departmentId)
      );
    } else {
      setExpandedDepartments((prevState) => [...prevState, departmentId]);
    }
  };

  async function getDepartments() {
    setLoading(true)
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
        const serverErrorMessages = error.response.data.errors;
        let errorMessage = "ምዝገባው አልተሳካም፦";

        for (const [key, value] of Object.entries(serverErrorMessages)) {
          errorMessage += `${key}: ${value[0]}, `;
        }

        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("ምዝገባው አልተሳካም፦ " + error);
      }
      setOpen(true);
    } finally {
     
    }
    setLoading(false);
  }

  useEffect(() => {
    getDepartments();
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
                  <Icon style={{ fontSize: "24px" }}><ChevronRightIcon />
               </Icon> // Replace with the expand icon
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

  const handleRequest = async () => {
    setLoading(true);
    try {
      const requestData = {
        department_id: departId,
        file: file,
        lunch_price_per_person: lunchPrice,
        refreshment_price_per_person: refreshmentPrice,
        refreshment_per_day: refreshmentPerDay,
        number_of_people: numPeople,
        number_of_days: numDays,
        serving_date_start: startDate,
        serving_date_end: endDate,
        buyer_id: userData.user.id,
        total_price: totalPrice,
      };

      const formDataObject = new FormData();
      formDataObject.append("file", formData.file);

      Object.keys(requestData).forEach((key) => {
        formDataObject.append(key, requestData[key]);
      });

      const response = await axios.post(
        `${BASE_URL}/placeDepartmentOrder`,
        formDataObject,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.message) {
        resetState();
        setErrorMessage("ትዛዙ ተፈጽሟል");
        setOpen(true);
      } else {
       
      }
    } catch (error) {
      setErrorMessage("error");
      setOpen(true);
  
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !departId ||
      !numPeople ||
      !numDays ||
      !startDate ||
      !endDate ||
      (lunch && !lunchPrice) ||
      (refreshment && (!refreshmentPrice || !refreshmentPerDay))
    ) {
      setErrorMessage("እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ።");
      setOpen(true);
    } else if (startDate > endDate) {
      setErrorMessage("የመጀመሪያ ቀን እና የመጨረሻ ቀን ያስተካክሉ");
      setOpen(true);
    }  else if (totalPrice < 0) {
      setErrorMessage("የተሳሳተ መረጃ አስገብተዋል");
      setOpen(true);
    }else {
      handleRequest();
    }
  };


  function convertToEthiopianDate(inputDate) {
    const parsedDate = new Date(inputDate);
  
    if (!isNaN(parsedDate.getTime())) {
  
      const ethDateTime = EthDateTime.fromEuropeanDate(parsedDate);
      const dayOfWeek = ethDateTime.getDay();
      const dayOfWeekStrings = ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡእ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'];
      const dayName = dayOfWeekStrings[dayOfWeek];
  
      const ethiopianDateStr = `${dayName}, ${ethDateTime.toDateString()}`;
    
      return `${ethiopianDateStr}`;
    } else {
    
      return 'Invalid Date';
    }
  }

  return (
    <Box style={{ flexGrow: 1, padding: "16px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card style={{ padding: "16px" }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      style={{ marginTop: "16px" }}
                    >
                      <InputLabel htmlFor="parent-department">
                        ዲፓርትመንት
                      </InputLabel>
                      <Select
                        value={departId}
                        onChange={(e) => handleDepartmentClick(e.target.value)}
                        label="ዋና ዲፓርትመንት"
                        inputProps={{
                          name: "parentId",
                          id: "parent-department",
                        }}
                        style={{ height: "46px" }} // Adjust the height as needed
                      >
                        <MenuItem value={parentIdHolder}>
                          የተመረጠ ዲፓርትመንት: {parentNameHolder}
                        </MenuItem>
                        {renderDepartments(departments, null)}
                      </Select>
                    </FormControl>
                  </MDBox>

                  <MDBox mb={2}>
                    <TextField
                      required
                      fullWidth
                      label="የሰዎች ብዛት"
                      type="number"
                      value={numPeople}
                      onChange={(e) => setNumPeople(e.target.value)}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <TextField
                      required
                      fullWidth
                      label="የቀናት ብዛት"
                      type="number"
                      value={numDays}
                      onChange={(e) => setNumDays(e.target.value)}
                    />
                  </MDBox>
                  <MDBox mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
  <TextField
    required
    fullWidth
    label="የመጀመሪያ ቀን"
    type="date"
    InputLabelProps={{ shrink: true }}
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
  />
  {startDate && (
    <MDTypography variant="body2" sx={{ marginLeft: 2 }}>
      {convertToEthiopianDate(startDate)}
    </MDTypography>
  )}
</MDBox>

<MDBox mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
  <TextField
    required
    fullWidth
    label="የመጨረሻ ቀን"
    type="date"
    InputLabelProps={{ shrink: true }}
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
  />
  {endDate && (
    <MDTypography variant="body2" sx={{ marginLeft: 2 }}>
      {convertToEthiopianDate(endDate)}
    </MDTypography>
  )}
</MDBox>
<MDBox mb={2}>
                <TextField
                  fullWidth
                  label="ጠቅላላ ዋጋ"
                  readOnly
                  value={
                    totalPrice !== null && totalPrice !== undefined
                      ? `${totalPrice}`
                      : ""
                  }
                />
              </MDBox>

                </Grid>
                <Grid item xs={12} sm={6} color ="dark">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={lunch}
                        onChange={(e) => setLunch(e.target.checked)}
                      />
                    }
                    label="ምሳ"
                  />
                  {lunch && (
                    <MDBox mb={2}>
                      <TextField
                        required
                        fullWidth
                        label="የምሳ ዋጋ ለአንድ ሰው"
                        type="number"
                        value={lunchPrice}
                        onChange={(e) => setLunchPrice(e.target.value)}
                      />
                    </MDBox>
                  )}

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={refreshment}
                        onChange={(e) => setRefreshment(e.target.checked)}
                      />
                    }
                    label="መክሰስ"
                  />
                  {refreshment && (
                    <>
                      <TextField
                        required
                        fullWidth
                        label="መክሰስ ዋጋ"
                        type="number"
                        value={refreshmentPrice}
                        onChange={(e) => setRefreshmentPrice(e.target.value)}
                        sx={{ marginBottom: 2 }}
                      />
                      <FormControl
                        fullWidth
                        required
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                      >
                        <InputLabel htmlFor="refreshment-per-day">
                          በቀን ውስጥ የመክሰስ መጠን
                        </InputLabel>
                        <Select
                          label="በቀን ውስጥ የመክሰስ መጠን"
                          id="refreshment-per-day"
                          value={refreshmentPerDay}
                          onChange={(e) => setRefreshmentPerDay(e.target.value)}
                          sx={{ height: "46px" }}
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  )}
<MDBox  mb={2} style={{ display: 'flex', alignItems: 'center' }}>
  <label htmlFor="fileInput" style={fileInputStyle}>
    <input
      type="file"
      id="fileInput"
      onChange={(e) => setFile(e.target.files[0])}
      accept="image/*,application/pdf"
      style={{ display: "none" }}
    />
    <span style={{ fontSize: "16px" }}>&#128206; {file ? file.name : "የደብዳቤ ፋይል ያስገቡ"}</span>
  </label>
  <MDTypography variant="body2" ml={1}>
 ከ 3 MB ያልበለጠ ፤  pdf,jpeg,jpg,png 
  </MDTypography>
</MDBox>








                </Grid>
              </Grid>

        
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <MDBox mb={1}>
  {loading ? (
          <MDBox textAlign="center">
          <CircularProgress color="info" />
          </MDBox>
        ) : (
          <MDButton
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleSubmit}
        >
          አስገባ
        </MDButton>
        )}
 
  </MDBox>
</div>

            </form>

          </Card>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{"ማስታወቂያ"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            color="light"
            variant="contained"
          >
            ዝጋ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DepartmentOrderSummary;

