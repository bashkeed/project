// server/middleware/auth.js
import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; 
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export const adminAuth = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.role!=="admin"){
      return res.status(401).json({ msg: "You are not an admin, authorization denied" });
    }
    req.userId = decoded.userId; 
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;

