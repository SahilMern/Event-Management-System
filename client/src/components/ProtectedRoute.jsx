import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ roles }) => {
  const { user } = useSelector((state) => state.auth);
  console.log(user, "Details About User in Protected Routes");

  //! Redirect To login page i user not founded in state
  if (!user) {
    return <Navigate to="/login" />;
  }

  //! User Not Access the Admin pages
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
