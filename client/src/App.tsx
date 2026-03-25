import { Routes, Route, Navigate } from "react-router"
import Landing from "./pages/landing/Landing"
import Auth from "./pages/auth/Auth"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="landing" />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/signup" element={<Navigate to="/auth" replace />} />
      <Route path="/signin" element={<Navigate to="/auth" replace />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  )
}

export default App
