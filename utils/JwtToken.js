import jwt from "jsonwebtoken";

export const webToken = (user, message, statusCode, res) => {
  const generateWebToken = jwt.sign(
    { UserId: user._id,  }, 
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.COOKIE_EXPIRE * 24 * 60 * 60 }
  );
  const cookieName = user.role === 'Admin'? 'adminToken': "patientToken"

  return res
    .cookie(cookieName, generateWebToken, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure:true,
      sameSite:"None"
    })
    .status(statusCode)
    .json({
      success: true,
      message,
      generateWebToken,
    });
};
