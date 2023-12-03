import React from "react";
import Dashboard from "./layouts/dashboard";
import Tables from "./layouts/tables";
import Billing from "./layouts/billing";
import Notifications from "./layouts/notifications";
import EmployeeList from "./layouts/profile";
import BasicLayout from "./layouts/authentication/sign-in";
import SignUpLayout from "./layouts/authentication/sign-up";
import MainDashboard from "./layouts/MainDashboard";
import AddEmployee from "./layouts/addEmployee";
import FoodMenu from "./layouts/foodMenu";
import BuyFood from "./layouts/buyFood";
import InventoryEntry from "./layouts/inventory";
import AddMenuItem from "./layouts/menuEntry";
import SearchMenu from "./layouts/search";
import ReportList from "./layouts/report";
import CashierDashboard from "./layouts/CashierDashboard";
import Constraint from "./layouts/constraints";
import Deposit from "./layouts/deposit";
import CafeCommetteDashboard from "./layouts/CafeCommetteDashboard";
import CommetteDashboard from "./layouts/dashboard/cafeCommetteDashboard";
import MoneyTransaction from "./layouts/deposit";
import StockRequest from "./layouts/stockRequest";
import Approval from './layouts/stockApproval';
import IngredientRequest from './layouts/ingredientRequest';
import IngredientApproval from "./layouts/ingredientApproval";
import InventoryList from "./layouts/showInventory";
function getLayoutComponent(path) {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;

  const userData = ipcRenderer.sendSync("get-user");

  if (path === "/" && userData && userData.user) {
    // User is authenticated, determine the role and set the route accordingly
    switch (userData.user.role) {
      case "admin":
        return <MainDashboard />;
      case "cashier":
        return <CashierDashboard />;
      case "communittee_admin": // Assuming this is the role name
        return <CafeCommetteDashboard />;
      default:
        return null; // Handle other roles or scenarios
    }
  }

  if (path === "/" && (!userData || !userData.user)) {
    // If not authenticated, redirect to the sign-in page
    return <BasicLayout />;
  }

    // Handle other routes as needed
    switch (path) {
        case '/mainDashboard':
            return <MainDashboard/>;
        case '/addEmployee':
            return <AddEmployee/>;
        case '/foodMenu':
            return <FoodMenu/>;
        case '/constraint':
            return <Constraint/>;
        case '/deposit':
            return <MoneyTransaction />;
        case '/addFood':
            return <AddMenuItem/>;
        case '/buyFood':
            return <BuyFood/>;
        case '/inventory':
            return <InventoryEntry/>;
        case '/stockRequest':
            return <StockRequest/>;
        case '/stockApproval':
                return <Approval/>;
        case '/ingredientRequest':
                return <IngredientRequest/>;
        case '/ingredientApproval':
                    return <IngredientApproval/>;
        case "/showInventory":
                        return <InventoryList />;
        case '/dashboard':
            return <Dashboard/>;
        case '/commetteDashboard':
            return <CommetteDashboard/>;
        case '/cashierdashboard':
            return <CashierDashboard />;
        case '/cafeCommetteDashboard':
            return <CafeCommetteDashboard />;
        case '/tables':
            return <Tables/>;
        case '/billing':
            return <Billing/>;
        case '/search':
            return <SearchMenu/>;
        case '/report':
            return <ReportList/>;
        case '/notifications':
            return <Notifications/>;
        case '/profile':
            return <EmployeeList/>;
        case '/authentication/sign-in':
            return <BasicLayout/>;
        case '/authentication/sign-up':
            return <SignUpLayout/>;
        default:
            return null;
    }
}

export default getLayoutComponent;
