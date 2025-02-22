// const ApiUrl = process.env.REACT_APP_API_URL || "http://localhost:9080";
const ApiUrl = "http://localhost:9080";

const register = `${ApiUrl}/api/auth/register`;
const login = `${ApiUrl}/api/auth/login`;

export { ApiUrl, register, login };
