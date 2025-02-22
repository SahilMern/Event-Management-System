import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Footer from "./components/Footer/Footer"
import Event from "./components/Event/Event"

const App = () => {
  return (

    <>
    <Navbar />
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/event" element={<Event />} />
    </Routes>
    <Footer />
    </>
  )
}

export default App