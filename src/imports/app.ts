import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ModeToggle } from "../components/ModeToggle";
import LazyWrapper from "@/components/LazyWrapper";

// Lazy load components
const LandingPage = React.lazy(() => import("../pages/LandingPage"));

// Admin components
const AdminLogin = React.lazy(() => import("../pages/admin/Login"));

const AdminLayout = React.lazy(() => import("../pages/admin/Layout"));
const AdminDashboard = React.lazy(() => import("../pages/admin/Dashboard"));
const AddServices = React.lazy(() => import("../pages/admin/AddServices"));
const ViewReport = React.lazy(() => import("../pages/admin/ViewReport"));
const AddDentist = React.lazy(() => import("../pages/admin/AddDentist"));

// Customer components
const CustomerLogin = React.lazy(() => import("../pages/customer/Login"));
const CustomerSignup = React.lazy(() => import("../pages/customer/Signup"));
const CustomerLayout = React.lazy(() => import("../pages/customer/Layout"));
const CustomerDashboard = React.lazy(
  () => import("../pages/customer/Dashboard"),
);

// Dentist components
const DentistLogin = React.lazy(() => import("../pages/dentist/Login"));

const DentistDashboard = React.lazy(() => import("../pages/dentist/Dashboard"));

// Other components
const Protected = React.lazy(() => import("../pages/Protected"));

export {
  // React Router components
  BrowserRouter,
  Route,
  Routes,

  // Lazy-loaded components
  LandingPage,
  AdminLogin,
  AdminLayout,
  AdminDashboard,
  AddServices,
  ViewReport,
  AddDentist,
  CustomerLogin,
  CustomerSignup,
  CustomerLayout,
  CustomerDashboard,
  DentistLogin,
  DentistDashboard,
  Protected,

  // Other components
  LazyWrapper,
};

export { ErrorBoundary, ModeToggle };
