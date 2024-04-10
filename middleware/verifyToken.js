import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization || req.headers.Authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const userRole = decoded.userRole;
        req.user = {
            userId: userId,
            userRole: userRole,
        };

        next();
    } catch (err) {
        return res
            .status(403)
            .json({ message: 'Failed to authenticate token.' });
    }
};

export default verifyToken;
