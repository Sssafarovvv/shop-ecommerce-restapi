import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../models/UserSchema.js';
export default class JWT {
    async generateAccessToken(email, password, id) {
        password = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            const token = jwt.sign({
                email,
                password,
                id,
            }, process.env.JWT_SECRET, { expiresIn: '604800s' });
            users
                .updateOne({
                email,
                password,
            }, {
                $set: { access_token: token },
            })
                .then(() => {
                resolve(token);
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    // middleware
    async authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null)
            return res.sendStatus(401);
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err)
                return res.status(403).send(err);
            req.user = user;
            next();
        });
    }
    async authenticateSocketToken(socket, next) {
        if (socket.handshake.query && socket.handshake.query.token) {
            const token = socket.handshake.query.token;
            jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
                if (err) {
                    socket.disconnect();
                    return next(new Error('Authentication error'));
                }
                const foundUser = await users.findOne({ username: user.username }).lean();
                if (!foundUser) {
                    socket.disconnect();
                    return next(new Error('Authentication error'));
                }
                const passwordMatch = await bcrypt.compare(user.password, foundUser.password);
                if (!passwordMatch) {
                    socket.disconnect();
                    return next(new Error('Authentication error'));
                }
                socket.user = user;
                next();
            });
        }
        else {
            socket.disconnect();
            return next(new Error('Authentication error'));
        }
    }
}
//# sourceMappingURL=JWT.js.map