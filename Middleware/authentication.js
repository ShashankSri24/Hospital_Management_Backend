import { User } from "../models/UserSchema.js";
import { catchAsyncErrors } from "./CatchAsync.js";
import jwt from 'jsonwebtoken';
import ErrorHandler from "./ErrorHandler.js";

export const isAdminAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.adminToken;
   
    if (!token) {
      return next(
        new ErrorHandler("Admin User is not authenticated!", 400)
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.UserId);
    if (req.user.role !== "Admin") {
      return next(
        new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
      );
    }
    
    next();
  }
);

export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.patientToken;
   
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Patient is not authenticated'
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.UserId);
    if (req.user.role !== "Patient") {
      return next(
        new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
      );
    }
    next();
  }
);