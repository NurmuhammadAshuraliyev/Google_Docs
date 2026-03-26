import { verifyToken } from "../utils/jwt.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Token yo‘q" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token noto‘g‘ri yoki muddati tugagan" });
  }
};
