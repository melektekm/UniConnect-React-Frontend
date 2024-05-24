import React from "react";
import Dashboard from "./layouts/dashboard";
import Tables from "./layouts/tables";
import ViewAssignments from "./layouts/assignmentView";
import Notifications from "./layouts/notifications";
import ScheduleRequest from "./layouts/schedulePost";
import BasicLayout from "./layouts/authentication/sign-in";
import SignUpLayout from "./layouts/authentication/sign-up";
import MainDashboard from "./layouts/MainDashboard";
import AddEmployee from "./layouts/addEmployee";
import UploadAnnouncement from "./layouts/announcements";
import UploadCourse from "./layouts/courseUpload";
import CoordinatorDashboard from "./layouts/CoordinatorDashboard";
import StudentDashboard from "./layouts/StudentDashboard";
import CafeManagerDashboard from "./layouts/dashboard/cafeManagerDashboard";
import DisplaySchedule from "./layouts/scheduleView";
import Sidenav from "./examples/Sidenav/AdminSidenav";
import UploadAssignment from "./layouts/assignmentUpload";
import ViewCourses from "./layouts/report";
import AddCourseMaterial from "./layouts/courseMaterial";
import ViewAnnouncement from "./layouts/viewAnnouncement";
import AssignmentsPage from "./layouts/assignmentList";
import CourseMaterialsPage from "./layouts/CourseMaterialList";
import SubmitAssignment from "./layouts/submitAssignment";
// import ScheduleRequest from "../../layouts/schedulePost";
import ApproveScheduleRequest from "./layouts/scheduleApproval";
function getLayoutComponent(path) {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;

  const userData = ipcRenderer.sendSync("get-user");

  if (path === "/" && userData && userData.user) {
    // User is authenticated, determine the role and set the route accordingly
    switch (userData.user.role) {
      case "admin":
        return <MainDashboard />;
      case "coordinator":
        return <CoordinatorDashboard />;
      case "student": // Assuming this is the role name
        return <StudentDashboard />;
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
    case "/addFood":
      return <UploadCourse />;
    case "/viewAnnouncement":
      return <ViewAnnouncement />;
    case "/scheduleView":
      return <DisplaySchedule />;
    case "/announcements":
      return <UploadAnnouncement />;
    case "/schedulePost":
      return <ScheduleRequest />;
    case "/scheduleApproval":
      return <ApproveScheduleRequest />;
    // case "/assignmentView":
    //   return <InventoryList />;
    case "/dashboard":
      return <Dashboard />;
    case "/report":
      return <ViewCourses />;
    case "/cafeManagerDashboard":
      return <CafeManagerDashboard />;
    case "/StudentDashboard":
      return <StudentDashboard />;
    case "/CoordinatorDashboard":
      return <CoordinatorDashboard />;
    case "/storeKeeperdashboard":
      return <storeKeeperDashboard />;
    case "/StudentDashboard":
      return <StudentDashboard />;
    // case "/stokeAmount":
    //   return <StockAmountTable />;
    // case "/search":
    //   return <SearchMenu />;
    // case "/searchForInventory":
    //   return <SearchMenuForInvnetory />;
    // case "/searchForCashier":
    //   return <SearchMenuForCashier />;
    // case "/searchForAdmin":
    //   return <SearchMenuForAdmin />;
    case "/authentication/sign-in":
      return <BasicLayout />;
    case "/authentication/sign-up":
      return <SignUpLayout />;
    case "/assignmentUpload":
      return <UploadAssignment />;
    case "/courseMaterial":
      return <AddCourseMaterial />;
    case "/assignmentList":
      return <AssignmentsPage />;
    case "/CourseMaterialList":
      return <CourseMaterialsPage />;
    case "/submitAssignment":
      return <SubmitAssignment />;
    case "/assignmentView":
      return <ViewAssignments />;
    default:
      return null;
  }
}

export default getLayoutComponent;
