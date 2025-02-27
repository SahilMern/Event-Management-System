import { Route, Routes } from "react-router-dom";

//TODO:- Common UI components
import Navbar from "./components/common/Navbar/Navbar";
import Footer from "./components/common/Footer/Footer";

//TODO:- Public pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import EventDetails from "./pages/EventDetails";
import ProtectedRoute from "./components/ProtectedRoute";

//TODO:- Protected user routes
import AllEvents from "./pages/Home";

//TODO:- Admin pages
import Admin from "./components/admin/Admin";
import Users from "./components/admin/pages/Users/Users";
import Event from "./components/admin/pages/Event";
import AddEvent from "./components/admin/pages/AddEvent";
import EditEvent from "./components/admin/pages/EditEvent";
import AdminDashBoard from "./components/admin/AdminDashBoard";
import UserEdits from "./components/admin/pages/Users/UserEdits";

// Not-found page
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <>
      <Navbar />

      <div className="min-div">
        <Routes>
          {/* //! User Routes */}
          <Route path="/" element={<AllEvents />} />
          <Route path="/eventDetails/:id" element={<EventDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* //! Admin Routes */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<Admin />}>
              <Route index element={<AdminDashBoard />} />

              {/* User Curd */}
              <Route path="users" element={<Users />} />
              <Route path="edit-user/:id" element={<UserEdits />} />

              {/* Event Curd */}
              <Route path="events" element={<Event />} />
              <Route path="addevent" element={<AddEvent />} />
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
