import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    const isProduction = process.env.NODE_ENV !== 'development';

    res.cookie('jwt', token, {
        httpOnly: true,
        // In production (Vercel cross-origin), cookies MUST be:
        //   secure: true  →  only sent over HTTPS
        //   sameSite: 'none'  →  allows cross-origin sending
        // In development (localhost), sameSite: 'lax' works fine
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

export default generateToken;
