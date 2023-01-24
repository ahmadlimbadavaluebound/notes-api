const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let bearerToken = req.headers.token;
  if (bearerToken) {
    bearerToken = bearerToken.split(" ")[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.status(403).json({
          status: 403,
          success: false,
          message: "Invalid Token!",
        });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({
      status: 401,
      message: "You are not authenticated",
    });
  }
};

const verifyTokenAndAuthorize = (roles = []) => {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (typeof roles === "string") {
        roles = [roles];
      }
      if (
        (roles.some((r) => req.user.roles.includes(r)) &&
          req.user.roles.includes("admin")) ||
        !req.params.id ||
        req.user.id === req.params.id
      ) {
        next();
      } else {
        res.status(403).json({
          status: 403,
          success: false,
          message: "You are not authorized to perform this action",
        });
      }
    });
  };
};

module.exports = { verifyToken, verifyTokenAndAuthorize };
