// const ApiUrl = process.env.REACT_APP_API_URL || "http://localhost:9080";
const ApiUrl =  "http://localhost:9080";

//TODO:- Auth Backend Urls
const ApiurlAuth = `${ApiUrl}/api/auth`;
const register = `${ApiurlAuth}/register`;
const loginApi = `${ApiurlAuth}/login`;
const logoutApi = `${ApiurlAuth}/logout`;


//TODO:- Events Backend Urls
const getAllEvent = `${ApiUrl}/api/events` //? old uri // http://localhost:9080/api/events for refrence

const AddEventApi = `${ApiUrl}/api/events`;
const EditEventApi = `${ApiUrl}/api/events`
// http://localhost:9080/api/events
const singleEventDetails = `${ApiUrl}/api/events`

//TODO:- User Handle by admin like curd
const getAllUsers = `${ApiUrl}/api/user`;
const EditUsers = `${ApiUrl}/api/user`;
const updateUser = `${ApiUrl}/api/user`
const ChangeUsersRole = `${ApiUrl}/api/user`;


export { ApiUrl, register, loginApi,logoutApi,getAllEvent, getAllUsers, EditUsers ,ChangeUsersRole, updateUser , AddEventApi, EditEventApi, singleEventDetails};
