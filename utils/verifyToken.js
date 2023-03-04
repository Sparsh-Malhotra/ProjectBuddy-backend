import jwt from 'jsonwebtoken'
const verifyToken =  (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

export default verifyToken
