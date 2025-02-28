
const ApiUrl = import.meta.env.Backend_APP_API_URL || "http://localhost:9080";
// const ApiUrl = "http://localhost:9080";

//Common Api Routes for Event Curd
const eventApis = `${ApiUrl}/api/events`;
const getAllEvent = `${ApiUrl}/api/events`;
//! Wait to change

//TODO:- User Handle by admin like curd
const getAllUsers = `${ApiUrl}/api/user`;
const EditUsers = `${ApiUrl}/api/user`;
const updateUser = `${ApiUrl}/api/user`;
const ChangeUsersRole = `${ApiUrl}/api/user`;

const EditUser = `${ApiUrl}/api/user`;


//Common Routes for User
//TODO:- Auth Backend Urls

const ApiurlAuth = `${ApiUrl}/api/auth`;
const register = `${ApiurlAuth}/register`;
const loginApi = `${ApiurlAuth}/login`;
const logoutApi = `${ApiurlAuth}/logout`;
export {
  ApiUrl,
  register,
  loginApi,
  logoutApi,
  getAllUsers,
  EditUsers,
  ChangeUsersRole,
  updateUser,
  EditUser,
  eventApis,
  getAllEvent
};
