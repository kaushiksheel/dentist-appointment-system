import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddDentist from "../pages/admin/AddDentist";
import AddServices from "../pages/admin/AddServices";
import AdminLayout from "../pages/admin/Layout";
import CustomerLayout from "../pages/customer/Layout";
import ViewReport from "../pages/admin/ViewReport";
import CustomerLogin from "../pages/customer/Login";
import DentistLogin from "../pages/dentist/Login";
import DentistSignup from "../pages/dentist/Signup";
import AdminLogin from "../pages/admin/Login";
import AdminSignup from "../pages/admin/Signup";
import CustomerSignup from "../pages/customer/Signup";
import CustomerDashboard from "../pages/customer/Dashboard";
import DentistDashboard from "../pages/dentist/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import LandingPage from "../pages/LandingPage";
import Protected from "../pages/Protected";

export {
  BrowserRouter,
  Route,
  Routes,
  AddDentist,
  AddServices,
  AdminLayout,
  CustomerLayout,
  ViewReport,
  CustomerLogin,
  DentistLogin,
  DentistSignup,
  AdminLogin,
  AdminSignup,
  CustomerSignup,
  CustomerDashboard,
  DentistDashboard,
  AdminDashboard,
  LandingPage,
  Protected,
};
