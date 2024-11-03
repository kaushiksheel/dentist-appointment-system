import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import {
  AddDentist,
  AddServices,
  AdminDashboard,
  AdminLayout,
  AdminLogin,
  CustomerDashboard,
  CustomerLayout,
  CustomerLogin,
  CustomerSignup,
  DentistDashboard,
  DentistLogin,
  ErrorBoundary,
  LandingPage,
  LazyWrapper,
  ModeToggle,
  Protected,
  ViewReport,
} from "./imports/app";
import NotFound from "./pages/NotFount";

const adminRoutes = [
  { path: "dashboard", element: <AdminDashboard /> },
  { path: "add-services", element: <AddServices /> },
  { path: "view-report", element: <ViewReport /> },
  { path: "add-dentist", element: <AddDentist /> },
];

const customerRoutes = [{ path: "dashboard", element: <CustomerDashboard /> }];

const dentistRoutes = [{ path: "dashboard", element: <DentistDashboard /> }];
const App = () => {
  return (
    <AuthProvider>
      <div className="relative min-h-screen">
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <LazyWrapper>
                    <LandingPage />
                  </LazyWrapper>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin/login"
                element={
                  <LazyWrapper>
                    <AdminLogin />
                  </LazyWrapper>
                }
              />

              <Route element={<Protected />}>
                <Route element={<AdminLayout />}>
                  {adminRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={`/admin/${route.path}`}
                      element={<LazyWrapper>{route.element}</LazyWrapper>}
                    />
                  ))}
                </Route>
              </Route>

              {/* Customer routes */}
              <Route
                path="/customer/login"
                element={
                  <LazyWrapper>
                    <CustomerLogin />
                  </LazyWrapper>
                }
              />
              <Route
                path="/customer/signup"
                element={
                  <LazyWrapper>
                    <CustomerSignup />
                  </LazyWrapper>
                }
              />
              <Route element={<Protected />}>
                <Route element={<CustomerLayout />}>
                  {customerRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={`/customer/${route.path}`}
                      element={<LazyWrapper>{route.element}</LazyWrapper>}
                    />
                  ))}
                </Route>
              </Route>

              {/* Dentist routes */}
              <Route
                path="/dentist/login"
                element={
                  <LazyWrapper>
                    <DentistLogin />
                  </LazyWrapper>
                }
              />

              <Route element={<Protected />}>
                <Route element={<CustomerLayout />}>
                  {dentistRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={`/dentist/${route.path}`}
                      element={<LazyWrapper>{route.element}</LazyWrapper>}
                    />
                  ))}
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
        <div className="fixed bottom-10 right-10">
          <ModeToggle />
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
