

import React, { useState, useEffect, useRef } from "react";


// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import CashierDashboard from "../CashierDashboard";
import MDTypography from "../../components/MDTypography";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MDButton from "../../components/MDButton";
import CafeCommetteDashboard from "../CafeCommetteDashboard";

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "50%", // Two cards in a row
    padding: "16px",
    height: "200px", // Adjust the height as needed
    borderRadius: "8px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "16px", // Spacing between cards
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  separator: {
    borderTop: "1px solid #ccc",
    margin: "8px 0",
  },
};

function Billing() {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const [guestOrders, setGuestOrders] = useState([]);
  const userData = ipcRenderer.sendSync("get-user");
  const [selectedOption, setSelectedOption] = useState("today");
  const accessToken = userData.accessToken


  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getGuestOrders`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.data) {
       
        setGuestOrders(response.data.orders.reverse());
  
        console.log(response);
      } else {
        console.log("Empty response");
      }
    } catch (error) {
      console.error("Failed to fetch food menu:", error);
    }
  };

  const filteredOrders = guestOrders.filter((order) => {
    const orderDate = new Date(order.created_at); 
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    console.log(filteredOrders,'DKDJ');
  
    if (selectedOption === "today" && orderDate.toDateString() === today.toDateString()) {
      return true;
    } else if (selectedOption === "yesterday" && orderDate.toDateString() === yesterday.toDateString()) {
      return true;
    }
    return false;
  });
  
  
  
 


  return (
    <DashboardLayout>
    {userData.user.role == 'cashier' ? <CashierDashboard /> : <CafeCommetteDashboard /> }
      <DashboardNavbar absolute isMini />
      <MDBox
  mx={0}
  mt={9}
  mb={1}
  py={3}
  px={1}
  variant="gradient"
  bgColor="info"
  borderRadius="lg"
  coloredShadow="info"
  textAlign="center"
>
  <MDButton
    style={{ marginRight: "30px" }}
    variant={selectedOption === "today" ? "contained" : "outlined"}
    onClick={() => setSelectedOption("today")}
  >
    Today
  </MDButton>
  <MDButton
    style={{ marginRight: "30px" }}
    variant={selectedOption === "yesterday" ? "contained" : "outlined"}
    onClick={() => setSelectedOption("yesterday")}
  >
    Yesterday
  </MDButton>
</MDBox>

      <MDBox mt={3}>
    
        <div style={{ display: "flex", flexWrap: "wrap", flexDirection:"column" }}>
          {filteredOrders.map((order, index) => (
            <Card key={index} style={styles.card}>
              <CardContent>
                <div style={styles.header}>
                  <MDTypography variant="button" fontWeight="medium">
                    {order.guest_name}
                  </MDTypography>
                  <MDTypography variant="caption">Cashier ID {order.cashier_id}</MDTypography>
                </div>
                <div>
                  {order.ordered_items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <MDTypography variant="body2">
                        {item.name} : {item.quantity} x {item.price_for_guest} ETB
                      </MDTypography>
                    </div>
                  ))}
                </div>
                <div style={styles.separator}></div>
                <div style={styles.total}>
                  <MDTypography variant="body2">Total</MDTypography>
                  <MDTypography variant="body2"> {order.tota_price} ETB</MDTypography>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
