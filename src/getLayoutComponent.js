import React from "react";
import Dashboard from "./layouts/dashboard";
import ViewAssignments from "./layouts/assignmentView";
import ScheduleRequest from "./layouts/schedulePost";
import BasicLayout from "./layouts/authentication/sign-in";
import SignUpLayout from "./layouts/authentication/sign-up";
import NotifyStudents from "./layouts/notifyStudents";
import MainDashboard from "./layouts/MainDashboard";
import AddEmployee from "./layouts/addEmployee";
import UploadAnnouncement from "./layouts/announcements";
import UploadCourse from "./layouts/courseUpload";
import CoordinatorDashboard from "./layouts/CoordinatorDashboard";
import StudentDashboard from "./layouts/StudentDashboard";
import DeanDashboard from "./layouts/dashboard/deanDashboard";
import InstructorDashboard from "./layouts/dashboard/instructorDashboard";
import DisplaySchedule from "./layouts/scheduleView";
import Sidenav from "./examples/Sidenav/AdminSidenav";
import UploadAssignment from "./layouts/assignmentUpload";
import ViewCourses from "./layouts/courseList";
import ViewCoursesInstructor from "./layouts/courseListInstructor";
import ViewCoursesStudent from "./layouts/courseListstudent";

import CourseMaterialsList from "./layouts/courseMaterialStudent";
import AddCourseMaterial from "./layouts/courseMaterial";
import ViewAnnouncement from "./layouts/viewAnnouncement";
import AssignmentsPage from "./layouts/assignmentList";
import CourseMaterialsPage from "./layouts/CourseMaterialList";
import SubmitAssignment from "./layouts/submitAssignment";
// import ScheduleRequest from "../../layouts/schedulePost";
import ApproveScheduleRequest from "./layouts/scheduleApproval";
import SubmittedAssignments from "./layouts/viewSubmittedAssignment";
import EmployeeList from "./layouts/employeeList";

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
        return <DeanDashboard />;
      case "instructor":
        return <InstructorDashboard />;
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
    case "/courseListInstructor":
      return <ViewCoursesInstructor />;
    case "/courseListstudent":
      return <ViewCoursesStudent />;
    case "/deanDashboard":
      return <DeanDashboard />;
    case "/StudentDashboard":
      return <StudentDashboard />;
    case "/CoordinatorDashboard":
      return <CoordinatorDashboard />;
    case "/instructorDashboard":
      return <InstructorDashboard />;
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
    case "/courseMaterialStudent":
      return <CourseMaterialsList />;
    case "/submit-assignment":
      return <SubmitAssignment />;
    case "/assignmentView":
      return <ViewAssignments />;
    case "/viewSubmittedAssignment":
      return <SubmittedAssignments />;
    case "/notify-students":
      return <NotifyStudents />;
    case "/viewEmployee":
      return <EmployeeList />;
    default:
      return null;
  }
}

export default getLayoutComponent;
