import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/AuthStore";
import "./App.css";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import AccountRegister from "./pages/AccountRegister";
import { ProtectedRoute } from "./pages/ProtectedRoute";

function App() {
  useAuthStore.getState().setToken(null);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<AccountRegister />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
