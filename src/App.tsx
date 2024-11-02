import {
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
  Routes,
  Route,
  BrowserRouter,
} from "@/imports/app";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* landing */}
        <Route path="/" element={<LandingPage />} />
        {/* admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route element={<Protected />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-services" element={<AddServices />} />
            <Route path="/admin/view-report" element={<ViewReport />} />
            <Route path="/admin/add-dentist" element={<AddDentist />} />
          </Route>
        </Route>
        {/* customer */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/signup" element={<CustomerSignup />} />
        <Route element={<Protected />}>
          <Route path="/customer" element={<CustomerLayout />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          </Route>
        </Route>
        {/* dentist */}
        <Route path="/dentist/login" element={<DentistLogin />} />
        <Route path="/dentist/signup" element={<DentistSignup />} />
        <Route element={<Protected />}>
          <Route path="/dentist" element={<CustomerLayout />}>
            <Route path="/dentist/dashboard" element={<DentistDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
