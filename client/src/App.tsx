import { Routes, Route, Navigate } from "react-router"
import Landing from "./pages/landing/Landing"
import Auth from "./pages/auth/Auth"
import Dashboard from "./pages/dashboard/Dashboard"
import Settings from "./pages/settings/Settings"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={localStorage.getItem("token") ? "/dashboard" : "/auth"} replace />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/signup" element={<Navigate to="/auth" replace />} />
      <Route path="/signin" element={<Navigate to="/auth" replace />} />
      
      {/* Protected Routes - Evaluated on every transition */}
      <Route 
        path="/dashboard" 
        element={<AuthGate><Dashboard /></AuthGate>} 
      />
      <Route 
        path="/settings" 
        element={<AuthGate><Settings /></AuthGate>} 
      />
      
      <Route path="/landing" element={<Landing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Simple internal gate component to ensure token is checked on every route hit
const AuthGate = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/auth" replace />;
    return <>{children}</>;
};

export default App
