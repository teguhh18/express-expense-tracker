const jsonwebtoken = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const jwt_payload = jsonwebtoken.verify(accessToken, process.env.jwt_salt);
    req.user = jwt_payload;
  } catch (error) {
    return res.status(401).json({ status: "failed", message: "Unauthorized" });
  }
  next();
};

module.exports = auth;
