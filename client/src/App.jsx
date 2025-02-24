import { Route, Routes } from "react-router-dom";

// Common UI components
import Navbar from "./components/common/Navbar/Navbar";
import Footer from "./components/common/Footer/Footer";

// Public pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import EventDetails from "./pages/EventDetails";
import ProtectedRoute from "./components/ProtectedRoute";

// Protected user routes
import AllEvents from "./pages/Home";

// Admin pages
import Admin from "./components/admin/Admin";
import Users from "./components/admin/pages/Users/Users";
import Event from "./components/admin/pages/Event";
import AddEvent from "./components/admin/pages/AddEvent";
import EditEvent from "./components/admin/pages/EditEvent";

// Not-found page
import NotFound from "./pages/NotFound";
import AdminDashBoard from "./components/admin/AdminDashBoard";
import UserEdits from "./components/admin/pages/Users/UserEdits";

const App = () => {
  return (
    <>
      {/* Navbar for all pages */}
      <Navbar />

      {/* Main content area */}
      <div className="min-div">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AllEvents />} />
          <Route path="/eventDetails/:id" element={<EventDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes for Admin */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<Admin />}>
              {/* Default route for /admin */}
              <Route index element={<AdminDashBoard />} /> {/* Fixed syntax error */}
              <Route path="users" element={<Users />} />
              <Route path="edit-user/:id" element={<UserEdits />} />

              <Route path="events" element={<Event />} />
              <Route path="addevent" element={<AddEvent />} />
              <Route path="edit-event/:id" element={<EditEvent />} />
            </Route>
          </Route>

          {/* 404 Page for Unmatched Routes */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Footer for all pages */}
      <Footer />
    </>
  );
};

export default App;