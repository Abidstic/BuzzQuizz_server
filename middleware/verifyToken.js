import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Get token from headers
    const authorizationHeader =
        req.headers.authorization || req.headers.Authorization;
    let token = null;

    // Handle Bearer token format
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        token = authorizationHeader.slice(7, authorizationHeader.length);
    } else {
        token = authorizationHeader;
    }

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    // Check if JWT secret is defined
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT secret is not defined.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            userRole: decoded.userRole,
        };

        // Call next middleware or route handler
        next();
    } catch (err) {
        return res
            .status(403)
            .json({ message: 'Failed to authenticate token.' });
    }
};

export default verifyToken;
