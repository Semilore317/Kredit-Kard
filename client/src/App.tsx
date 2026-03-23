import { Routes, Route, Navigate } from "react-router"
import Landing from "./pages/landing/Landing"

function App() {
  
  return (
    <Routes>
      <Route path = "/" element = { <Navigate to = "landing" />} />
      <Route path = "/landing"  element = {<Landing />} />
      <Route path = "*" element = {<Navigate to = "/landing" replace />} />
    </Routes>
    
    
  )
}

export default App
