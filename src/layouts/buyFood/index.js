import React, { useState, useEffect } from "react";
import CashierDashboard from "../CashierDashboard";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import OrderSummary from "./buyFoodUi";


function BuyFood() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const [isEmployee, setIsEmployee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  

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

  const [guestFormData, setGuestFormData] = useState({
    total_price: 0,
    cashier_id: 1,
    name: "Guest",
    menu_items: [],
  });

  const [data, setData] = useState(initialData);
  const accessToken = userData.accessToken


  
  useEffect(() => {
   
    const previousRoute = sessionStorage.getItem("previous Route");
  
    if (previousRoute) {
      setIsEmployee(true);
      const employeeIdValue = parseInt(previousRoute, 10);
    setFormData({
      ...formData,
      employee_id: isNaN(employeeIdValue) ? 0 : employeeIdValue,
    });
     console.log("fghntherteghryhbe5y")
    sessionStorage.removeItem("previous Route");
    }
  }, []);


  function handleSelectedMenu(foodItem) {
    const newItem = {
      id: foodItem.id,
      name: foodItem.name,
      price_for_employee: foodItem.price_for_employee,
      price_for_guest: foodItem.price_for_guest,
      quantity: 1,
    };
    console.log(newItem);

    setSelectedItems([...selectedItems, newItem]);

    let total = isEmployee
      ? newItem.price_for_employee
      : newItem.price_for_guest;
    data.totalPrice = parseFloat(total) + data.totalPrice;

    const menuItem = {
      menu_item_id: foodItem.id,
      quantity: 1,
    };

    let isGuest;
    {
      isEmployee ? (isGuest = false) : (isGuest = true);
    }

    if (!isGuest) {
      setFormData({
        ...formData,
        menu_items: [...formData.menu_items, menuItem],
      });
    } else {
      setGuestFormData({
        ...guestFormData,
        menu_items: [...guestFormData.menu_items, menuItem],
      });
    }
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

    const newTotalPrice = updatedItems.reduce((total, item) => {
      const price = isEmployee ? item.price_for_employee : item.price_for_guest;
      return total + item.quantity * price;
    }, 0);

    data.totalPrice = newTotalPrice;
    setSelectedItems(updatedItems);
  };

  const handleOrder = async () => {
    let isGuest;

    {
      isEmployee ? (isGuest = false) : (isGuest = true);
    }
  
    if (!isGuest) {
      formData.total_price = data.totalPrice;
      console.log(JSON.stringify(formData, null, 2)); // Display formData in the console
    
      try {
        const response = await axios.post(`${BASE_URL}/order`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        if (response.data && response.data.message) {
         
          handleClear();
          setGuestFormData(initialData);
          setErrorMessage(`order successful!`);
          setOpen(true);
        } else {
          console.error("Failed to place order: Invalid response from the server");
        }
      } catch (e) {
        if (e.response) {
          setErrorMessage(e.response.data.message);
          setOpen(true);
          console.error("Failed to place order:", e.response.data.message);
        } else {
          setErrorMessage(e.message);
          setOpen(true);
          console.error("Error:", e.message);
        }
      }
    }
    
    else {
      guestFormData.total_price = data.totalPrice;
      console.log(data.totalPrice);
      console.log(guestFormData);
    
      try {
        const guestResponse = await axios.post(
          `${BASE_URL}/guestOrder`,
          guestFormData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
    
        if (guestResponse.data && guestResponse.data.message) {
          handleClear();
          setErrorMessage(`Guest order successful!`);
          setOpen(true);
        } else {
          console.error("Failed to place guest order: Invalid response from the server");
        }
      } catch (e) {
        if (e.response) {
          setErrorMessage(e.response.data.message);
          setOpen(true);
          console.error("Failed to place guest order:", e.response.data.message);
        } else {
          setErrorMessage(e.message);
          setOpen(true);
          console.error("Error:", e.message);
        }
      }
      
    }


  };

  const handleDeleteItem = (indexToDelete) => {
    const updatedSelectedItems = [...selectedItems];
    const deletedItem = updatedSelectedItems.splice(indexToDelete, 1)[0]; // Remove the item and get the deleted item

    // Update the total price by subtracting the deleted item's price * quantity
    data.totalPrice -=
      (isEmployee
        ? deletedItem.price_for_employee
        : deletedItem.price_for_guest) * deletedItem.quantity;

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
      cashier_id: 1,
      name: "Guest",
      menu_items: [],
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <CashierDashboard />
      <OrderSummary
        data={data}
        formData={formData}
        guestFormData={guestFormData}
        handleEmployeeIdChange={handleEmployeeIdChange}
        handleGuestNameChange={handleGuestNameChange}
        handleOrder={handleOrder}
        handleClear={handleClear}
        handleChangeQuantity={handleChangeQuantity} // Pass this prop
        selectedItems={selectedItems}
        handleSelectedMenu={handleSelectedMenu}
        handleDeleteItem={handleDeleteItem}
        isEmployee={isEmployee}
        setIsEmployee={setIsEmployee}
        setErrorMessage={setErrorMessage}
        setOpen={setOpen}
        open={open}
        errorMessage={errorMessage}
      />
    </DashboardLayout>
  );
}
export default BuyFood;

