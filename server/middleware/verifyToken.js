import jwt from "jsonwebtoken";

export const verifyUserToken = async (req, res, next) => {
    const token = req.cookies.token;
    console.log(token, "token In verfiyusertoken");

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided." });
    }

    try {
        const decoded =await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  
        console.log(decoded, "decoded data");
        
        next(); 
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Token expired or invalid." });
    }
};


export const verifyAdmin = (req, res, next) => {
    console.log(req.user.role, "req.user.role");
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Only admins can perform this action." });
    }
    next();
};