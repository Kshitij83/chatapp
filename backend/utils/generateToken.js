import jwt from 'jsonwebtoken'

const generateToken = (userId, res) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: '15d'
  });
  res.cookie("jwt",token,{
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, //to prevent cross-site scripting attacks
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV === "production" ? true : false
  });
};

export default generateToken;