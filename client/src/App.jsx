import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Footer from "./components/Footer/Footer"
import Event from "./components/Event/Event"
import Under from "./Under"
import AddEvent from "./components/admin/AddEvent/AddEvent"
import EditEvent from "./components/admin/EditEvent/EditEvent"

const App = () => {
  return (

    <>
    <Navbar />
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      
      <Route path="/event" element={<Event />} />
      <Route path="/addevent" element={<AddEvent />} />
      <Route path="/edit-event/:id" element={<EditEvent />} />
      <Route path="/under" element={<Under />} />

    </Routes>
    <Footer />
    </>
  )
}

export default App