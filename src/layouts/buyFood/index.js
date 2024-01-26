import React, { useState, useEffect } from "react";
import CashierDashboard from "../CashierDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import OrderSummary from "./buyFoodUi";
import { Select, MenuItem } from "@mui/material";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import Sidenav from "../../examples/Sidenav/AdminSidenav";

function BuyFood() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const [isEmployee, setIsEmployee] = useState(true);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedView, setSelectedView] = useState("Employee");
  const [inputValues, setInputValues] = useState({});
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const initialData = {
    totalPrice: 0,
    employeeId: "",
    guestName: "",
  };
  const [formData, setFormData] = useState({
    total_price: 0,
    employee_id: "",
    menu_items: [],
  });

  const lettersOnlyRegex = /^[\u1200-\u137F\s]*$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (value === "" || lettersOnlyRegex.test(value)) {
        // Only update the state if the input is empty or contains only letters
        handleGuestNameChange(e);
      }
    } else {
      // Update the state directly for other fields
      handleGuestNameChange(e);
    }
  };

  const [guestFormData, setGuestFormData] = useState({
    total_price: 0,
    buyer_id: userData.user.id,
    name: "",
    menu_items: [],
  });

  const [data, setData] = useState(initialData);
  const accessToken = userData.accessToken;

  useEffect(() => {
    const previousRoute = sessionStorage.getItem("previous Route");

    if (previousRoute) {
      setIsEmployee(true);
      const employeeIdValue = parseInt(previousRoute, 10);
      setFormData({
        ...formData,
        employee_id: isNaN(employeeIdValue) ? 0 : employeeIdValue,
      });

      sessionStorage.removeItem("previous Route");
    }
  }, []);

  function handleSelectedMenu(foodItem) {
    // Check if the item already exists in selectedItems
    const itemIndex = selectedItems.findIndex(
      (item) => item.menu_item_id === foodItem.id
    );
    let total = 0;
    if (itemIndex !== -1) {
      // If the item exists, create a copy of selectedItems to avoid state mutation
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems[itemIndex].quantity += 1;

      // Update the state with the modified selectedItems
      setSelectedItems(updatedSelectedItems);

      // Calculate the total price based on the updated quantities
      total = selectedItems.reduce((acc, item) => {
        const price = isEmployee
          ? item.price_for_employee
          : item.price_for_guest;

        return acc + price * item.quantity;
      }, 0);
    } else {
      // If the item doesn't exist, create a new item
      const newItem = {
        menu_item_id: foodItem.id,
        name: foodItem.name,
        price_for_employee: foodItem.price_for_employee,
        price_for_guest: foodItem.price_for_guest,
        quantity: 1,
      };

      // Update the state by adding the new item to selectedItems
      setSelectedItems([...selectedItems, newItem]);

      // Calculate the total price based on the updated quantities
      total = selectedItems.reduce((acc, item) => {
        const price = isEmployee
          ? item.price_for_employee
          : item.price_for_guest;

        return acc + price * item.quantity;
      }, 0);

      total =
        parseFloat(data.totalPrice) +
        (isEmployee
          ? parseFloat(foodItem.price_for_employee)
          : parseFloat(foodItem.price_for_guest));
    }

    setData({ ...data, totalPrice: total });
  }

  const handleEmployeeIdChange = (e) => {
    const employeeIdValue = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      employee_id: isNaN(employeeIdValue) ? 0 : employeeIdValue,
    });
  };
  const handleGuestNameChange = (e) => {
    const guestName = e.target.value.toString(); // Parse to string
    setGuestFormData({
      ...guestFormData,
      name: guestName.trim() === "" ? "Guest" : guestName,
    });
  };

  const handleChangeQuantity = (index, event) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = parseInt(event.target.value, 10);

    let total = updatedItems.reduce((acc, item) => {
      const price = isEmployee ? item.price_for_employee : item.price_for_guest;
      return acc + price * item.quantity;
    }, 0);
    if (0 < parseInt(event.target.value, 10)) {
      setData({ ...data, totalPrice: total });
      setSelectedItems(updatedItems);
    }

    if (0 < parseInt(event.target.value, 10)) {
      setInputValues({
        ...inputValues,
        [index]: updatedItems[index].quantity,
      });
    } else {
      setInputValues({
        ...inputValues,
        [index]: 0,
      });
    }
  };

  const handleOrder = async () => {
    setLoadingBuy(true);
    let isGuest;

    {
      isEmployee ? (isGuest = false) : (isGuest = true);
    }
    const updatedItems = [...selectedItems];

    let total = updatedItems.reduce((acc, item) => {
      const price = isEmployee ? item.price_for_employee : item.price_for_guest;
      return acc + price * item.quantity;
    }, 0);
    if (data.totalPrice !== total) {
      setErrorMessage("ልክ ያልሆነ ግብዓት");
      setOpen(true);
      return;
    }

    if (!isGuest) {
      formData.total_price = data.totalPrice;
      const updatedFormData = {
        ...formData,
        menu_items: selectedItems,
      };

      try {
        const response = await axios.post(
          `${BASE_URL}/order`,
          updatedFormData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data && response.data.message) {
          handleClear();
          setGuestFormData(initialData);
          setErrorMessage(`ማዘዝ ተሳክቷል!`);
          setOpen(true);
        } else {
        }
      } catch (e) {
        if (e.response) {
          setErrorMessage(e.response.data.message);
          setOpen(true);
        } else {
          setErrorMessage(e.message);
          setOpen(true);
        }
      }
    } else {
      guestFormData.total_price = data.totalPrice;
      const updatedFormData = {
        ...guestFormData,
        menu_items: selectedItems,
      };

      try {
        const guestResponse = await axios.post(
          `${BASE_URL}/guestOrder`,
          updatedFormData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (guestResponse.data && guestResponse.data.message) {
          handleClear();
          setErrorMessage(`ለእንግዳ ማዘዝ ተሳክቷል!`);
          setOpen(true);
        } else {
          setErrorMessage(`ትእዛዙን መፈጸም አልተቻለም`);
          setOpen(true);
        }
      } catch (e) {
        if (e.response) {
          setErrorMessage("ትእዛዙን መፈጸም አልተቻለም");
          setOpen(true);
        } else {
          setErrorMessage("ትእዛዙን መፈጸም አልተቻለም");
          setOpen(true);
        }
      }
    }
    setLoadingBuy(false);
  };
  const handleFindEmployee = async () => {
    try {
      setIsSearching(true);

      const responseEmployee = await axios.get(
        `${BASE_URL}/getEmployeeById/${formData.employee_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (responseEmployee.data && responseEmployee.data.employeeFullName) {
        const employeeFullName = responseEmployee.data.employeeFullName;

        // Fetch the account balance
        const responseAccount = await axios.get(
          `${BASE_URL}/getAccount/${formData.employee_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (responseAccount.data && responseAccount.data.account) {
          const currentBalance = responseAccount.data.account;

          setEmployeeInfo({
            name: employeeFullName,
            id: formData.employee_id,
            balance: currentBalance,
          });
        } else {
          setEmployeeInfo(null);
        }
      } else {
        setEmployeeInfo(null);
      }
    } catch (error) {
      setEmployeeInfo(null);
    }
    setIsSearching(false);
  };

  const handleBlur = (index, inputValue) => {
    if (inputValue > 0) {
      return;
    } else {
      const updatedItems = [...selectedItems];

      let total = updatedItems.reduce((acc, item, i) => {
        if (i !== index) {
          const price = isEmployee
            ? item.price_for_employee
            : item.price_for_guest;
          return acc + price * item.quantity;
        }
        return acc;
      }, 0);

      setData({ ...data, totalPrice: total });

      handleDeleteItem(index);
    }
  };

  const handleDeleteItem = (indexToDelete) => {
    const updatedSelectedItems = [...selectedItems];
    const deletedItem = updatedSelectedItems.splice(indexToDelete, 1)[0]; // Remove the item and get the deleted item

    // Update the total price by subtracting the deleted item's price * quantity
    const itemPrice =
      (isEmployee
        ? deletedItem.price_for_employee
        : deletedItem.price_for_guest) * deletedItem.quantity;

    if (!isNaN(itemPrice)) {
      data.totalPrice -= itemPrice;
    }

    setSelectedItems(updatedSelectedItems);
  };

  const handleClear = () => {
    setData(initialData);
    setSelectedItems([]);
    setFormData({
      total_price: 0,
      employee_id: "",
      menu_items: [],
    });
    setGuestFormData({
      total_price: 0,
      buyer_id: userData.user.id,
      name: "",
      menu_items: [],
    });
  };
  const handleViewChange = (event) => {
    handleClear();
    setSelectedView(event.target.value); // Update the selected view
    setIsEmployee(event.target.value === "Employee"); // Update isEmployee state
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* <CashierSidenav color="dark" brand="" brandName="የገንዘብ ተቀባይ ክፍል መተግበሪያ" /> */}
      <Sidenav />
      <MDBox
        mx={2}
        mt={2}
        mb={2}
        py={3}
        px={2}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="info"
        textAlign="center"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <MDTypography variant="h4" color="white">
          {"የ" + (isEmployee ? "ሰራተኛ " : "እንግዳ ") + "ምግብ ግዥ"}
        </MDTypography>
        <label>
          <Select
            value={selectedView}
            onChange={handleViewChange}
            style={{
              marginRight: "10px",
              width: "100px",
              color: "white",
              padding: "0.7em 0.98em",
              backgroundColor: "white",
            }}
          >
            <MenuItem value="Employee">ሰራተኛ </MenuItem>
            <MenuItem value="Guest"> እንግዳ</MenuItem>
          </Select>
        </label>
      </MDBox>

      <OrderSummary
        data={data}
        formData={formData}
        guestFormData={guestFormData}
        handleEmployeeIdChange={handleEmployeeIdChange}
        handleGuestNameChange={handleGuestNameChange}
        handleInputChange={handleInputChange}
        handleOrder={handleOrder}
        handleClear={handleClear}
        handleChangeQuantity={handleChangeQuantity} // Pass this prop
        selectedItems={selectedItems}
        handleSelectedMenu={handleSelectedMenu}
        handleDeleteItem={handleDeleteItem}
        isEmployee={isEmployee}
        setErrorMessage={setErrorMessage}
        setOpen={setOpen}
        handleFindEmployee={handleFindEmployee}
        employeeInfo={employeeInfo}
        isSearching={isSearching}
        open={open}
        errorMessage={errorMessage}
        handleBlur={handleBlur}
        inputValues={inputValues}
        setInputValues={setInputValues}
        loadingBuy={loadingBuy}
      />
    </DashboardLayout>
  );
}
export default BuyFood;
