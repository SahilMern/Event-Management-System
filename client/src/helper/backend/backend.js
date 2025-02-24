// const ApiUrl = process.env.REACT_APP_API_URL || "http://localhost:9080";
const ApiUrl = "http://localhost:9080";

//TODO:- Auth Backend Urls
const ApiurlAuth = `${ApiUrl}/api/auth`;
const register = `${ApiurlAuth}/register`;
const login = `${ApiurlAuth}/login`;

//TODO:- Events Backend Urls
const ApiurlEvent = `${ApiUrl}/api/events`;
const getAllProducts = `${ApiUrl}`


export { ApiUrl, register, login, getAllProducts };
