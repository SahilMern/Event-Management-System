import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/common/Footer/Footer";
import Under from "./Under";
import Event from "./components/Event/Event";
import AddEvent from "./components/admin/AddEvent/AddEvent";
import EditEvent from "./components/admin/EditEvent/EditEvent";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./components/admin/Admin";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="min-div">
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/under" element={<Under />} />

          {/* Protected Routes for Admin */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/addevent" element={<AddEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
          </Route>

          {/* Public Event Route */}
          <Route path="/event" element={<Event />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;