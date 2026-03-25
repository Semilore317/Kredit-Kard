import { Routes, Route, Navigate } from "react-router"
import Landing from "./pages/landing/Landing"
import Auth from "./pages/auth/Auth"
import Dashboard from "./pages/dashboard/Dashboard"
import Settings from "./pages/settings/Settings"

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/signup" element={<Navigate to="/auth" replace />} />
      <Route path="/signin" element={<Navigate to="/auth" replace />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/settings" 
        element={isAuthenticated ? <Settings /> : <Navigate to="/auth" replace />} 
      />
      
      <Route path="/landing" element={<Landing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
