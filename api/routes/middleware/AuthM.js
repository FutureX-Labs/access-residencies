const Jwt = require("jsonwebtoken");

function auth(req, res, next) {
  var token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decode = Jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;
    next();
  } catch (ex) {
    return res.status(401).send("Invalid token");
  }
}
module.exports = auth;
