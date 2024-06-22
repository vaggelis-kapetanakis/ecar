import React, { Suspense } from "react";
import LandingPage from "./pages/LandingPage/LandingPage";
import {
  Route,
  Routes,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { useAuth } from "./shared/hooks/auth-hook";
import { AuthContext } from "./shared/context/auth-context";
import LoadingSpinner from "./UIElements/LoadingSpinner/LoadingSpinner";
import { AnimatePresence } from "framer-motion";

const Login = React.lazy(() => import("./pages/LoginPage/Login"));

const Signup = React.lazy(() => import("./pages/LoginPage/Signup"));

const Dashboard = React.lazy(() => import("./pages/Dashboard/Dashboard"));

const EnergyCharts = React.lazy(() =>
  import("./pages/Dashboard/EnergyCharts/EnergyCharts")
);

const Simulator = React.lazy(() =>
  import("./pages/Dashboard/Simulator/Simulator")
);
const Sessions = React.lazy(() =>
  import("./pages/Dashboard/Sessions/Sessions")
);
const Stations = React.lazy(() =>
  import("./pages/Dashboard/Stations/Stations")
);

function App() {
  const {
    token,
    login,
    logout,
    userId,
    username,
    type,
    debt,
    lastCharge,
    chargesDate,
    points,
    vehicles,
  } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/signedin/dashboard" element={<Dashboard />} />
        <Route path="/signedin/charts" element={<EnergyCharts />} />
        <Route path="/signedin/charge" element={<Simulator />} />
        <Route path="/signedin/stations" element={<Stations />} />
        <Route path="/signedin/sessions" element={<Sessions />} />
        <Route
          path="*"
          element={<Navigate to="/signedin/dashboard" replace />}
        />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        username: username,
        userId: userId,
        points: points,
        debt: debt,
        lastCharge: lastCharge,
        chargesDate: chargesDate,
        type: type,
        vehicles: vehicles,
        login: login,
        logout: logout,
      }}
    >
      {/* <Router> */}
      <>
        <AnimatePresence>
          <Suspense
            fallback={
              <div className="items-center">
                <LoadingSpinner asOverlay />
              </div>
            }
          >
            {routes}
          </Suspense>
        </AnimatePresence>
      </>
      {/* </Router> */}
    </AuthContext.Provider>
  );
}

export default App;
