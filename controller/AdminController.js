import { User } from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import { catchAsyncErrors } from "../Middleware/CatchAsync.js";
import ErrorHandler from "../Middleware/ErrorHandler.js";
import { webToken } from "../utils/JwtToken.js";

export const AdminRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !password 
  ) {
    return res.status(400).json({
      success:false,
      message:'Please Fill All Credentials!'
    })
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Admin with This Email Already Exists!", 400)
    );
  }
  const hashPassword = await bcrypt.hash(password, 10)
    let user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      password : hashPassword,
      role:"Admin",
    });
    
    res.status(200).json({
      success: true,
      message: "New Admin Registered",
      user,
    });
})

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  return res.status(200).json({
    success: true,
    doctors,
  });
});

export const getAllUsers = catchAsyncErrors(async(req,res, next) => {
  let user = await req.user;
  return res.status(200).json({
    success: true,
    user,
  });

});

export const loginAdmin = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role  } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isAdmin = await User.findOne({ email }).select("+password");
  if (!isAdmin) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const comparePassword = await bcrypt.compare(password, isAdmin.password);
  console.log(comparePassword)
  if (!comparePassword) {
    return res.status(400).json({
      success: false,
      message: 'Password is incorrect'
    });
  }

  if (role !== isAdmin.role) {
    return next(new ErrorHandler("Admin Not found in this role", 400));
  }
  webToken(isAdmin, "Admin logged In Successfully", 200, res);
 
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure:true,
      sameSite:"None"
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});
