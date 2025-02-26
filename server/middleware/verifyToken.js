import jwt from "jsonwebtoken";

export const verifyUserToken = async (req, res) => {
    const token = req.cookies.token;
    console.log(token, "token");

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        res.status(200).json({ authenticated: true, user: decoded });
    } catch (error) {
        res.status(401).json({ error: "Unauthorized: Invalid token." });
    }
};