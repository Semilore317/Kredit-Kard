import { Routes, Route, Navigate } from "react-router"
import Landing from "./pages/landing/Landing"
import Auth from "./pages/auth/Auth"
import DashboardLayout from "./components/dashboard/DashboardLayout"
import DashboardHome from "./pages/dashboard/DashboardHome"
import Debts from "./pages/dashboard/Debts"
import Customers from "./pages/dashboard/Customers"
import Transactions from "./pages/dashboard/Transactions"
import Messages from "./pages/dashboard/Messages"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="landing" />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/signup" element={<Navigate to="/auth" replace />} />
      <Route path="/signin" element={<Navigate to="/auth" replace />} />
      <Route path="/landing" element={<Landing />} />

      {/* Dashboard */}
      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="debts" element={<Debts />} />
        <Route path="customers" element={<Customers />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="messages" element={<Messages />} />

      </Route>

      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  )
}

export default App
