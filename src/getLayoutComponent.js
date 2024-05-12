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
import SearchMenu from "./layouts/search/searchForCafeManager";
import ReportList from "./layouts/report";
import CashierDashboard from "./layouts/CashierDashboard";
import Constraint from "./layouts/constraints";
import Deposit from "./layouts/deposit";
import CafeCommetteDashboard from "./layouts/CafeCommetteDashboard";
import CommetteDashboard from "./layouts/dashboard/cafeCommetteDashboard";
import StockRequest from "./layouts/stockRequest";
import IngredientRequest from "./layouts/ingredientRequest";
import IngredientApproval from "./layouts/ingredientApproval";
import InventoryList from "./layouts/showInventory";
import Approval from "./layouts/stockApproval";
import MoneyTransaction from "./layouts/deposit";
import AddDepartment from "./layouts/addDepartment";
import SearchMenuForInvnetory from "./layouts/search/searchForCafeCommette";
import SearchMenuForAdmin from "./layouts/search/searchForAdmin";
import BuyFoodDepartment from "./layouts/buyFood/buyFoodDepartment";
import DepartmentBilling from "./layouts/billing/DepartmentBilling";
import CafeManagerDashboard from "./layouts/dashboard/cafeManagerDashboard";
import ShowApproval from "./layouts/showIngredientApproval";
import StockApproval from "./layouts/showApprovedStock";
import CashierOrder from "./layouts/tables/CashierOrderView";
import SearchMenuForCashier from "./layouts/search/searchForCashier";
import storeKeeperDashboard from "./layouts/dashboard/storeKeeperDashboard";
import Sidenav from "./examples/Sidenav/AdminSidenav";
import Department from "./layouts/departmentList";
import StockAmountTable from "./layouts/stokeAmount";
import UploadAssignment from "./layouts/assignmentUpload";
import AddCourseMaterial from "./layouts/courseMaterial";
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
      case "student": // Assuming this is the role name
        return <CafeCommetteDashboard />;
      case "dean":
        return <CafeManagerDashboard />;
      case "storeKeeper":
        return <storeKeeperDashboard />;
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
    case "/mainDashboard":
      return <MainDashboard />;
    case "/addEmployee":
      return <AddEmployee />;
    case "/addDepartment":
      return <AddDepartment />;
    case "/departmentList":
      return <Department />;
    case "/food_menu":
      return <FoodMenu />;
    case "/constraint":
      return <Constraint />;
    case "/deposit":
      return <MoneyTransaction />;
    case "/addFood":
      return <AddMenuItem />;
    case "/showApprovedStock":
      return <StockApproval />;
    case "/showIngredientApproval":
      return <ShowApproval />;
    case "/buyFood":
      return <BuyFood />;
    case "/buyFoodDepartment":
      return <BuyFoodDepartment />;
    case "/inventory":
      return <InventoryEntry />;
    case "/stockRequest":
      return <StockRequest />;
    case "/stockApproval":
      return <Approval />;
    case "/ingredientRequest":
      return <IngredientRequest />;
    case "/ingredientApproval":
      return <IngredientApproval />;
    case "/showInventory":
      return <InventoryList />;
    case "/dashboard":
      return <Dashboard />;
    case "/cafeManagerDashboard":
      return <CafeManagerDashboard />;
    case "/commetteDashboard":
      return <CommetteDashboard />;
    case "/cashierdashboard":
      return <CashierDashboard />;
    case "/storeKeeperdashboard":
      return <storeKeeperDashboard />;
    case "/cafeCommetteDashboard":
      return <CafeCommetteDashboard />;
    case "/stokeAmount":
      return <StockAmountTable />;
    case "/tables":
      return <Tables />;
    case "/cashierOrder":
      return <CashierOrder />;
    case "/billing":
      return <Billing />;
    case "/billingManager":
      return <Billing showEditColumn={true} />;
    case "/billingCashier":
      return <Billing showEditColumn={false} />;
    case "/departmentBilling":
      return <DepartmentBilling />;
    case "/search":
      return <SearchMenu />;
    case "/searchForInventory":
      return <SearchMenuForInvnetory />;
    case "/searchForCashier":
      return <SearchMenuForCashier />;
    case "/searchForAdmin":
      return <SearchMenuForAdmin />;
    case "/report":
      return <ReportList />;
    case "/notifications":
      return <Notifications />;
    case "/profile":
      return <EmployeeList />;
    case "/authentication/sign-in":
      return <BasicLayout />;
    case "/authentication/sign-up":
      return <SignUpLayout />;
    case "/assignmentUpload":
      return <UploadAssignment/>;
    case "/courseMaterial":
      return <AddCourseMaterial/>;
    default:
      return null;
  }
}

export default getLayoutComponent;
