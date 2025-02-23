import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/common/Footer/Footer";
import Under from "./Under";
// import Event from "./components/Event/Event";
import AddEvent from "./components/admin/AddEvent/AddEvent";
import EditEvent from "./components/admin/EditEvent/EditEvent";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./components/admin/Admin";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Users from "./components/admin/pages/Users";
// import Event from "./components/admin/AddEvent/AddEvent";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="min-div">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/under" element={<Under />} />
          {/* <Route path="/event" element={<Event />} /> */}

          {/* Protected Routes for Admin */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<Admin />}>
              {/* Nested Routes under /admin */}
              <Route path="users" element={<Users />} />
              <Route path="events" element={<Event />} />

              <Route path="add-event" element={<AddEvent />} />
              <Route path="edit-event/:id" element={<EditEvent />} />
            </Route>
          </Route>

          {/* 404 Page for Unmatched Routes */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;