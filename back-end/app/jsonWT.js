const jwt = require("jsonwebtoken");

const generateJWT = (user) => {
    return jwt.sign(
        {
            ID: user,
        },
        "Churrisbanca-ci0143-I-2024",
        {
            expiresIn: "1h",
        }
    );
};

const checkToken = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, "Churrisbanca-ci0143-I-2024");
            req.user = decoded;
            return next();
        } catch (exception) {
            const error = new Error("Invalid token");
            return res.status(403).json({ message: error.message });
        }
    }
    if (!token) {
        const error = new Error("Invalid token or bearer");
        res.status(403).json({ message: error.message });
    }
};

module.exports = { generateJWT, checkToken };
